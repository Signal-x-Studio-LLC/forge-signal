#!/usr/bin/env node
/**
 * Demo reel generator (VIDEO) — captured product video + timed manifest → narrated MP4.
 *
 * The motion half of the off-site reel pipeline (rally-hq → forge-signal; see
 * docs/plans/SPEC-reel-pipeline.md in rally-hq). Unlike generate.mjs (still screenshots),
 * the visual track is a REAL recording of the product (a demo-player tour). This script
 * lays the narration + timed captions + brand band over it:
 *
 *   1. Trim the manifest's leadInMs off the front (page-load before the tour started)
 *   2. Per narrated step: OpenAI/ElevenLabs TTS → audio/NN.mp3, caption overlay PNG
 *   3. ffmpeg: overlay each caption on its [startMs,endMs] window, place each narration
 *      clip at its startMs (adelay), mix → narrated, captioned MP4
 *
 * No third-party at playback — the artifact is a self-hosted MP4.
 *
 * Manifest contract (emitted by rally-hq's record-reel harness):
 *   { tour, leadInMs, totalMs, steps: [{ speechText, startMs, durationMs }] }
 *   startMs/durationMs are relative to tour start (i.e. AFTER leadInMs is trimmed).
 *
 * Usage:
 *   REEL_VIDEO=in.webm REEL_MANIFEST=in.manifest.json REEL_OUT=out/reel.mp4 \
 *     node generate-video.mjs
 *
 * Env: OPENAI_API_KEY or ELEVENLABS_API_KEY (auto-sourced from rally-hq/.env.local),
 *      TTS_VOICE, TTS_MODEL, SKIP_TTS=1 (reuse audio/*.mp3 for fast iteration).
 */
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import {
	loadKey,
	createTTS,
	probeDuration,
	probeDimensions,
	probeFrameRate,
	renderCaptionPng,
	CAPTION_BAND_H
} from './lib.mjs'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const AUDIO_DIR = path.join(ROOT, 'audio')
const FRAMES_DIR = path.join(ROOT, 'frames')
const OUT_DIR = path.join(ROOT, 'out')
for (const d of [AUDIO_DIR, FRAMES_DIR, OUT_DIR]) fs.mkdirSync(d, { recursive: true })

// ─── inputs ──────────────────────────────────────────────────────────
const VIDEO = process.env.REEL_VIDEO
const MANIFEST = process.env.REEL_MANIFEST
const OUT = process.env.REEL_OUT || path.join(OUT_DIR, 'reel.mp4')
if (!VIDEO || !MANIFEST) throw new Error('Set REEL_VIDEO and REEL_MANIFEST')
if (!fs.existsSync(VIDEO)) throw new Error(`Video not found: ${VIDEO}`)
if (!fs.existsSync(MANIFEST)) throw new Error(`Manifest not found: ${MANIFEST}`)

const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf-8'))
const steps = (manifest.steps || []).filter((s) => s.speechText && s.speechText.trim())
if (steps.length === 0) throw new Error('Manifest has no narrated steps')
const leadInSec = Math.max(0, (manifest.leadInMs || 0) / 1000)

// ─── TTS backend ─────────────────────────────────────────────────────
// Key search order: process.env → forge-signal repo-root .env (gitignored, canonical
// local secret location) → this template's .env → rally-hq/.env.local.
const repoEnv = path.resolve(ROOT, '../../.env')
const rallyEnv = path.resolve(process.env.HOME || '', 'Workspace/dev/apps/rally-hq/.env.local')
const envSearch = [repoEnv, path.join(ROOT, '.env'), rallyEnv]
const elevenLabsKey = loadKey('ELEVENLABS_API_KEY', envSearch)
const openAiKey = loadKey('OPENAI_API_KEY', envSearch)
// Default narration voice: the chosen ElevenLabs voice (override with TTS_VOICE).
const voice = process.env.TTS_VOICE || (elevenLabsKey ? 'S9NKLs1GeSTKzXd9D0Lf' : 'onyx')
const model =
	process.env.TTS_MODEL || (elevenLabsKey ? 'eleven_multilingual_v2' : 'gpt-4o-mini-tts')
const tts = createTTS({ elevenLabsKey, openAiKey, voice, model, instructions: manifest.instructions })

const skipTTS = process.env.SKIP_TTS === '1'
// Captions-only cut: keep the timed caption overlays, omit the narration track entirely
// (for dropping your own voiceover on in an editor). No TTS calls, no audio in the mux.
const noAudio = process.env.REEL_NO_AUDIO === '1'
// Caption placement: append a band BELOW the video (default, for 16:9 desktop captures so
// the UI is never covered) vs OVERLAY the band over the video's lower edge (for vertical
// mobile captures that already fill the 9:16 frame — there's no room to append).
const overlayCaptions = process.env.REEL_CAPTION_OVERLAY === '1'
const sec = (ms) => (ms / 1000).toFixed(3)

async function main() {
	console.log(`\nDemo reel (video) generator`)
	console.log(`  video:    ${VIDEO}`)
	console.log(`  manifest: ${MANIFEST} (${steps.length} narrated steps, leadIn ${leadInSec}s)`)
	console.log(`  voice:    ${voice} (${tts.backend}: ${model})`)
	console.log(`  output:   ${OUT}\n`)

	// Caption overlays must match the actual recorded video size, not a fixed constant.
	// Default: append the band BELOW the video (pad the frame by CAPTION_BAND_H) so the
	// screenshot stays full-frame. Overlay mode: keep the frame and lay the band over the
	// video's lower edge (vertical reels already fill 9:16).
	const probed = probeDimensions(VIDEO)
	// REEL_OUT_W/H upscale the working canvas (overlay mode only) — a native mobile capture
	// is small (e.g. 432-wide) but social wants ≥1080; scaling here keeps the caption band
	// + fonts proportional to the final frame instead of huge on the small capture.
	const width = (overlayCaptions && Number(process.env.REEL_OUT_W)) || probed.width
	const height = (overlayCaptions && Number(process.env.REEL_OUT_H)) || probed.height
	const outH = overlayCaptions ? height : height + CAPTION_BAND_H
	// Encode at the capture's own frame rate — resampling (e.g. 25→30) duplicates frames
	// on a non-integer cadence and shows up as a constant flicker.
	const fps = probeFrameRate(VIDEO)
	console.log(`  video size: ${width}x${height} → output ${width}x${outH} (caption band below)`)

	// 1. Per-step caption overlays + (unless captions-only) a SINGLE-PASS narration track.
	console.log(noAudio ? '[1/3] Caption overlays (no narration)' : '[1/3] Captions + single-pass narration')
	const framePaths = []
	for (let i = 0; i < steps.length; i++) {
		const idx = String(i + 1).padStart(2, '0')
		const framePath = path.join(FRAMES_DIR, `cap-${idx}.png`)
		// Caption canvas is the PADDED height so the band lands in the appended bottom
		// strip (y = height), clear of the screenshot above it.
		renderCaptionPng({ caption: steps[i].speechText, position: 'bottom', width, height: outH }, framePath)
		framePaths.push(framePath)
	}
	// Narration is ONE ElevenLabs generation of the whole script (a single continuous voice —
	// no per-clip stitching seams, which sound klunky at the joins), then SLICED into per-beat
	// clips at the between-beat pauses so each beat still lands on its video cue. Beats are
	// joined by blank lines so the model breathes between them, giving clean cut points.
	const SEP = '\n\n'
	const clipPaths = []
	if (!noAudio) {
		const fullAudio = path.join(AUDIO_DIR, 'narration.mp3')
		const fullText = steps.map((s) => s.speechText.trim()).join(SEP)
		if (tts.timed) {
			console.log(`  one-pass narration (timestamped) → ${fullText.length} chars, slicing ${steps.length} beats`)
			const al = await tts.timed(fullText, fullAudio)
			const n = Math.min(al.starts.length, al.ends.length)
			let off = 0
			for (let k = 0; k < steps.length; k++) {
				const len = steps[k].speechText.trim().length
				const startSec = al.starts[Math.min(off, n - 1)] ?? 0
				const endSec = al.ends[Math.min(off + len - 1, n - 1)] ?? startSec
				const clip = path.join(AUDIO_DIR, `v${String(k + 1).padStart(2, '0')}.mp3`)
				execFileSync(
					'ffmpeg',
					['-y', '-i', fullAudio, '-ss', startSec.toFixed(3), '-to', endSec.toFixed(3),
						'-c:a', 'libmp3lame', '-q:a', '2', clip],
					{ stdio: ['ignore', 'ignore', 'inherit'] }
				)
				clipPaths.push(clip)
				off += len + SEP.length
			}
		} else {
			// OpenAI fallback (no timestamps): per-step generation.
			for (let k = 0; k < steps.length; k++) {
				const clip = path.join(AUDIO_DIR, `v${String(k + 1).padStart(2, '0')}.mp3`)
				await tts.generate(steps[k].speechText, clip)
				clipPaths.push(clip)
			}
		}
	}

	// 2. Build the ffmpeg graph: trim lead-in, overlay timed captions, place narration.
	console.log('\n[2/3] Compositing narration + captions over the video')
	const inputs = ['-ss', sec(manifest.leadInMs || 0), '-i', VIDEO]
	framePaths.forEach((f) => inputs.push('-i', f))
	if (!noAudio) clipPaths.forEach((c) => inputs.push('-i', c))

	const nFrames = framePaths.length
	const filters = []

	// Default: pad the video into the taller output frame (band appended at the bottom) so
	// the screenshot is full-frame and captions overlay the padding. Overlay mode: no pad —
	// the caption band lands over the video's lower edge.
	filters.push(
		overlayCaptions
			? `[0:v]scale=${width}:${height}[base]`
			: `[0:v]pad=${width}:${outH}:0:0:black[base]`
	)

	// Caption overlay chain — each caption is visible only on its [start, end] window.
	let vlabel = 'base'
	steps.forEach((s, i) => {
		const start = sec(s.startMs)
		const end = sec(s.startMs + s.durationMs)
		const capInput = 1 + i // frame inputs start at index 1
		const out = i === steps.length - 1 ? 'vout' : `v${i}`
		filters.push(
			`[${vlabel}][${capInput}:v]overlay=0:0:enable='between(t,${start},${end})'[${out}]`
		)
		vlabel = out
	})

	// Narration — each beat's clip (sliced from the one generation) delayed to its cue, then
	// summed. The clips are non-overlapping (paced) so this is placement, not mixing; the
	// voice is continuous across them because they're one take. Skipped for the silent cut.
	if (!noAudio) {
		const amixLabels = []
		steps.forEach((s, i) => {
			const audioInput = 1 + nFrames + i
			filters.push(`[${audioInput}:a]adelay=${s.startMs}|${s.startMs}[a${i}]`)
			amixLabels.push(`[a${i}]`)
		})
		filters.push(`${amixLabels.join('')}amix=inputs=${steps.length}:normalize=0[aout]`)
	}

	const args = [
		'-y',
		...inputs,
		'-filter_complex', filters.join(';'),
		'-map', '[vout]',
		// Narration track, or none (captions-only cut → bring your own voiceover).
		...(noAudio ? ['-an'] : ['-map', '[aout]', '-c:a', 'aac', '-b:a', '192k', '-shortest']),
		'-c:v', 'libx264',
		'-pix_fmt', 'yuv420p',
		'-r', fps,
		'-movflags', '+faststart',
		OUT
	]
	execFileSync('ffmpeg', args, { stdio: ['ignore', 'inherit', 'inherit'] })

	// 3. Report
	console.log('\n[3/3] Done')
	const stat = fs.statSync(OUT)
	const dur = probeDuration(OUT)
	console.log(`\n✓ ${OUT}`)
	console.log(`  ${(stat.size / 1024 / 1024).toFixed(1)} MB · ${dur.toFixed(1)}s`)
}

main().catch((err) => {
	console.error('\n✗', err.message)
	process.exit(1)
})

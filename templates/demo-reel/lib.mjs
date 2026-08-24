/**
 * Shared demo-reel helpers — TTS, key loading, caption rendering, video constants.
 *
 * Used by both generators:
 *   generate.mjs        — stills + narration → MP4 (offline screenshot reel)
 *   generate-video.mjs  — captured product VIDEO + timed manifest → narrated MP4
 *                         (the rally-hq demo-player reel pipeline; see SPEC-reel-pipeline.md)
 */
import fs from 'node:fs'
import { execFileSync } from 'node:child_process'

// ─── layout / brand constants ───────────────────────────────────────
export const VIDEO_W = 1440
export const VIDEO_H = 900
export const CAPTION_BAND_H = 220
export const CAPTION_PAD_X = 60
export const CAPTION_PAD_TOP = 22
export const TITLE_FONT_SIZE = 30
export const CAPTION_FONT_SIZE = 20
export const BG_COLOR = '#0a0a0a'
export const ACCENT_COLOR = '#10b981'

// ElevenLabs pre-built voices that suit narration.
export const ELEVENLABS_VOICES = {
	george: 'JBFqnCBsd6RMkjVDRZzb',
	rachel: '21m00Tcm4TlvDq8ikWAM',
	adam: 'pNInz6obpgDQGcFmaJgB',
	josh: 'TxGEqnHWrfWFTfGW9XjX',
	sam: 'yoZ06aMxZJJ28mfd3POQ',
	charlie: 'IKne3meq5aSn9XLyUdCD'
}

/** Read an env var, falling back to scanning the given .env-style files. */
export function loadKey(name, searchPaths = []) {
	if (process.env[name]) return process.env[name]
	for (const p of searchPaths) {
		if (!fs.existsSync(p)) continue
		const match = fs.readFileSync(p, 'utf-8').match(new RegExp(`^${name}=(.+)$`, 'm'))
		if (match) return match[1].trim().replace(/^["']|["']$/g, '')
	}
	return null
}

/**
 * Build a TTS function bound to whichever backend is configured. ElevenLabs is
 * preferred when its key is present; OpenAI is the fallback. Returns an async
 * `(text, outputPath) => void` plus the resolved backend name for logging.
 */
export function createTTS({ elevenLabsKey, openAiKey, voice, model, instructions }) {
	if (!elevenLabsKey && !openAiKey) {
		throw new Error('Set ELEVENLABS_API_KEY (preferred) or OPENAI_API_KEY for TTS')
	}
	const backend = elevenLabsKey ? 'elevenlabs' : 'openai'

	// Request-stitching chain (ElevenLabs canonical multi-segment pattern). Each TTS
	// response returns a `request-id` header; passing the prior IDs as
	// `previous_request_ids` conditions the next segment on the ACTUAL prior audio, not
	// just its text — which is what holds the voice's timbre/accent/prosody steady across
	// the separately-generated clips of one reel. Without it, each clip re-rolls within
	// the voice's own `stability` randomness and the accent drifts between sections.
	// Constraints (per docs): max 3 IDs, prior request fully processed (we await the body
	// before the next call), <2h old, not eleven_v3. The chain is per-run state.
	const requestIdChain = []

	async function elevenLabs(text, outputPath, ctx = {}) {
		const voiceId = ELEVENLABS_VOICES[voice?.toLowerCase()] || voice
		// No voice_settings — use the voice id's OWN default config (overriding it fought
		// those defaults). Continuity comes from request stitching (below); previous_text/
		// next_text additionally give the model the surrounding lines for clean boundaries.
		const body = { text, model_id: model }
		if (ctx.previousText) body.previous_text = ctx.previousText
		if (ctx.nextText) body.next_text = ctx.nextText
		if (requestIdChain.length) body.previous_request_ids = requestIdChain.slice(-3)
		const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
			method: 'POST',
			headers: {
				'xi-api-key': elevenLabsKey,
				'Content-Type': 'application/json',
				Accept: 'audio/mpeg'
			},
			body: JSON.stringify(body)
		})
		if (!res.ok) throw new Error(`ElevenLabs TTS failed (${res.status}): ${await res.text()}`)
		fs.writeFileSync(outputPath, Buffer.from(await res.arrayBuffer()))
		// Chain this generation's id forward so the next segment stitches onto it.
		const rid = res.headers.get('request-id') || res.headers.get('x-request-id')
		if (rid) requestIdChain.push(rid)
	}

	async function openAi(text, outputPath) {
		const payload = { model, voice, input: text, response_format: 'mp3' }
		if (instructions && model?.startsWith('gpt-4o')) payload.instructions = instructions
		const res = await fetch('https://api.openai.com/v1/audio/speech', {
			method: 'POST',
			headers: { Authorization: `Bearer ${openAiKey}`, 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		})
		if (!res.ok) throw new Error(`OpenAI TTS failed (${res.status}): ${await res.text()}`)
		fs.writeFileSync(outputPath, Buffer.from(await res.arrayBuffer()))
	}

	/** ElevenLabs with-timestamps: one generation of the whole script, plus per-character
	 *  start/end times. The caller slices the single continuous take into per-beat clips at
	 *  the between-beat pauses — one voice, no stitching seams, but still aligned to the
	 *  paced video. Returns null on the OpenAI backend (no timestamp support). */
	async function elevenLabsTimed(text, outputPath) {
		const voiceId = ELEVENLABS_VOICES[voice?.toLowerCase()] || voice
		const res = await fetch(
			`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps`,
			{
				method: 'POST',
				headers: { 'xi-api-key': elevenLabsKey, 'Content-Type': 'application/json' },
				body: JSON.stringify({ text, model_id: model })
			}
		)
		if (!res.ok) throw new Error(`ElevenLabs timed TTS failed (${res.status}): ${await res.text()}`)
		const data = await res.json()
		fs.writeFileSync(outputPath, Buffer.from(data.audio_base64, 'base64'))
		const a = data.alignment || data.normalized_alignment
		return {
			chars: a.characters,
			starts: a.character_start_times_seconds,
			ends: a.character_end_times_seconds
		}
	}

	return {
		backend,
		generate: backend === 'elevenlabs' ? elevenLabs : openAi,
		timed: backend === 'elevenlabs' ? elevenLabsTimed : null
	}
}

/** Pixel dimensions { width, height } of a video's first video stream, via ffprobe. */
export function probeDimensions(videoPath) {
	const out = execFileSync(
		'ffprobe',
		['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', videoPath],
		{ stdio: ['ignore', 'pipe', 'inherit'] }
	)
		.toString()
		.trim()
	const [width, height] = out.split(',').map((n) => parseInt(n, 10))
	return { width, height }
}

/** Source frame rate as an ffmpeg-ready string (e.g. "25/1"), via ffprobe. The output
 *  MUST be encoded at this rate: resampling the capture to a different fps (e.g. 25→30)
 *  duplicates frames on a non-integer cadence, which reads as a constant judder/flicker. */
export function probeFrameRate(videoPath) {
	const out = execFileSync(
		'ffprobe',
		['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=r_frame_rate', '-of', 'csv=p=0', videoPath],
		{ stdio: ['ignore', 'pipe', 'inherit'] }
	)
		.toString()
		.trim()
	// Guard against an unreadable/zero rate; fall back to a sane 25 (Playwright's default).
	return /^\d+\/\d+$/.test(out) && !out.startsWith('0/') ? out : '25'
}

/** Duration of an audio/video file in seconds, via ffprobe. */
export function probeDuration(mediaPath) {
	const out = execFileSync(
		'ffprobe',
		['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', mediaPath],
		{ stdio: ['ignore', 'pipe', 'inherit'] }
	)
		.toString()
		.trim()
	return parseFloat(out)
}

/**
 * Render a TRANSPARENT caption overlay PNG (band + accent hairline + title + wrapped
 * body), sized to the full frame so ffmpeg can overlay it at 0,0 and toggle it per
 * step with `enable='between(t,...)'`. Position 'top' or 'bottom' anchors the band.
 *
 * width/height default to the stills constants but are passed explicitly for video —
 * the overlay MUST match the actual video dimensions (a captured reel can be any size),
 * otherwise the band overflows / sits at the wrong Y.
 */
export function renderCaptionPng(
	{ title, caption, position = 'bottom', width = VIDEO_W, height = VIDEO_H },
	framePath
) {
	const textWidth = width - CAPTION_PAD_X * 2
	const bandY = position === 'top' ? 0 : height - CAPTION_BAND_H
	const accentY = position === 'top' ? CAPTION_BAND_H - 2 : bandY
	const titleY = bandY + CAPTION_PAD_TOP
	const bodyY = titleY + TITLE_FONT_SIZE + 14

	const args = [
		// Transparent full-frame canvas
		'-size', `${width}x${height}`,
		'xc:none',
		// Translucent band
		'(', '-size', `${width}x${CAPTION_BAND_H}`, 'xc:rgba(10,10,10,0.88)', ')',
		'-gravity', 'northwest', '-geometry', `+0+${bandY}`, '-composite',
		// Accent hairline
		'(', '-size', `${width}x2`, `xc:${ACCENT_COLOR}`, ')',
		'-gravity', 'northwest', '-geometry', `+0+${accentY}`, '-composite'
	]
	if (title) {
		args.push(
			'-font', 'Helvetica-Bold', '-pointsize', String(TITLE_FONT_SIZE), '-fill', '#f5f5f5',
			'-gravity', 'northwest', '-annotate', `+${CAPTION_PAD_X}+${titleY}`, title
		)
	}
	if (caption) {
		args.push(
			'(', '-background', 'none', '-fill', '#d4d4d4', '-font', 'Helvetica',
			'-pointsize', String(CAPTION_FONT_SIZE),
			'-size', `${textWidth}x${CAPTION_BAND_H - (bodyY - bandY) - CAPTION_PAD_TOP}`,
			`caption:${caption}`, ')',
			'-gravity', 'northwest', '-geometry', `+${CAPTION_PAD_X}+${bodyY}`, '-composite'
		)
	}
	args.push(framePath)
	execFileSync('magick', args, { stdio: ['ignore', 'inherit', 'inherit'] })
}

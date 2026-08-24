/**
 * One-shot narration — the whole reel script as a SINGLE TTS generation.
 *
 * Why: a reel's narration is normally synthesized per step (one call each) so the
 * compositor can place each line on its video beat. But separate ElevenLabs calls each
 * re-roll within the voice's `stability` randomness, so timbre/accent can drift between
 * sections. The only way to guarantee ONE perfectly consistent voice is to synthesize the
 * entire script in a single call — there is no second generation to drift. This emits that
 * single MP3 (plus the ordered script) so you can cut it on the beats in an editor.
 *
 * (The automated compositor path uses ElevenLabs request stitching — previous_request_ids
 * — to hold the voice across its per-step calls; this is the manual-editing alternative.)
 *
 * Usage:
 *   REEL_MANIFEST=in.manifest.json REEL_OUT=out/reel-narration.mp3 node narration-oneshot.mjs
 *
 * Env: ELEVENLABS_API_KEY (preferred) or OPENAI_API_KEY — same key search as generate-video.mjs.
 *   TTS_VOICE / TTS_MODEL override the voice id / model.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createTTS, loadKey, probeDuration } from './lib.mjs'

const ROOT = path.dirname(fileURLToPath(import.meta.url))

const MANIFEST = process.env.REEL_MANIFEST
if (!MANIFEST) throw new Error('Set REEL_MANIFEST=<manifest.json>')
const OUT = process.env.REEL_OUT || 'out/reel-narration.mp3'
fs.mkdirSync(path.dirname(OUT), { recursive: true })

const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf-8'))
const lines = (manifest.steps || []).map((s) => s.speechText?.trim()).filter(Boolean)
if (lines.length === 0) throw new Error('Manifest has no narrated steps')

// One blank line between beats: ElevenLabs reads the paragraph break as a natural pause,
// which also marks where to cut in an editor. The whole thing is ONE generation.
const fullText = lines.join('\n\n')

const repoEnv = path.resolve(ROOT, '../../.env')
const rallyEnv = path.resolve(process.env.HOME || '', 'Workspace/dev/apps/rally-hq/.env.local')
const envSearch = [repoEnv, path.join(ROOT, '.env'), rallyEnv]
const elevenLabsKey = loadKey('ELEVENLABS_API_KEY', envSearch)
const openAiKey = loadKey('OPENAI_API_KEY', envSearch)
const voice = process.env.TTS_VOICE || (elevenLabsKey ? 'S9NKLs1GeSTKzXd9D0Lf' : 'onyx')
const model = process.env.TTS_MODEL || (elevenLabsKey ? 'eleven_multilingual_v2' : 'gpt-4o-mini-tts')
const tts = createTTS({ elevenLabsKey, openAiKey, voice, model, instructions: manifest.instructions })

console.log(`\nOne-shot narration`)
console.log(`  manifest: ${MANIFEST} (${lines.length} beats, ${fullText.length} chars)`)
console.log(`  voice:    ${voice} (${tts.backend}: ${model})`)
console.log(`  output:   ${OUT}\n`)
console.log(`--- script (cut on the blank lines) ---`)
lines.forEach((l, i) => console.log(`  [${String(i + 1).padStart(2, '0')}] ${l}`))
console.log(`---------------------------------------\n`)

// Emit the feedable script as a sibling .txt — paste this whole block into the
// ElevenLabs web UI for one consistent-voice generation (blank lines = beat cuts).
const txtOut = OUT.replace(/\.[^.]+$/, '.txt')
fs.writeFileSync(txtOut, fullText + '\n')
console.log(`✓ ${txtOut}  (paste into ElevenLabs web UI — ${lines.length} beats, blank-line separated)`)

await tts.generate(fullText, OUT)
console.log(`✓ ${OUT}  (${probeDuration(OUT).toFixed(1)}s, single generation — one consistent voice)`)

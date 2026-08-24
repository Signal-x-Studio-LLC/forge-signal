/**
 * Reframe a finished reel into a social aspect ratio (the IG/YouTube format pass).
 *
 * Takes a composited reel (narrated + captioned, 16:9-ish) and centers it on a branded
 * canvas sized for the target platform, with a wordmark + title above and a handle below.
 * We reframe rather than re-capture at a mobile viewport so the carefully-tuned desktop
 * tours (and their hotspots) stay intact — the standard treatment for a desktop product
 * demo on vertical social.
 *
 * Formats:
 *   reel    1080x1920  (IG Reels / YouTube Shorts / TikTok)
 *   square  1080x1080  (IG Feed)
 *   tall    1080x1350  (IG Feed 4:5)
 *
 * Usage:
 *   REEL_VIDEO=out/02-run-tournament-day.mp4 REEL_FORMAT=reel \
 *     REEL_TITLE="Run tournament day" REEL_OUT=out/02-run-day-reel.mp4 node reframe.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { probeDimensions } from './lib.mjs'

const VIDEO = process.env.REEL_VIDEO
if (!VIDEO) throw new Error('Set REEL_VIDEO=<composited reel mp4>')
const FORMAT = process.env.REEL_FORMAT || 'reel'
const TITLE = process.env.REEL_TITLE || ''
const OUT = process.env.REEL_OUT || `out/reframed-${FORMAT}.mp4`
fs.mkdirSync(path.dirname(OUT), { recursive: true })

// Canvas + where the (full-width) video sits vertically. videoTop leaves room for the
// wordmark + title above; the rest below carries the handle. Reels keep the lower ~15%
// clear of important content (platform UI overlaps there).
const FORMATS = {
	reel: { w: 1080, h: 1920, videoTop: 470, wordmark: 120, title: 210, handleUp: 150 },
	square: { w: 1080, h: 1080, videoTop: 150, wordmark: 40, title: 96, handleUp: 60 },
	tall: { w: 1080, h: 1350, videoTop: 300, wordmark: 90, title: 170, handleUp: 90 }
}
const fmt = FORMATS[FORMAT]
if (!fmt) throw new Error(`Unknown REEL_FORMAT '${FORMAT}' (reel | square | tall)`)

const { width: inW, height: inH } = probeDimensions(VIDEO)
const videoH = Math.round((fmt.w * inH) / inW) // video scaled to full canvas width
const GOLD = '#f5b209'

// Branded backdrop (built once via ImageMagick — same Helvetica-Bold as the captions).
const bg = path.join(path.dirname(OUT), `.bg-${FORMAT}.png`)
const args = ['-size', `${fmt.w}x${fmt.h}`, `xc:#0b0b0c`]
args.push('-font', 'Helvetica-Bold', '-fill', GOLD, '-pointsize', '52', '-gravity', 'north',
	'-annotate', `+0+${fmt.wordmark}`, 'RALLY HQ')
if (TITLE) {
	args.push('-font', 'Helvetica-Bold', '-fill', '#ffffff', '-pointsize', '40', '-gravity', 'north',
		'-annotate', `+0+${fmt.title}`, TITLE)
}
args.push('-font', 'Helvetica', '-fill', '#9ca3af', '-pointsize', '30', '-gravity', 'south',
	'-annotate', `+0+${fmt.handleUp}`, 'rallyhq.app')
// Gold hairline under the header, just above the video.
args.push('-fill', GOLD, '-draw',
	`rectangle ${fmt.w / 2 - 60},${fmt.videoTop - 24} ${fmt.w / 2 + 60},${fmt.videoTop - 21}`)
args.push(bg)
execFileSync('magick', args, { stdio: ['ignore', 'inherit', 'inherit'] })

// Overlay the (width-scaled) video onto the backdrop; carry the reel's audio through.
const filter =
	`[1:v]scale=${fmt.w}:-2[v];[0:v][v]overlay=(W-w)/2:${fmt.videoTop}:shortest=1[out]`
execFileSync(
	'ffmpeg',
	['-y', '-loop', '1', '-i', bg, '-i', VIDEO,
		'-filter_complex', filter,
		'-map', '[out]', '-map', '1:a?',
		'-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', '25',
		'-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', OUT],
	{ stdio: ['ignore', 'inherit', 'inherit'] }
)
fs.unlinkSync(bg)

const stat = fs.statSync(OUT)
// eslint-disable-next-line no-console
console.log(`\n✓ ${OUT}  (${fmt.w}x${fmt.h} ${FORMAT}, video ${fmt.w}x${videoH} · ${(stat.size / 1024 / 1024).toFixed(1)} MB)`)

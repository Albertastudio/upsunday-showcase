const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const FRAMES_DIR = path.resolve(__dirname, 'frames_3d');
const WIDTH = 320;
const HEIGHT = 320;

console.log('--- ENCODING VIDEO ASSETS VIA FFMPEG ---');
const showcasePublic = path.resolve(__dirname, 'upsunday-showcase', 'public');
const desktopPublic = 'C:\\Users\\Andrii Zaripov\\Desktop\\An\\Antigravity\\upsunday-showcase\\public';

const posterPath = path.join(showcasePublic, 'motion-alpha-poster.png');
fs.copyFileSync(path.join(FRAMES_DIR, 'frame_000.png'), posterPath);
console.log(`Saved poster: ${(fs.statSync(posterPath).size / 1024).toFixed(1)} KB`);

const webmPath = path.join(showcasePublic, 'motion-alpha.webm');
console.log('Encoding WebM VP9 with native alpha channel...');
execSync(`ffmpeg -y -framerate 30 -i "${path.join(FRAMES_DIR, 'frame_%03d.png')}" -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 250k -crf 32 -auto-alt-ref 0 -an "${webmPath}"`);
console.log(`Saved WebM: ${(fs.statSync(webmPath).size / 1024).toFixed(1)} KB`);

const mp4Path = path.join(showcasePublic, 'motion-alpha.mp4');
console.log('Encoding MP4 fallback on dark composite background (#09090b)...');
execSync(`ffmpeg -y -framerate 30 -i "${path.join(FRAMES_DIR, 'frame_%03d.png')}" -filter_complex "color=c='#09090b':s=${WIDTH}x${HEIGHT}[bg];[bg][0:v]overlay=shortest=1:format=auto" -c:v libx264 -pix_fmt yuv420p -crf 22 -preset veryslow -an "${mp4Path}"`);
console.log(`Saved MP4: ${(fs.statSync(mp4Path).size / 1024).toFixed(1)} KB`);

// Side-by-side comparison image
const sideBySidePath = path.resolve(__dirname, 'monogram-side-by-side.png');
console.log('Generating side-by-side comparison with source logo...');
execSync(`ffmpeg -y -i "${path.resolve(__dirname, 'monogram-source-cropped.png')}" -i "${posterPath}" -filter_complex "[0:v]scale=${WIDTH}:${HEIGHT}[src];color=c='#09090b':s=${WIDTH}x${HEIGHT}[bg];[bg][1:v]overlay=0:0[render];[src][render]hstack=inputs=2" -frames:v 1 "${sideBySidePath}"`);
console.log(`Saved side-by-side comparison: ${(fs.statSync(sideBySidePath).size / 1024).toFixed(1)} KB`);

// Copy to Desktop public directory
console.log('Synchronizing to Desktop showcase public...');
fs.copyFileSync(posterPath, path.join(desktopPublic, 'motion-alpha-poster.png'));
fs.copyFileSync(webmPath, path.join(desktopPublic, 'motion-alpha.webm'));
fs.copyFileSync(mp4Path, path.join(desktopPublic, 'motion-alpha.mp4'));
fs.copyFileSync(sideBySidePath, path.join(desktopPublic, 'monogram-side-by-side.png'));

console.log('=== COMPLETE PRODUCTION ASSET PIPELINE SUCCESS ===');

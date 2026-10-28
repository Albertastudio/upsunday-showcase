// Script to generate a 90-frame seamless organic emerald/cyan kinetic orb with true alpha transparency
const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');

const WIDTH = 320;
const HEIGHT = 320;
const FPS = 30;
const DURATION_SEC = 3.0;
const TOTAL_FRAMES = FPS * DURATION_SEC; // 90 frames

console.log(`Generating ${TOTAL_FRAMES} frames of seamless kinetic alpha orb at ${WIDTH}x${HEIGHT}...`);

// Particle orbits with exact integer frequency multipliers for 100% seamless looping
const particles = [];
const NUM_PARTICLES = 16;
for (let i = 0; i < NUM_PARTICLES; i++) {
  particles.push({
    orbitA: 70 + (i * 17) % 50,
    orbitB: 45 + (i * 23) % 40,
    tilt: (i * Math.PI) / 6,
    freq: (i % 2 === 0 ? 1 : -1) * (1 + (i % 2)),
    phase: (i * 2 * Math.PI) / NUM_PARTICLES,
    size: 2.2 + (i % 3) * 1.0,
    color: i % 3 === 0 ? [34, 211, 238] : [52, 211, 153], // cyan vs emerald
  });
}

function renderFrame(frameIdx, compositeOnDark = false) {
  const buf = Buffer.alloc(WIDTH * HEIGHT * 4);
  const progress = frameIdx / TOTAL_FRAMES; // 0.0 to 1.0
  const tau = Math.PI * 2;
  const t = progress * tau; // 0 to 2*PI

  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;

  // Precompute blob harmonics for this frame
  const harmonic1 = 16 * Math.sin(t);
  const harmonic2 = 12 * Math.cos(t);
  const harmonic3 = 8 * Math.sin(2 * t);

  // Background color for compositeOnDark (#09090b)
  const bgR = 9;
  const bgG = 9;
  const bgB = 11;

  for (let y = 0; y < HEIGHT; y++) {
    const dy = y - cy;
    for (let x = 0; x < WIDTH; x++) {
      const offset = (y * WIDTH + x) * 4;

      if (compositeOnDark) {
        buf[offset] = bgR;
        buf[offset + 1] = bgG;
        buf[offset + 2] = bgB;
        buf[offset + 3] = 255;
      }

      const dx = x - cx;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 145) {
        continue;
      }

      const angle = Math.atan2(dy, dx);

      // Organic fluid deformation radius
      const blobRadius =
        68 +
        harmonic1 * Math.sin(2 * angle + t) +
        harmonic2 * Math.cos(3 * angle - t) +
        harmonic3 * Math.sin(4 * angle + 2 * t) +
        5 * Math.cos(5 * angle - 2 * t);

      const dDist = dist - blobRadius;

      if (dDist < 0) {
        // Inside blob core
        const coreNorm = Math.max(0, 1 + dDist / blobRadius);
        const highlight = Math.pow(coreNorm, 2.5);
        const wave = 0.5 + 0.5 * Math.sin(3 * angle + t * 2 + dist * 0.06);

        // Emerald -> Cyan gradient
        const r = Math.min(255, Math.floor(16 + highlight * 130 + wave * 25));
        const g = Math.min(255, Math.floor(185 + highlight * 70));
        const b = Math.min(255, Math.floor(129 + wave * 80 + highlight * 110));
        
        let alpha = 245;
        if (dDist > -4) {
          alpha = Math.floor(245 * (-dDist / 4));
        }

        if (compositeOnDark) {
          const aNorm = alpha / 255;
          buf[offset] = Math.round(r * aNorm + bgR * (1 - aNorm));
          buf[offset + 1] = Math.round(g * aNorm + bgG * (1 - aNorm));
          buf[offset + 2] = Math.round(b * aNorm + bgB * (1 - aNorm));
        } else {
          buf[offset] = r;
          buf[offset + 1] = g;
          buf[offset + 2] = b;
          buf[offset + 3] = alpha;
        }
      } else if (dDist < 32) {
        // Soft outer aura decaying smoothly to zero
        const glowFactor = Math.exp(-dDist / 9.0);
        const alpha = Math.floor(150 * glowFactor);

        if (alpha > 0) {
          const r = 16;
          const g = 185;
          const b = 129;

          if (compositeOnDark) {
            const aNorm = alpha / 255;
            buf[offset] = Math.round(r * aNorm + buf[offset] * (1 - aNorm));
            buf[offset + 1] = Math.round(g * aNorm + buf[offset + 1] * (1 - aNorm));
            buf[offset + 2] = Math.round(b * aNorm + buf[offset + 2] * (1 - aNorm));
          } else {
            buf[offset] = r;
            buf[offset + 1] = g;
            buf[offset + 2] = b;
            buf[offset + 3] = alpha;
          }
        }
      }
    }
  }

  // Draw floating kinetic particles with soft anti-aliased points
  for (const p of particles) {
    const pAngle = p.phase + p.freq * t;
    const px0 = p.orbitA * Math.cos(pAngle);
    const py0 = p.orbitB * Math.sin(pAngle);

    const cosTilt = Math.cos(p.tilt);
    const sinTilt = Math.sin(p.tilt);
    const px = cx + px0 * cosTilt - py0 * sinTilt;
    const py = cy + px0 * sinTilt + py0 * cosTilt;

    const rRadius = Math.ceil(p.size * 2.5);
    const minX = Math.max(0, Math.floor(px - rRadius));
    const maxX = Math.min(WIDTH - 1, Math.ceil(px + rRadius));
    const minY = Math.max(0, Math.floor(py - rRadius));
    const maxY = Math.min(HEIGHT - 1, Math.ceil(py + rRadius));

    for (let pyi = minY; pyi <= maxY; pyi++) {
      for (let pxi = minX; pxi <= maxX; pxi++) {
        const pdx = pxi - px;
        const pdy = pyi - py;
        const pdist = Math.sqrt(pdx * pdx + pdy * pdy);
        if (pdist < p.size * 2) {
          const pAlpha = Math.floor(255 * Math.exp(-(pdist * pdist) / (p.size * p.size)));
          if (pAlpha > 2) {
            const idx = (pyi * WIDTH + pxi) * 4;
            if (compositeOnDark) {
              const aNorm = pAlpha / 255;
              buf[idx] = Math.min(255, Math.round(p.color[0] * aNorm + buf[idx] * (1 - aNorm)));
              buf[idx + 1] = Math.min(255, Math.round(p.color[1] * aNorm + buf[idx + 1] * (1 - aNorm)));
              buf[idx + 2] = Math.min(255, Math.round(p.color[2] * aNorm + buf[idx + 2] * (1 - aNorm)));
            } else {
              buf[idx] = Math.min(255, buf[idx] + p.color[0]);
              buf[idx + 1] = Math.min(255, buf[idx + 1] + p.color[1]);
              buf[idx + 2] = Math.min(255, buf[idx + 2] + p.color[2]);
              buf[idx + 3] = Math.min(255, buf[idx + 3] + pAlpha);
            }
          }
        }
      }
    }
  }

  return buf;
}

// Function to encode video using ffmpeg directly via stdin
function encodeVideo(outputPath, ffmpegArgs, compositeOnDark = false) {
  return new Promise((resolve, reject) => {
    console.log(`Starting encode for ${outputPath}...`);
    const ffmpeg = spawn('ffmpeg', [
      '-y',
      '-f', 'rawvideo',
      '-pix_fmt', 'rgba',
      '-s', `${WIDTH}x${HEIGHT}`,
      '-r', `${FPS}`,
      '-i', '-',
      ...ffmpegArgs,
      outputPath
    ]);

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        console.log(`Successfully generated ${outputPath} (${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB)`);
        resolve();
      } else {
        reject(new Error(`ffmpeg exited with code ${code}`));
      }
    });

    ffmpeg.on('error', (err) => {
      reject(err);
    });

    // Pipe each rendered frame directly into ffmpeg stdin
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const frameBuf = renderFrame(i, compositeOnDark);
      ffmpeg.stdin.write(frameBuf);
    }
    ffmpeg.stdin.end();
  });
}

async function main() {
  const outputDirs = [
    path.resolve(__dirname, 'upsunday-showcase/public'),
    path.resolve('C:/Users/Andrii Zaripov/Desktop/An/Antigravity/upsunday-showcase/public')
  ];

  for (const outputDir of outputDirs) {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const webmPath = path.join(outputDir, 'motion-alpha.webm');
    const mp4Path = path.join(outputDir, 'motion-alpha.mp4');

    // 1. WebM VP9 with native yuva420p genuine alpha channel
    await encodeVideo(webmPath, [
      '-c:v', 'libvpx-vp9',
      '-pix_fmt', 'yuva420p',
      '-b:v', '280k',
      '-crf', '32',
      '-auto-alt-ref', '0',
    ], false);

    // 2. MP4 H.264 fallback
    await encodeVideo(mp4Path, [
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-crf', '22',
      '-preset', 'slow',
      '-movflags', '+faststart',
    ], true);
  }

  console.log('All alpha videos successfully encoded and saved!');
}

main().catch(console.error);

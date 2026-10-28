const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

const PORT = 8102;
const TOTAL_FRAMES = 120; // 4.0 seconds at 30 fps
const WIDTH = 320;
const HEIGHT = 320;

const FRAMES_DIR = path.resolve(__dirname, 'frames_3d');
if (!fs.existsSync(FRAMES_DIR)) {
  fs.mkdirSync(FRAMES_DIR, { recursive: true });
}

let receivedFrames = 0;
let chromeProcess = null;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; background: transparent; overflow: hidden; }
    canvas { width: ${WIDTH}px; height: ${HEIGHT}px; }
  </style>
</head>
<body>
  <div id="container"></div>
  <script type="importmap">
    {
      "imports": {
        "three": "/node_modules/three/build/three.module.js",
        "three/addons/": "/node_modules/three/examples/jsm/"
      }
    }
  </script>
  <script type="module">
    import * as THREE from 'three';

    const width = ${WIDTH};
    const height = ${HEIGHT};
    const totalFrames = ${TOTAL_FRAMES};

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 1, 1000);
    camera.position.set(0, 0, 335);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(1);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.30;
    document.getElementById('container').appendChild(renderer.domElement);

    // Procedural Studio Environment Map using PMREMGenerator
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envCanvas = document.createElement('canvas');
    envCanvas.width = 1024;
    envCanvas.height = 512;
    const eCtx = envCanvas.getContext('2d');
    const grad = eCtx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#2b303a');
    grad.addColorStop(0.4, '#15171d');
    grad.addColorStop(1, '#1b1e24');
    eCtx.fillStyle = grad;
    eCtx.fillRect(0, 0, 1024, 512);

    // Studio softbox highlights
    eCtx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    eCtx.fillRect(600, 40, 260, 180);
    eCtx.fillStyle = 'rgba(210, 225, 245, 0.60)';
    eCtx.fillRect(90, 80, 220, 200);
    eCtx.fillStyle = 'rgba(16, 185, 129, 0.85)'; // Emerald reflection softbox
    eCtx.fillRect(360, 200, 160, 130);

    const envTexture = new THREE.CanvasTexture(envCanvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;
    const envMap = pmremGenerator.fromEquirectangular(envTexture).texture;
    scene.environment = envMap;

    // Brushed metal striation texture
    const brushCanvas = document.createElement('canvas');
    brushCanvas.width = 256;
    brushCanvas.height = 256;
    const bCtx = brushCanvas.getContext('2d');
    bCtx.fillStyle = '#80808a';
    bCtx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 700; i++) {
      const y = Math.random() * 256;
      const len = 30 + Math.random() * 150;
      const x = Math.random() * 256;
      const alpha = 0.06 + Math.random() * 0.16;
      bCtx.strokeStyle = Math.random() > 0.5 ? 'rgba(255,255,255,' + alpha + ')' : 'rgba(0,0,0,' + alpha + ')';
      bCtx.lineWidth = 0.8 + Math.random() * 1.0;
      bCtx.beginPath();
      bCtx.moveTo(x, y);
      bCtx.lineTo(x + len, y);
      bCtx.stroke();
    }
    const brushTexture = new THREE.CanvasTexture(brushCanvas);
    brushTexture.wrapS = THREE.RepeatWrapping;
    brushTexture.wrapT = THREE.RepeatWrapping;
    brushTexture.repeat.set(3, 3);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.85));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(130, 140, 160);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x94a3b8, 1.5);
    fillLight.position.set(-140, -70, 110);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xcbd5e1, 2.2);
    rimLight.position.set(0, 170, -100);
    scene.add(rimLight);

    // Dynamic Emerald Point Lights
    const emeraldLight1 = new THREE.PointLight(0x10b981, 7.5, 420);
    scene.add(emeraldLight1);

    const emeraldLight2 = new THREE.PointLight(0x34d399, 5.0, 320);
    scene.add(emeraldLight2);

    // Materials - Brushed titanium-zinc like source
    const zincMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x8a92a2,
      metalness: 0.82,
      roughness: 0.22,
      roughnessMap: brushTexture,
      clearcoat: 0.45,
      clearcoatRoughness: 0.15,
      reflectivity: 0.92,
      envMapIntensity: 1.30,
      side: THREE.DoubleSide
    });

    const ringMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x717988,
      metalness: 0.78,
      roughness: 0.26,
      clearcoat: 0.35,
      envMapIntensity: 1.15,
      side: THREE.DoubleSide
    });

    const CX = 480;
    const CY = 480;
    const SCALE = 0.22;

    function tx(px) { return (px - CX) * SCALE; }
    function ty(py) { return -(py - CY) * SCALE; }

    const pivot = new THREE.Group();
    scene.add(pivot);

    const monogramGroup = new THREE.Group();
    pivot.add(monogramGroup);

    // 1. RING SHAPE
    const ringShape = new THREE.Shape();
    ringShape.absarc(0, 0, 336 * SCALE, 0, Math.PI * 2, false);
    const ringHole = new THREE.Path();
    ringHole.absarc(0, 0, 310 * SCALE, 0, Math.PI * 2, true);
    ringShape.holes.push(ringHole);

    const ringGeo = new THREE.ExtrudeGeometry(ringShape, {
      depth: 6,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 1.2,
      bevelThickness: 1.2
    });
    ringGeo.computeVertexNormals();
    const ringMesh = new THREE.Mesh(ringGeo, ringMaterial);
    ringMesh.position.z = 0;
    monogramGroup.add(ringMesh);

    // 2. LETTER "A" SHAPE
    const shapeA = new THREE.Shape();
    shapeA.moveTo(tx(476), ty(95));
    shapeA.lineTo(tx(494), ty(102));
    shapeA.lineTo(tx(636), ty(440));
    shapeA.lineTo(tx(717), ty(680));
    shapeA.lineTo(tx(765), ty(805));
    shapeA.lineTo(tx(805), ty(810));
    shapeA.lineTo(tx(600), ty(810));
    shapeA.bezierCurveTo(tx(620), ty(810), tx(628), ty(795), tx(624), ty(780));
    shapeA.lineTo(tx(545), ty(580));
    shapeA.lineTo(tx(315), ty(580));
    shapeA.lineTo(tx(260), ty(690));
    shapeA.lineTo(tx(310), ty(816));
    shapeA.lineTo(tx(59), ty(816));
    shapeA.bezierCurveTo(tx(100), ty(816), tx(135), ty(795), tx(142), ty(760));
    shapeA.lineTo(tx(142), ty(535));
    shapeA.bezierCurveTo(tx(142), ty(515), tx(150), ty(505), tx(156), ty(505));
    shapeA.bezierCurveTo(tx(166), ty(505), tx(175), ty(520), tx(180), ty(538));
    shapeA.lineTo(tx(195), ty(650));
    shapeA.lineTo(tx(260), ty(690));
    shapeA.lineTo(tx(315), ty(566));
    shapeA.lineTo(tx(435), ty(260));
    shapeA.lineTo(tx(476), ty(95));
    shapeA.closePath();

    const holeA = new THREE.Path();
    holeA.moveTo(tx(476), ty(215));
    holeA.lineTo(tx(530), ty(566));
    holeA.lineTo(tx(325), ty(566));
    holeA.closePath();
    shapeA.holes.push(holeA);

    const geoA = new THREE.ExtrudeGeometry(shapeA, {
      depth: 14,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 1.8,
      bevelThickness: 1.8
    });
    geoA.computeVertexNormals();
    const meshA = new THREE.Mesh(geoA, zincMaterial);
    meshA.position.z = 2.5;
    monogramGroup.add(meshA);

    // 3. LETTER "S" SHAPE
    const shapeS = new THREE.Shape();
    // Start at Finial Top Corner
    shapeS.moveTo(tx(760), ty(140));

    // Boundary 1: Outer Top Arch -> Left Shoulder -> Lower Edge of Diagonal Spine -> Inner Bottom Bowl -> Shelf Right
    shapeS.bezierCurveTo(tx(670), ty(150), tx(500), ty(125), tx(360), ty(125));
    shapeS.bezierCurveTo(tx(240), ty(125), tx(150), ty(180), tx(153), ty(300));
    shapeS.bezierCurveTo(tx(155), ty(380), tx(260), ty(460), tx(420), ty(530));
    shapeS.bezierCurveTo(tx(560), ty(590), tx(680), ty(640), tx(710), ty(690));
    shapeS.bezierCurveTo(tx(730), ty(730), tx(700), ty(780), tx(630), ty(805));
    shapeS.bezierCurveTo(tx(580), ty(815), tx(550), ty(812), tx(535), ty(810));

    // End 2: Shelf
    shapeS.lineTo(tx(475), ty(810));

    // Boundary 2: Outer Bottom Bowl -> Right Flank -> Upper Edge of Diagonal Spine -> Inner Top Arch -> Finial Bottom
    shapeS.bezierCurveTo(tx(500), ty(825), tx(570), ty(830), tx(630), ty(830));
    shapeS.bezierCurveTo(tx(740), ty(815), tx(817), ty(740), tx(817), ty(630));
    shapeS.bezierCurveTo(tx(817), ty(560), tx(700), ty(490), tx(550), ty(430));
    shapeS.bezierCurveTo(tx(420), ty(370), tx(320), ty(320), tx(280), ty(270));
    shapeS.bezierCurveTo(tx(260), ty(230), tx(300), ty(185), tx(420), ty(185));
    shapeS.bezierCurveTo(tx(540), ty(185), tx(660), ty(210), tx(760), ty(380));

    // End 1: Finial face straight UP
    shapeS.lineTo(tx(760), ty(140));
    shapeS.closePath();

    const geoS = new THREE.ExtrudeGeometry(shapeS, {
      depth: 18,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 2.2,
      bevelThickness: 2.2
    });
    geoS.computeVertexNormals();
    const meshS = new THREE.Mesh(geoS, zincMaterial);
    meshS.position.z = 8.5; // S is in foreground
    monogramGroup.add(meshS);

    // Center monogramGroup inside pivot
    const box = new THREE.Box3().setFromObject(monogramGroup);
    const center = box.getCenter(new THREE.Vector3());
    monogramGroup.position.set(-center.x, -center.y, -center.z);

    // Orbiting particle cloud (24 particles)
    const particleCount = 24;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleData = [];

    for (let i = 0; i < particleCount; i++) {
      particleData.push({
        orbitA: 78 + (i * 9) % 25,
        orbitB: 58 + (i * 13) % 20,
        tilt: (i * Math.PI) / 6,
        phase: (i * Math.PI * 2) / particleCount,
      });
    }

    const particleMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 3.5,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Render loop helper
    async function renderAllFrames() {
      for (let frame = 0; frame < totalFrames; frame++) {
        const progress = frame / totalFrames;
        const angle = progress * Math.PI * 2;

        // Smooth continuous 360-degree rotation with subtle tilt
        pivot.rotation.y = angle;
        pivot.rotation.x = Math.sin(angle) * 0.08 + 0.04;
        pivot.rotation.z = Math.cos(angle) * 0.02;

        // Dynamic sweeping emerald lights
        emeraldLight1.position.set(
          Math.cos(angle) * 110,
          Math.sin(angle * 2) * 45 - 20,
          Math.sin(angle) * 110 + 40
        );

        emeraldLight2.position.set(
          -Math.cos(angle) * 90,
          -Math.sin(angle * 2) * 35 + 20,
          -Math.sin(angle) * 90 + 40
        );

        // Update particles
        const pos = positions;
        for (let i = 0; i < particleCount; i++) {
          const pd = particleData[i];
          const pAngle = angle * 1.5 + pd.phase;
          const px = Math.cos(pAngle) * pd.orbitA;
          const py = Math.sin(pAngle) * pd.orbitB;
          pos[i * 3] = px * Math.cos(pd.tilt) - py * Math.sin(pd.tilt);
          pos[i * 3 + 1] = px * Math.sin(pd.tilt) + py * Math.cos(pd.tilt);
          pos[i * 3 + 2] = Math.sin(pAngle * 2) * 22;
        }
        particleGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

        renderer.render(scene, camera);

        const dataUrl = renderer.domElement.toDataURL('image/png');
        await fetch('/frame', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ frame, dataUrl })
        });
      }

      await fetch('/done', { method: 'POST' });
    }

    renderAllFrames();
  </script>
</body>
</html>`);
  } else if (url.pathname.startsWith('/node_modules/')) {
    const filePath = path.resolve(__dirname, 'upsunday-showcase', url.pathname.slice(1));
    if (fs.existsSync(filePath)) {
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404); res.end();
    }
  } else if (url.pathname === '/frame') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      const data = JSON.parse(body);
      const frameNum = String(data.frame).padStart(3, '0');
      const base64Data = data.dataUrl.replace(/^data:image\/png;base64,/, '');
      fs.writeFileSync(path.join(FRAMES_DIR, `frame_${frameNum}.png`), base64Data, 'base64');
      receivedFrames++;
      if (receivedFrames % 20 === 0 || receivedFrames === TOTAL_FRAMES) {
        console.log(`Rendered ${receivedFrames}/${TOTAL_FRAMES} frames`);
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end('{"ok":true}');
    });
  } else if (url.pathname === '/done') {
    console.log('All 120 frames successfully received!');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end('{"ok":true}');

    setTimeout(() => {
      if (chromeProcess) chromeProcess.kill();
      server.close();
      encodeAllVideos();
    }, 500);
  }
});

function encodeAllVideos() {
  console.log('--- ENCODING VIDEO ASSETS VIA FFMPEG ---');
  const showcasePublic = path.resolve(__dirname, 'upsunday-showcase', 'public');
  const desktopPublic = 'C:\\Users\\Andrii Zaripov\\Desktop\\An\\Antigravity\\upsunday-showcase\\public';

  const posterPath = path.join(showcasePublic, 'motion-alpha-poster.png');
  fs.copyFileSync(path.join(FRAMES_DIR, 'frame_000.png'), posterPath);
  console.log(`Saved poster: ${fs.statSync(posterPath).size} bytes`);

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
  execSync(`ffmpeg -y -i "${path.resolve(__dirname, 'monogram-source-cropped.png')}" -i "${posterPath}" -filter_complex "[0:v]scale=${WIDTH}:${HEIGHT}[src];color=c='#09090b':s=${WIDTH}x${HEIGHT}[bg];[bg][1:v]overlay=0:0[render];[src][render]hstack=inputs=2" "${sideBySidePath}"`);
  console.log(`Saved side-by-side comparison: ${sideBySidePath}`);

  // Copy to Desktop public directory
  console.log('Synchronizing to Desktop showcase public...');
  fs.copyFileSync(posterPath, path.join(desktopPublic, 'motion-alpha-poster.png'));
  fs.copyFileSync(webmPath, path.join(desktopPublic, 'motion-alpha.webm'));
  fs.copyFileSync(mp4Path, path.join(desktopPublic, 'motion-alpha.mp4'));
  fs.copyFileSync(sideBySidePath, path.join(desktopPublic, 'monogram-side-by-side.png'));

  console.log('=== COMPLETE PRODUCTION ASSET PIPELINE SUCCESS ===');
  process.exit(0);
}

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `http://localhost:${PORT}`
  ]);
});

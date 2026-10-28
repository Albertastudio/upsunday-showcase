const fs = require('fs');
const path = require('path');

// We have three in node_modules of scratch/upsunday-showcase or scratch
// Let's test requiring three
let THREE;
try {
  THREE = require(path.resolve(__dirname, 'upsunday-showcase/node_modules/three'));
} catch (e) {
  try {
    THREE = require('three');
  } catch (err) {
    console.error('Three not found:', err.message);
    process.exit(1);
  }
}

const CX = 480;
const CY = 480;
const SCALE = 0.22;

function tx(px) { return (px - CX) * SCALE; }
function ty(py) { return -(py - CY) * SCALE; } // invert Y for Three.js

// Shape A
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

// Shape S
const shapeS = new THREE.Shape();
shapeS.moveTo(tx(760), ty(140));
shapeS.lineTo(tx(760), ty(380));
shapeS.bezierCurveTo(tx(755), ty(305), tx(715), ty(245), tx(640), ty(220));
shapeS.bezierCurveTo(tx(550), ty(190), tx(440), ty(190), tx(360), ty(230));
shapeS.bezierCurveTo(tx(290), ty(265), tx(250), ty(310), tx(265), ty(360));
shapeS.bezierCurveTo(tx(275), ty(410), tx(350), ty(475), tx(485), ty(545));
shapeS.bezierCurveTo(tx(620), ty(615), tx(710), ty(665), tx(740), ty(710));
shapeS.bezierCurveTo(tx(755), ty(745), tx(730), ty(785), tx(670), ty(805));
shapeS.bezierCurveTo(tx(620), ty(815), tx(565), ty(812), tx(535), ty(810));
shapeS.lineTo(tx(475), ty(810));
shapeS.bezierCurveTo(tx(535), ty(824), tx(600), ty(834), tx(660), ty(825));
shapeS.bezierCurveTo(tx(755), ty(805), tx(815), ty(730), tx(817), ty(620));
shapeS.bezierCurveTo(tx(817), ty(545), tx(770), ty(485), tx(680), ty(435));
shapeS.bezierCurveTo(tx(570), ty(380), tx(430), ty(320), tx(320), ty(260));
shapeS.bezierCurveTo(tx(230), ty(210), tx(150), ty(235), tx(153), ty(300));
shapeS.bezierCurveTo(tx(155), ty(355), tx(150), ty(260), tx(210), ty(190));
shapeS.bezierCurveTo(tx(265), ty(130), tx(360), ty(120), tx(470), ty(140));
shapeS.bezierCurveTo(tx(570), ty(160), tx(670), ty(185), tx(735), ty(155));
shapeS.lineTo(tx(760), ty(140));
shapeS.closePath();

console.log('Testing ExtrudeGeometry for A...');
const geoA = new THREE.ExtrudeGeometry(shapeA, { depth: 14, bevelEnabled: true, bevelSegments: 3, bevelSize: 1.5, bevelThickness: 1.5 });
console.log('GeoA triangles:', geoA.attributes.position.count / 3);

console.log('Testing ExtrudeGeometry for S...');
const geoS = new THREE.ExtrudeGeometry(shapeS, { depth: 18, bevelEnabled: true, bevelSegments: 3, bevelSize: 2.0, bevelThickness: 2.0 });
console.log('GeoS triangles:', geoS.attributes.position.count / 3);

console.log('SUCCESS! Both geometries generated without errors.');

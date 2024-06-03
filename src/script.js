import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("textures/matcaps/8.png");
matcapTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Fonts
 */
const fontLoader = new FontLoader();

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const zoomInAnimation = () => {
    if (camera.position.z > 5) {
      camera.position.z -= 0.4;
    }
    camera.position.z > 5 && window.requestAnimationFrame(zoomInAnimation);
  };
  if (camera.position.z > 5) {
    zoomInAnimation();
  }

  // Text
  const textGeometry = new TextGeometry(
    "The symphonic sounds of nature \n awaken every cell in my body and, \n in that moment, without a doubt, \n I am truly alive.",
    {
      font,
      size: 0.5,
      height: 0.2,
      curveSegments: 8,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.03,
      bevelOffset: 0,
      bevelSegments: 5,
    }
  );
  textGeometry.center();

  // Material
  const material = new THREE.MeshNormalMaterial({ matcap: matcapTexture });

  const text = new THREE.Mesh(textGeometry, material);
  scene.add(text);

  // Donuts
  const donutGeometry = new THREE.TorusGeometry(0.2, 0.1, 32, 64);
  const elementGroup = new THREE.Group();

  for (let i = 0; i < 500; i++) {
    const donut = new THREE.Mesh(donutGeometry, material);

    // donut.position.x = (Math.random() - 0.5) * 10;
    // donut.position.y = (Math.random() - 0.5) * 10;
    // donut.position.z = (Math.random() - 0.5) * 10;

    donut.position.set(
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 30
    );

    donut.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

    // donut.rotation.x = Math.random() * Math.PI;
    // donut.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();
    donut.scale.set(scale, scale, scale);

    elementGroup.add(donut);
  }

  //   Squares
  const squareGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);

  for (let i = 0; i < 900; i++) {
    const square = new THREE.Mesh(squareGeometry, material);

    // square.position.x = (Math.random() - 0.5) * 10;
    // square.position.y = (Math.random() - 0.5) * 10;
    // square.position.z = (Math.random() - 0.5) * 10;

    // square.rotation.x = Math.random() * Math.PI;
    // square.rotation.y = Math.random() * Math.PI;

    square.position.set(
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 30
    );

    square.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

    const scale = Math.random();
    square.scale.set(scale, scale, scale);

    elementGroup.add(square);
  }

  //   DodecahedronGeometry
  const dodecahedronGeometry = new THREE.DodecahedronGeometry(0.5);

  for (let i = 0; i < 100; i++) {
    const dodecahedron = new THREE.Mesh(dodecahedronGeometry, material);

    dodecahedron.position.set(
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 30
    );

    dodecahedron.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      0
    );

    const scale = Math.random();
    dodecahedron.scale.set(scale, scale, scale);

    elementGroup.add(dodecahedron);
  }

  scene.add(elementGroup);

  const rotationAnimation = () => {
    const time = clock.getElapsedTime();
    text.rotation.x = Math.sin(time) * 0.2;
    text.rotation.y = Math.cos(time) * 0.2;
    text.rotation.z = Math.cos(time) * 0.2;
    elementGroup.rotation.x = Math.cos(time * Math.PI * 0.1);
    elementGroup.rotation.y = Math.sin(time * Math.PI * 0.2);
    elementGroup.rotation.z = Math.cos(time * 0.01) * 3;
    window.requestAnimationFrame(rotationAnimation);
  };
  rotationAnimation();
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 30;
scene.add(camera);

const cursor = { x: 0, y: 0 };

window.addEventListener(
  "mousemove",
  (event) => {
    if (camera.position.z <= 5) {
      cursor.x = event.clientX / sizes.width;
      cursor.y = -(event.clientY / sizes.height);
    } else {
      event.stopPropagation();
      event.preventDefault();
    }
  },
  false
);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableRotate = false;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setClearColor("#212121");
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //    Update Rotation
  camera.position.x = Math.cos(cursor.x * Math.PI) * 5;
  camera.position.y = Math.cos(cursor.y * Math.PI) * 5;
  if (camera <= 5) camera.position.z = Math.cos(cursor.x * Math.PI * 0.1) * 5;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

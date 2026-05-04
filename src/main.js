import gsap from 'gsap';
import GUI from 'lil-gui';
import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/Addons.js';


const canvas = document.querySelector('.webgl');

const scene = new THREE.Scene();

// const gltfLoader = new GLTFLoader();
const gui = new GUI();
const textureLoader = new THREE.TextureLoader();

const planets = new THREE.Group();
// const earthGroup = new THREE.Group();
// const venusGroup = new THREE.Group();
// const marsGroup = new THREE.Group();
// const jupiterGroup = new THREE.Group();


const earthMapTexture = textureLoader.load('../static/earthTexture.webp');
const earthNormalTexture = textureLoader.load('../static/earthNormalMap.webp');
const venusMapTexture = textureLoader.load('../static/venusTexture.webp');
const marsMapTexture = textureLoader.load('../static/marsTexture.webp');
const jupiterMapTexture = textureLoader.load('../static/jupiterTexture.webp');



const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

// const Geometry = new THREE.SphereGeometry(1, 64, 64);

//Earth

// const earthMaterial = new THREE.MeshStandardMaterial({
//   roughness: 1,
//   metalness: 0,
//   map: earthMapTexture,
//   normalMap : earthNormalTexture,
// });

// const earth = new THREE.Mesh(Geometry, earthMaterial);
// earth.position.x = -1.3;
// earth.position.z = 3
// earth.scale.set(1.5, 1.5, 1.5);


const directionalLight1 = new THREE.DirectionalLight(0xffffff, 4);
directionalLight1.position.set(2.62,7.3,-7.46);
planets.add(directionalLight1);
// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight1, 1);
// planets.add(directionalLightHelper);

gui.add(directionalLight1.position, 'x').min(-10).max(10).step(0.01).name('Light X');
gui.add(directionalLight1.position, 'y').min(-10).max(10).step(0.01).name('Light y');
gui.add(directionalLight1.position, 'z').min(-10).max(10).step(0.01).name('Light z');

// planets.add(earth);

//Venus

// const venusMaterial = new THREE.MeshStandardMaterial({
//   roughness:1,
//   metalness:0,
//   map: venusMapTexture,

// })

// const venus = new THREE.Mesh(Geometry, venusMaterial);
// venus.position.x = 7.5;
// venus.position.y = -1.3;
// venus.position.z = -2.5;
// venus.scale.set(1.5, 1.5, 1.5);
// planets.add(venus);

//Mars

// const marsMaterial = new THREE.MeshStandardMaterial({
//   roughness:1,
//   metalness:1,
//   map: marsMapTexture,
// })
// const mars = new THREE.Mesh(Geometry, marsMaterial);
// mars.position.x = -7;
// mars.position.y = -1.3;
// mars.position.z = -2.5;
// mars.scale.set(1.5, 1.5, 1.5);
// planets.add(mars);

//Jupiter

// const jupiterMaterial = new THREE.MeshStandardMaterial({
//   roughness:1,
//   metalness:1,
//   map: jupiterMapTexture,
// })
// const jupiter = new THREE.Mesh(Geometry, jupiterMaterial);
// jupiter.position.x = 0;
// jupiter.position.y = -1.3;
// jupiter.position.z = -10;
// jupiter.scale.set(1.5, 1.5, 1.5);
// planets.add(jupiter);


// planets.position.set(0, 0, 0);

// const earth = gltfLoader.load('./static/earth_8k_texture.glb',(gltf)=>{
//   gltf.scene.scale.set(0.1, 0.1,0.1);
//   scene.add(gltf.scene);
// })
// const s = [earth]


scene.add(planets);

const particlesCount = 1000;
const positions = new Float32Array(particlesCount * 3);
for(let i = 0; i < particlesCount * 3; i++){
  positions[i + 0] = (Math.random() - 0.5) * 10;
  positions[i + 1] = Math.random()
  positions[i + 2] = (Math.random() - 0.5) * 10;
}
const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.05,
  sizeAttenuation: true,
  depthWrite: false,
  transparent: false,
  color: new THREE.Color(0xffffff),
});

const particles = new THREE.Points(particlesGeometry,particlesMaterial)
scene.add(particles);
const radius =1.3;
const segments = 64;
const orbitRadius = 4.5

const spheresMesh = [];
const textures = [
  earthMapTexture,
  venusMapTexture,
  marsMapTexture,
  jupiterMapTexture
]
const geometry = new THREE.SphereGeometry(radius, segments, segments); // Radius: 1, Width/Height Segments: 32
const sphereMesh = [];
for (let i = 0; i < 4; i++) {
  const texture = textures[i];
	texture.colorSpace = THREE.SRGBColorSpace; //to enhance the colors

	const material = new THREE.MeshStandardMaterial({ map: texture });
  if(texture === earthMapTexture){
    material.normalMap = earthNormalTexture;
  }
	const sphere = new THREE.Mesh(geometry, material);

	sphereMesh.push(sphere);

	const angle = (i / 4) * (Math.PI * 2);
	sphere.position.x = orbitRadius * Math.cos(angle);
	sphere.position.z = orbitRadius * Math.sin(angle);

	planets.add(sphere);
	planets.rotation.x = 0.1;
	planets.position.y = -0.9;
  
}
scene.add(planets);

const sizes ={
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize',()=>{
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 9;
scene.add(camera);


// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
})

renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();
let lastWheelTime = 0;
const throttleDelay = 2000;
let scrollCount = 0;

function throttleWheelHandler(event) {
	const currentTime = Date.now();

	if (currentTime - lastWheelTime >= throttleDelay) {
		lastWheelTime = currentTime;

		const direction = event.deltaY > 0 ? "down" : "up";
		scrollCount = (scrollCount + 1) % 4;

		// const headings = document.querySelectorAll(".heading");

		// gsap.to(headings, {
		// 	duration: 1,
		// 	y: `-=${100}%`,
		// 	ease: "power2.inOut",
		// });

		// Rotate sphere group by -90 degrees (Math.PI / 2 radians)
		gsap.to(planets.rotation, {
			duration: 1,
			y: `-=${Math.PI / 2}`,
			ease: "power2.inOut",
		});

		// if (scrollCount === 0) {
		// 	gsap.to(headings, {
		// 		duration: 1,
		// 		y: `0`,
		// 		ease: "power2.inOut",
		// 	});
		// }
	}
}

window.addEventListener("wheel", throttleWheelHandler);


function tick(){
  const elapsedTime = clock.getElapsedTime();
   for(const planet of sphereMesh){
    planet.rotation.y = elapsedTime * 0.2;
   }
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}
tick();
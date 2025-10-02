// Escena y cámara
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0f14);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 1, 3);

// Renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;

// Insertar canvas dentro del contenedor viewer
const viewer = document.getElementById("viewer");
viewer.appendChild(renderer.domElement);

// Luces
const dir = new THREE.DirectionalLight(0xffffff, 1.2);
dir.position.set(2, 4, 5);
scene.add(dir);

const amb = new THREE.AmbientLight(0xaaaaaa, 0.9);
scene.add(amb);

// Floor sutil (para que el modelo no "flote" sin referencia)
const grid = new THREE.GridHelper(6, 12, 0x222831, 0x101214);
grid.material.opacity = 0.06;
grid.material.transparent = true;
grid.position.y = -0.9;
scene.add(grid);

// Cargar modelo EXAMPLE.glb
let modelo = null;
const loader = new THREE.GLTFLoader();

// Mostrar loader
const loaderEl = document.getElementById("loader");
function hideLoader() {
  if (loaderEl) loaderEl.classList.add("hidden");
}

loader.load(
  "EXAMPLE.glb",
  function (gltf) {
    modelo = gltf.scene;
    // centrar y escalar automático (heurística simple)
    modelo.traverse((c) => {
      if (c.isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;
      }
    });

    // Ajusta escala si hace falta
    modelo.scale.set(1, 1, 1);

    // Opcional: centrar el modelo en 0,0,0 según su bounding box
    const box = new THREE.Box3().setFromObject(modelo);
    const center = new THREE.Vector3();
    box.getCenter(center);
    modelo.position.sub(center); // centra en 0,0,0

    scene.add(modelo);

    // ocultar loader con pequeña demora para que se vea suave
    setTimeout(hideLoader, 250);
  },
  undefined,
  function (err) {
    console.error("Error cargando EXAMPLE.glb", err);
    if (loaderEl) {
      loaderEl.querySelector(".loader-text").textContent = "Error cargando modelo";
    }
  }
);

// Animación: rotación automática con pequeña oscilación X/Y
function animate() {
  requestAnimationFrame(animate);

  if (modelo) {
    modelo.rotation.y += 0.008; // rotación Y principal
    modelo.rotation.x = Math.sin(Date.now() * 0.0006) * 0.03; // leve oscilación X
  }

  renderer.render(scene, camera);
}
animate();

// Responsividad: adaptar tamaño del canvas al contenedor viewer
function resize() {
  const rect = viewer.getBoundingClientRect();
  const w = Math.max(300, rect.width);
  const h = Math.max(200, rect.height);
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", resize);
resize();

// Escena y cámara
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(
  60, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  100
);
camera.position.set(0, 1, 3);

// Renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Luz
const light = new THREE.DirectionalLight(0xffffff, 1.2);
light.position.set(2, 4, 5);
scene.add(light);

const ambient = new THREE.AmbientLight(0x404040, 1.5);
scene.add(ambient);

// Cargar modelo (ahora EXAMPLE.glb)
let modelo;
const loader = new THREE.GLTFLoader();
loader.load("EXAMPLE.glb", function(gltf) {
  modelo = gltf.scene;
  modelo.scale.set(1, 1, 1); // ajusta la escala si se ve muy grande/pequeño
  scene.add(modelo);
}, undefined, function(error) {
  console.error("Error cargando modelo:", error);
});

// Animación
function animate() {
  requestAnimationFrame(animate);

  if (modelo) {
    modelo.rotation.y += 0.01; // rotación automática en eje Y
  }

  renderer.render(scene, camera);
}
animate();

// Ajustar al tamaño de la ventana
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


(() => {
const host = document.getElementById('three-bg');
if (!host) return;

import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js').then(THREE => {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x090909, 15, 90);

  const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 200);
  camera.position.set(0, 12, 28);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  host.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambient);

  const redLight = new THREE.PointLight(0xff2233, 25, 150);
  redLight.position.set(0, 25, 15);
  scene.add(redLight);

  const shape = new THREE.Shape();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i;
    const x = Math.cos(a);
    const y = Math.sin(a);
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 2.2,
    bevelEnabled: false
  });

  const darkMat = new THREE.MeshStandardMaterial({
    color: 0x2c3138,
    metalness: 0.9,
    roughness: 0.35
  });

  const redMat = new THREE.MeshStandardMaterial({
    color: 0x9f0015,
    metalness: 1,
    roughness: 0.25
  });

  const group = new THREE.Group();
  scene.add(group);

  const cells = [];
  for (let r = -18; r < 18; r++) {
    for (let c = -18; c < 18; c++) {
      const m = new THREE.Mesh(
        geo,
        Math.random() > 0.96 ? redMat : darkMat
      );

      m.rotation.x = -Math.PI / 2;
      m.position.set(
        c * 1.75 + (r % 2 ? 0.87 : 0),
        0,
        r * 1.5
      );

      m.userData.phase = Math.random() * Math.PI * 2;
      group.add(m);
      cells.push(m);
    }
  }

  let mouseX = 0;
  let mouseY = 0;
  let scrollOffset = 0;

  addEventListener("mousemove", e => {
    mouseX = (e.clientX / innerWidth - 0.5);
    mouseY = (e.clientY / innerHeight - 0.5);
  });

  addEventListener("scroll", () => {
    scrollOffset = window.scrollY * 0.001;
  }, { passive: true });

  addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  function animate(t) {
    requestAnimationFrame(animate);

    group.rotation.y += (mouseX * 0.25 - group.rotation.y) * 0.02;
    group.rotation.x += ((-mouseY * 0.1) - group.rotation.x) * 0.02;

    camera.position.x += ((mouseX * 4) - camera.position.x) * 0.02;

    cells.forEach(h => {
      h.position.y =
        0.35 +
        Math.sin(t * 0.001 + h.userData.phase + scrollOffset * 4) * 0.45;
    });

    renderer.render(scene, camera);
  }

  animate(0);
}).catch(err => console.error("Three.js load failed", err));
})();

(() => {
  const root = document.getElementById('three-bg');
  if (!root) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;

  // Keep the page fully usable if WebGL or the CDN is unavailable.
  const fallback = () => root.classList.add('three-disabled');
  if (reduced) return fallback();

  const init = async () => {
    try {
      const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.min.js');
      if (!('WebGL2RenderingContext' in window)) return fallback();

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x0a0d10, 0.032);
      const camera = new THREE.PerspectiveCamera(47, innerWidth / innerHeight, 0.1, 80);
      camera.position.set(0, 2.7, 12.5);

      const renderer = new THREE.WebGLRenderer({ antialias: !coarse, alpha: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, coarse ? 1 : 1.25));
      renderer.setSize(innerWidth, innerHeight, false);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setClearAlpha(0);
      renderer.domElement.className = 'three-canvas';
      root.appendChild(renderer.domElement);

      const ambient = new THREE.AmbientLight(0x77818a, 1.15);
      scene.add(ambient);
      const key = new THREE.DirectionalLight(0xe8edf1, 2.3);
      key.position.set(-7, 8, 12);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0x8c97a0, 1.25);
      rim.position.set(8, 2, 5);
      scene.add(rim);
      const red = new THREE.PointLight(0xe20613, 14, 28, 2);
      red.position.set(5, 1, 8);
      scene.add(red);

      // A single instanced mesh keeps the 3D honeycomb cheap.
      const rows = coarse ? 7 : 9;
      const cols = coarse ? 10 : 13;
      const count = rows * cols;
      const geometry = new THREE.CylinderGeometry(0.82, 0.82, 0.46, 6, 1, false);
      geometry.rotateX(Math.PI / 2);
      geometry.translate(0, 0, 0);
      const material = new THREE.MeshStandardMaterial({ color: 0x424b52, metalness: 0.72, roughness: 0.74, flatShading: true });
      const mesh = new THREE.InstancedMesh(geometry, material, count);
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      scene.add(mesh);

      const redMaterial = new THREE.MeshStandardMaterial({ color: 0x7d161e, metalness: 0.72, roughness: 0.78, flatShading: true });
      const redMesh = new THREE.InstancedMesh(geometry, redMaterial, Math.max(3, Math.round(count * 0.06)));
      redMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      scene.add(redMesh);

      const tmp = new THREE.Object3D();
      const tmpRed = new THREE.Object3D();
      const items = [];
      const spreadX = 18;
      const spreadY = 10;
      let k = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = ((c / (cols - 1)) - 0.5) * spreadX + (r % 2 ? 0.78 : 0);
          const y = ((r / (rows - 1)) - 0.5) * spreadY;
          const z = -1.2 + Math.sin(c * 1.7 + r * .9) * .35;
          items.push({x,y,z,phase:(r*cols+c)*.53,speed:.25+(c%4)*.03,depth:.78+(r%3)*.08});
          tmp.position.set(x,y,z);
          tmp.scale.set(1,1,items[k].depth);
          tmp.rotation.z = ((c+r)%2 ? 1 : -1) * .008;
          tmp.updateMatrix();
          mesh.setMatrixAt(k,tmp.matrix);
          k++;
        }
      }
      const redItems=[];
      for(let i=0;i<redMesh.count;i++){
        const idx=(i*23+7)%items.length, p=items[idx];
        redItems.push(p);
        tmpRed.position.set(p.x,p.y,p.z+.3);
        tmpRed.scale.set(1,1,p.depth+.06);
        tmpRed.updateMatrix();
        redMesh.setMatrixAt(i,tmpRed.matrix);
      }
      mesh.instanceMatrix.needsUpdate=true; redMesh.instanceMatrix.needsUpdate=true;

      const dummy = new THREE.Object3D();
      let targetX = 0, targetY = 0, scrollTarget = 0;
      let currentX = 0, currentY = 0, currentScroll = 0;
      let last = performance.now();
      let animationFrame = 0;
      const clock = new THREE.Clock();

      const onPointer = e => {
        if (coarse) return;
        targetX = (e.clientX / innerWidth - .5) * 1.2;
        targetY = (e.clientY / innerHeight - .5) * 0.9;
      };
      const onScroll = () => { scrollTarget = Math.min(10000, window.scrollY) * 0.0012; };
      const onResize = () => {
        camera.aspect=innerWidth/innerHeight;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(Math.min(devicePixelRatio || 1, coarse ? 1 : 1.25));
        renderer.setSize(innerWidth,innerHeight,false);
      };
      addEventListener('pointermove',onPointer,{passive:true});
      addEventListener('scroll',onScroll,{passive:true});
      addEventListener('resize',onResize,{passive:true});

      const animate = now => {
        animationFrame = requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();
        const dt = Math.min(.033,(now-last)/1000); last=now;
        currentX += (targetX-currentX) * Math.min(1,dt*2.6);
        currentY += (targetY-currentY) * Math.min(1,dt*2.4);
        currentScroll += (scrollTarget-currentScroll) * Math.min(1,dt*1.7);

        camera.position.x = currentX * .72;
        camera.position.y = 2.7 - currentScroll * .82 + currentY * .32;
        camera.position.z = 12.5 + currentScroll * .22;
        camera.lookAt(currentX * .15, -currentScroll * .22, 0);

        for(let i=0;i<items.length;i++){
          const p=items[i];
          const breathe=Math.sin(elapsed*p.speed+p.phase)*0.08 + Math.sin(elapsed*.18+p.phase*.31)*0.035;
          dummy.position.set(p.x, p.y, p.z+breathe);
          const s=p.depth + breathe*.45;
          dummy.scale.set(1,1,s);
          dummy.rotation.z = Math.sin(elapsed*.12+p.phase)*.012;
          dummy.updateMatrix();
          mesh.setMatrixAt(i,dummy.matrix);
        }
        mesh.instanceMatrix.needsUpdate=true;
        for(let i=0;i<redItems.length;i++){
          const p=redItems[i];
          const breathe=Math.sin(elapsed*(p.speed+.04)+p.phase)*0.09;
          dummy.position.set(p.x,p.y,p.z+.32+breathe);
          dummy.scale.set(1,1,p.depth+.08);
          dummy.rotation.z=0;
          dummy.updateMatrix();
          redMesh.setMatrixAt(i,dummy.matrix);
        }
        redMesh.instanceMatrix.needsUpdate=true;
        red.position.x=5+Math.sin(elapsed*.25)*1.4;
        red.position.y=1+Math.cos(elapsed*.2)*.8;
        renderer.render(scene,camera);
      };
      animate(performance.now());

      document.addEventListener('visibilitychange',()=>{
        if(document.hidden){ cancelAnimationFrame(animationFrame); animationFrame=0; }
        else if(!animationFrame) { last=performance.now(); animate(performance.now()); }
      });
    } catch (err) {
      fallback();
    }
  };
  void init();
})();

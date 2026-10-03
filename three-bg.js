(() => {
  'use strict';

  const host = document.getElementById('three-bg');
  if (!host) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  if (reduce || !('WebGLRenderingContext' in window)) return;

  let started = false;
  let frame = 0;
  let cleanup = null;

  const start = async () => {
    if (started) return;
    started = true;
    try {
      const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.min.js');

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, innerWidth/innerHeight, 0.1, 80);
      camera.position.set(0, 0.2, 16);

      const renderer = new THREE.WebGLRenderer({alpha:true,antialias:!coarse,powerPreference:'high-performance'});
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, coarse ? 1 : 1.25));
      renderer.setSize(innerWidth,innerHeight,false);
      renderer.setClearAlpha(0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.domElement.className='three-canvas';
      host.appendChild(renderer.domElement);

      const group = new THREE.Group();
      scene.add(group);

      // Very restrained foreground geometry: the reference image remains the visual foundation.
      const base = new THREE.CylinderGeometry(0.95,0.95,0.14,6,1,false);
      const mat = new THREE.MeshStandardMaterial({color:0xa9b1b5,metalness:0.85,roughness:0.76,transparent:true,opacity:0.14,flatShading:true});
      const redMat = new THREE.MeshStandardMaterial({color:0xe30613,metalness:0.78,roughness:0.8,transparent:true,opacity:0.17,flatShading:true});

      const blocks=[];
      const rows = coarse ? 2 : 3;
      const cols = coarse ? 4 : 6;
      for(let r=0;r<rows;r++){
        for(let c=0;c<cols;c++){
          const g = new THREE.Mesh(base, (r+c)%7===0 ? redMat : mat);
          g.position.set((c-(cols-1)/2)*2.15 + (r%2 ? 1.07 : 0), (r-(rows-1)/2)*1.86, -1.5 - (r%2)*1.2);
          g.rotation.z=Math.PI/6;
          g.userData={phase:(r*cols+c)*.8,baseY:g.position.y};
          group.add(g); blocks.push(g);
        }
      }
      group.rotation.set(-0.08,0.08,0);

      const ambient = new THREE.AmbientLight(0xffffff,0.8);
      scene.add(ambient);
      const key = new THREE.DirectionalLight(0xffffff,0.9);
      key.position.set(-4,5,6); scene.add(key);
      const red = new THREE.PointLight(0xe30613,1.7,18);
      red.position.set(4,1,5); scene.add(red);

      let px=0,py=0,ps=0,cx=0,cy=0,cs=0;
      let last=performance.now();
      const onPointer = e => {
        if(coarse) return;
        px=(e.clientX/innerWidth-0.5)*0.5;
        py=(e.clientY/innerHeight-0.5)*0.25;
      };
      const onScroll = () => { ps=Math.max(-1,Math.min(1,window.scrollY/2200)); };
      const onResize=()=>{
        camera.aspect=innerWidth/innerHeight;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(Math.min(devicePixelRatio || 1, coarse ? 1 : 1.25));
        renderer.setSize(innerWidth,innerHeight,false);
      };
      addEventListener('pointermove',onPointer,{passive:true});
      addEventListener('scroll',onScroll,{passive:true});
      addEventListener('resize',onResize,{passive:true});
      onScroll(); onResize();

      const animate = now => {
        frame=requestAnimationFrame(animate);
        const dt=Math.min(.033,(now-last)/1000); last=now;
        cx+=(px-cx)*Math.min(1,dt*2.4);
        cy+=(py-cy)*Math.min(1,dt*2.4);
        cs+=(ps-cs)*Math.min(1,dt*1.6);
        group.rotation.y=0.08+cx*0.18;
        group.rotation.x=-0.08+cy*0.1+cs*0.05;
        group.position.x=cx*0.6;
        group.position.y=-cs*1.1+cy*0.3;
        blocks.forEach(b=>{
          b.position.y=b.userData.baseY + Math.sin(now*.00035+b.userData.phase)*0.025;
        });
        red.position.x=4+Math.sin(now*.00025)*1.1;
        renderer.render(scene,camera);
      };
      frame=requestAnimationFrame(animate);

      const stop = () => {
        if(frame) cancelAnimationFrame(frame);
        removeEventListener('pointermove',onPointer);
        removeEventListener('scroll',onScroll);
        removeEventListener('resize',onResize);
        renderer.dispose();
        renderer.domElement.remove();
      };
      cleanup=stop;
    } catch (err) {
      // Critical page background is CSS; a CDN or WebGL failure must never break the site.
      host.innerHTML='';
    }
  };

  if ('requestIdleCallback' in window) requestIdleCallback(start, {timeout:1800});
  else setTimeout(start, 500);

  document.addEventListener('visibilitychange',()=> {
    if(document.hidden && frame){ cancelAnimationFrame(frame); frame=0; }
  });
})();

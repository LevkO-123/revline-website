
(() => {
const host=document.getElementById('three-bg'); if(!host) return;
import('https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.min.js').then(THREE=>{
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(45,innerWidth/innerHeight,.1,200);
camera.position.set(0,8,24);
const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});
renderer.setSize(innerWidth,innerHeight); host.appendChild(renderer.domElement);
const group=new THREE.Group(); scene.add(group);
const shape=new THREE.Shape();
for(let i=0;i<6;i++){ const a=Math.PI/3*i; const x=Math.cos(a),y=Math.sin(a); i?shape.lineTo(x,y):shape.moveTo(x,y);}
shape.closePath();
const geo=new THREE.ExtrudeGeometry(shape,{depth:1.6,bevelEnabled:false});
const dark=new THREE.MeshStandardMaterial({color:0x30343a,metalness:.9,roughness:.4});
const red=new THREE.MeshStandardMaterial({color:0xb30014,metalness:.9,roughness:.35});
const cells=[];
for(let r=-12;r<12;r++) for(let c=-12;c<12;c++){
  const m=new THREE.Mesh(geo,Math.random()>.92?red:dark);
  m.rotation.x=-Math.PI/2;
  m.position.set(c*1.8+(r%2?0.9:0),0,r*1.55);
  m.userData.p=Math.random()*6.28;
  group.add(m); cells.push(m);
}
scene.add(new THREE.AmbientLight(0xffffff,.8));
const l=new THREE.PointLight(0xff2233,8,80); l.position.set(0,20,10); scene.add(l);
let scroll=0; addEventListener('scroll',()=>scroll=window.scrollY*.001,{passive:true});
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
function a(t){
  requestAnimationFrame(a);
  cells.forEach(h=>h.position.y=.4+Math.sin(t*.001+h.userData.p+scroll)*.35);
  group.rotation.z=scroll*.15;
  renderer.render(scene,camera);
} a(0);
});
})();

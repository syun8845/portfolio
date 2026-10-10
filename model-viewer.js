import * as THREE from 'three';
import {GLTFLoader} from './vendor/examples/jsm/loaders/GLTFLoader.js';
import {DRACOLoader} from './vendor/examples/jsm/loaders/DRACOLoader.js';
const decoder=new DRACOLoader().setDecoderPath('./vendor/examples/jsm/libs/draco/gltf/').setDecoderConfig({type:'wasm'});
const loader=new GLTFLoader().setDRACOLoader(decoder);
import {OrbitControls} from './vendor/examples/jsm/controls/OrbitControls.js';

const holder=document.querySelector('#viewer'),poster=document.querySelector('#model-poster'),loading=document.querySelector('#model-loading'),error=document.querySelector('#model-error'),rotate=document.querySelector('#rotate');
const models={"vending": {"title": "自販機", "view": [0.3328201174736023, 0.4437601566314697, 0.8320503234863281], "notes": "シンプルな配色に手描きの線を加え、イラストのような雰囲気を表現しました。"}, "stage": {"title": "ステージ", "view": [0.12, 0.08, 1], "notes": "2人のアイドルのイメージカラーと記号を、ステージの左右に分けて配置しました。色と記号の両方から、それぞれのアイドルの特徴を分かりやすく伝えることを意識しました。"}, "dragon": {"title": "ドラゴン", "view": [0.6104276180267334, 0.41386696696281433, 0.6753460168838501], "notes": "何を表したモデルかが伝わる形を保ちながら、ポリゴン数を抑えてデータ容量を小さくしました。ゲーム内の小物として配置しやすい、軽量なモデルを目指しました。"}, "elephant": {"title": "象", "view": [0.6112127900123596, 0.21109558641910553, -0.7627959251403809], "notes": "何を表したモデルかが伝わる形を保ちながら、ポリゴン数を抑えてデータ容量を小さくしました。ゲーム内の小物として配置しやすい、軽量なモデルを目指しました。"}, "seal": {"title": "あざらし", "view": [0.7387052774429321, 0.20023679733276367, -0.6435990333557129], "notes": "何を表したモデルかが伝わる形を保ちながら、ポリゴン数を抑えてデータ容量を小さくしました。ゲーム内の小物として配置しやすい、軽量なモデルを目指しました。"}, "rabbit": {"title": "うさぎ", "view": [0.8409273624420166, 0.3547120988368988, -0.40868136286735535], "notes": "何を表したモデルかが伝わる形を保ちながら、ポリゴン数を抑えてデータ容量を小さくしました。ゲーム内の小物として配置しやすい、軽量なモデルを目指しました。"}};
let renderer,scene,camera,controls,current,key='vending',generation=0,ready=false,visible=false,started=false,raf;
function init(){
 if(renderer)return;
 renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.setClearColor(0xe2e9e3,0);renderer.domElement.tabIndex=0;renderer.domElement.setAttribute('role','img');renderer.domElement.setAttribute('aria-label','ドラッグまたは矢印キーで回転できる3Dモデル');holder.prepend(renderer.domElement);
 scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(38,1,.01,100);controls=new OrbitControls(camera,renderer.domElement);controls.enablePan=false;controls.enableDamping=true;controls.autoRotateSpeed=1.3;controls.minDistance=0.9;controls.maxDistance=10;
 scene.add(new THREE.HemisphereLight(0xffffff,0x7d9183,2));const main=new THREE.DirectionalLight(0xffffff,2.5);main.position.set(3,5,4);scene.add(main);const fill=new THREE.DirectionalLight(0xd7e8ff,1.3);fill.position.set(-4,2,-3);scene.add(fill);
 new ResizeObserver(()=>{const w=holder.clientWidth,h=holder.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();if(ready)draw()}).observe(holder);
 renderer.domElement.addEventListener('keydown',e=>{const horizontal=e.key==='ArrowLeft'?-1:e.key==='ArrowRight'?1:0,vertical=e.key==='ArrowUp'?-1:e.key==='ArrowDown'?1:0;if(!horizontal&&!vertical)return;e.preventDefault();const spherical=new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));spherical.theta+=horizontal*.13;spherical.phi=Math.max(.1,Math.min(Math.PI-.1,spherical.phi+vertical*.13));camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(spherical));controls.update();draw()});
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();error.hidden=false;poster.hidden=false;loading.hidden=true;ready=false});
}
function dispose(object){object?.traverse(o=>{o.geometry?.dispose();for(const m of [].concat(o.material||[])){for(const v of Object.values(m))if(v?.isTexture)v.dispose();m.dispose()}})}
function reset(){if(!controls)return;controls.autoRotate=false;rotate.setAttribute('aria-pressed','false');rotate.textContent='自動回転';controls.target.set(0,0,0);camera.position.fromArray(models[key].view).normalize().multiplyScalar(camera.aspect<.85?4.8:3.8);controls.update();draw()}
async function loadModel(next){
 key=next;const token=++generation;ready=false;error.hidden=true;loading.hidden=false;poster.hidden=false;poster.src=`assets/${key}.webp`;poster.alt=models[key].title+'のモデル';holder.setAttribute('aria-label',models[key].title+'の3Dモデル');loading.textContent='3Dモデルを読み込んでいます…';
 document.querySelector('#model-title').textContent=models[key].title;document.querySelector('#model-notes-text').textContent=models[key].notes;document.querySelector('#model-number').textContent=String(Object.keys(models).indexOf(key)+1).padStart(2,'0')+' / 06';document.querySelectorAll('[data-model]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.model===key)));
 try{init();if(current){scene.remove(current);dispose(current);current=null}const model=(await loader.loadAsync(`assets/${key}.glb`)).scene;if(token!==generation){dispose(model);return}model.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(model),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3()),scale=2/Math.max(size.x,size.y,size.z);const group=new THREE.Group();group.add(model);model.position.sub(center);group.scale.setScalar(scale);scene.add(group);current=group;ready=true;reset();poster.hidden=true;loading.hidden=true;draw();animate();}catch(e){if(token!==generation)return;console.error('3D loading failed',e);error.hidden=false;loading.hidden=true}
}
function draw(){if(renderer&&scene&&camera)renderer.render(scene,camera)}
function animate(){cancelAnimationFrame(raf);if(!visible||document.hidden||!ready)return;controls.update();draw();raf=requestAnimationFrame(animate)}
const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible&&!started){started=true;loadModel(key)}else animate()},{rootMargin:'150px'});observer.observe(holder);
document.addEventListener('visibilitychange',animate);
document.querySelectorAll('[data-model]').forEach(b=>b.addEventListener('click',()=>{started=true;loadModel(b.dataset.model)}));
rotate.addEventListener('click',()=>{if(!ready)return;controls.autoRotate=!controls.autoRotate;rotate.setAttribute('aria-pressed',String(controls.autoRotate));rotate.textContent=controls.autoRotate?'回転を止める':'自動回転';animate()});
document.querySelector('#reset').addEventListener('click',reset);
function zoom(f){if(!ready)return;const d=camera.position.clone().sub(controls.target);d.multiplyScalar(f).clampLength(controls.minDistance,controls.maxDistance);camera.position.copy(controls.target).add(d);controls.update();draw()}
document.querySelector('#zoom-in').addEventListener('click',()=>zoom(.8));document.querySelector('#zoom-out').addEventListener('click',()=>zoom(1.25));document.querySelector('#retry-model').addEventListener('click',()=>loadModel(key));

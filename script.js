
(function(){
'use strict';
const makes={
Acura:['ILX','Integra','MDX','RDX','TLX'],Audi:['A3','A4','A5','A6','A7','A8','Q3','Q5','Q7','Q8','e-tron','RS3','RS5','RS6','RS7'],BMW:['2 Series','3 Series','4 Series','5 Series','7 Series','8 Series','X1','X2','X3','X4','X5','X6','X7','M2','M3','M4','M5','M8','i4','i5','i7','iX'],Buick:['Enclave','Encore','Envision'],Cadillac:['CT4','CT5','Escalade','Lyriq','XT4','XT5','XT6'],Chevrolet:['Blazer','Camaro','Colorado','Corvette','Equinox','Silverado','Suburban','Tahoe','Trailblazer','Traverse'],Chrysler:['200','300','Pacifica'],Dodge:['Challenger','Charger','Durango','Hornet'],Ford:['Bronco','Bronco Sport','Edge','Escape','Expedition','Explorer','F-150','F-250 Super Duty','F-350 Super Duty','F-450 Super Duty','Maverick','Mustang','Ranger','Transit'],GMC:['Acadia','Canyon','Sierra 1500','Sierra HD','Terrain','Yukon'],Genesis:['G70','G80','G90','GV70','GV80'],Honda:['Accord','Civic','CR-V','HR-V','Odyssey','Pilot','Passport','Ridgeline'],Hyundai:['Elantra','Ioniq','Kona','Palisade','Santa Cruz','Santa Fe','Sonata','Tucson','Venue'],Infiniti:['Q50','Q60','QX50','QX55','QX60','QX80'],Jaguar:['F-Pace','F-Type','I-Pace','XE','XF'],Jeep:['Cherokee','Compass','Gladiator','Grand Cherokee','Wagoneer','Wrangler'],Kia:['Carnival','Forte','K5','Niro','Seltos','Sorento','Soul','Sportage','Telluride'],Lexus:['ES','GX','IS','LC','LS','LX','NX','RC','RX','TX','UX'],Lincoln:['Aviator','Corsair','Nautilus','Navigator'],Mazda:['CX-30','CX-5','CX-50','CX-90','Mazda3','Mazda6','MX-5 Miata'],'Mercedes-Benz':['A-Class','C-Class','E-Class','S-Class','CLA','CLS','GLA','GLB','GLC','GLE','GLS','G-Class','EQS','EQE','AMG GT'],Mitsubishi:['Eclipse Cross','Outlander','Outlander Sport','Mirage'],Nissan:['Altima','Armada','Frontier','Kicks','Maxima','Murano','Pathfinder','Rogue','Sentra','Titan','Z'],Porsche:['718 Boxster','718 Cayman','911','Cayenne','Macan','Panamera','Taycan'],Ram:['1500','2500','3500','ProMaster'],Rivian:['R1T','R1S'],Subaru:['Ascent','BRZ','Crosstrek','Forester','Impreza','Legacy','Outback','WRX'],Tesla:['Model 3','Model S','Model X','Model Y','Cybertruck'],Toyota:['4Runner','Camry','Corolla','Crown','GR86','Grand Highlander','Highlander','Land Cruiser','Prius','RAV4','Sequoia','Sienna','Tacoma','Tundra'],Volkswagen:['Atlas','Golf','GTI','Jetta','ID.4','Taos','Tiguan','Touareg'],Volvo:['C40','S60','S90','V60','V90','XC40','XC60','XC90'],Polaris:['Ranger','RZR','Sportsman','General','Scrambler'],'Can-Am':['Defender','Maverick','Outlander','Renegade']
};
const cities=['Alpine','American Fork','Bluffdale','Bountiful','Cedar Fort','Cedar Hills','Draper','Eagle Mountain','Elk Ridge','Ephraim','Eureka','Farmington','Farr West','Genola','Goshen','Herriman','Heber City','Highland','Kaysville','Layton','Lehi','Lindon','Mapleton','Manti','Mona','Morgan','Mount Pleasant','Nephi','North Ogden','Ogden','Orem','Payson','Pleasant Grove','Provo','Roy','Salem','Salt Lake City','Sandy','Santaquin','Saratoga Springs','South Jordan','Springville','St. George','Taylorsville','Tooele','Vernal','Vineyard','West Jordan','West Valley City','Woods Cross','Spanish Fork','Syracuse','Clearfield','Centerville','Cottonwood Heights','Kearns','Midvale','Murray','Riverton','South Ogden','Sunset','Kaysville','Other / Not Listed'];
const coverage=['Alpine','American Fork','Bluffdale','Cedar Hills','Draper','Eagle Mountain','Heber City','Highland','Layton','Lehi','Lindon','Mapleton','Ogden','Orem','Payson','Pleasant Grove','Provo','Riverton','Sandy','Salt Lake City','Santaquin','Saratoga Springs','South Jordan','Spanish Fork','Springville','Vineyard','West Jordan','Weber County','Davis County','Utah County','Salt Lake County'];
const $=id=>document.getElementById(id);
coverage.forEach(c=>{const s=document.createElement('span');s.className='chip';s.textContent=c;$('coverageChips').appendChild(s)});
const city=$('city'),make=$('make'),model=$('model'),year=$('year'),cityManual=$('cityManual'),modelManual=$('modelManual');
cities.forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=c;city.appendChild(o)});
Object.keys(makes).sort().forEach(m=>{const o=document.createElement('option');o.value=m;o.textContent=m;make.appendChild(o)});
for(let y=new Date().getFullYear()+1;y>=1990;y--){const o=document.createElement('option');o.value=y;o.textContent=y;year.appendChild(o)}
function resetModels(){model.innerHTML='<option value="">Select make first</option>';model.disabled=!make.value;modelManual.style.display='none';if(make.value){(makes[make.value]||[]).forEach(m=>{const o=document.createElement('option');o.value=m;o.textContent=m;model.appendChild(o)});const x=document.createElement('option');x.value='Other / Not Listed';x.textContent='Other / Not Listed';model.appendChild(x)}}
make.addEventListener('change',resetModels);model.addEventListener('change',()=>{modelManual.style.display=model.value==='Other / Not Listed'?'block':'none'});city.addEventListener('change',()=>{cityManual.style.display=city.value==='Other / Not Listed'?'block':'none'});resetModels();
const menuBtn=$('menuBtn'), mobilePanel=$('mobilePanel');menuBtn.addEventListener('click',()=>{const open=mobilePanel.classList.toggle('open');menuBtn.setAttribute('aria-expanded',open?'true':'false')});mobilePanel.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobilePanel.classList.remove('open');menuBtn.setAttribute('aria-expanded','false')}));
const lb=$('lightbox'),lbi=$('lightboxImage');document.querySelectorAll('.gallery-card img').forEach(img=>img.addEventListener('click',()=>{lbi.src=img.src;lbi.alt=img.alt;lb.classList.add('open');document.body.classList.add('lock')}));$('lightboxClose').addEventListener('click',()=>{lb.classList.remove('open');document.body.classList.remove('lock')});lb.addEventListener('click',e=>{if(e.target===lb){lb.classList.remove('open');document.body.classList.remove('lock')}});document.addEventListener('keydown',e=>{if(e.key==='Escape'){lb.classList.remove('open');document.body.classList.remove('lock')}});

const form=$('serviceForm');
const formStatus=$('formStatus');
form?.addEventListener('submit',()=>{
  const submit=form.querySelector('button[type="submit"]');
  if(submit){submit.disabled=true;submit.textContent='Sending request…';}
  if(formStatus) formStatus.textContent='Submitting securely to REVLINE…';
});

const revealEls=document.querySelectorAll('.reveal');
if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('in');observer.unobserve(entry.target);}
    });
  },{threshold:.12});
  revealEls.forEach(el=>observer.observe(el));
}else{
  revealEls.forEach(el=>el.classList.add('in'));
}

document.querySelectorAll('img:not(#lightboxImage)').forEach(img=>{
  img.addEventListener('error',()=>{
    if(img.dataset.fallbackUsed) return;
    img.dataset.fallbackUsed='true';
    img.src='/revline-r.webp';
  },{once:true});
});
})();
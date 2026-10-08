
(function(){
'use strict';

function applyContactIconSystem(){
  const icons={
    phone:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7.2 3.8 10 6.9 8.2 9c1.2 2.5 3.2 4.5 5.7 5.7l2.1-1.8 3.1 2.8c.6.6.6 1.5 0 2.1-.8.8-2 1.3-3.2 1.3-6.3 0-11.4-5.1-11.4-11.4 0-1.2.5-2.4 1.3-3.2.4-.4 1-.7 1.4-.7Z"/></svg>',
    text:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 5.5h16v11H11l-5 3v-3H4z"/><path d="M8 9.5h8M8 13h5"/></svg>',
    request:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8.5"/><path d="M12 8v8M8 12h8"/></svg>'
  };
  document.querySelectorAll('.fab a,.contact-dock a').forEach(link=>{
    const slot=link.querySelector('[aria-hidden="true"]');
    if(!slot||slot.querySelector('svg'))return;
    const href=link.getAttribute('href')||'';
    const kind=href.startsWith('tel:')?'phone':href.startsWith('sms:')?'text':(/request/i.test(href)||link.dataset.conversion==='quote')?'request':'';
    if(kind)slot.innerHTML=icons[kind];
  });
}
applyContactIconSystem();

function trackConversion(eventName,detail={}){const payload={event:eventName,...detail};window.dispatchEvent(new CustomEvent('revline:conversion',{detail:payload}));if(Array.isArray(window.dataLayer))window.dataLayer.push(payload);}
window.revlineTrack=trackConversion;

window.revlineStartCheckout=async function(priceId){
  if(typeof priceId!=="string"||!/^price_[A-Za-z0-9]+$/.test(priceId))throw new Error("A valid REVLINE-approved Stripe Price ID is required.");
  const response=await fetch("/api/create-checkout-session",{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify({priceId})});
  const result=await response.json();
  if(!response.ok||!result.url)throw new Error("Online checkout is not currently available.");
  trackConversion("payment_initiated",{provider:"stripe"});
  window.location.assign(result.url);
};

document.addEventListener('click',event=>{const target=event.target instanceof Element?event.target:null;const link=target?.closest('a[href]');if(!link)return;const href=link.getAttribute('href')||'';if(href.startsWith('tel:'))trackConversion('phone_click',{destination:href});else if(href.startsWith('sms:'))trackConversion('sms_click',{destination:href});else if(href.includes('#request')||link.dataset.conversion==='quote')trackConversion('quote_request_click',{destination:href});});
const contactDock=document.createElement('nav');contactDock.className='contact-dock';contactDock.setAttribute('aria-label','Quick contact actions');contactDock.innerHTML='<a href="tel:+12243458151" data-conversion="phone"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.7 3.5 9.6 3a1.6 1.6 0 0 1 1.8 1.1l1 3a1.6 1.6 0 0 1-.7 1.9l-1.7 1a12 12 0 0 0 5 5l1-1.7a1.6 1.6 0 0 1 1.9-.7l3 1a1.6 1.6 0 0 1 1.1 1.8l-.5 2.9A1.9 1.9 0 0 1 19.6 20C11 19.3 4.7 13 4 4.4a1.9 1.9 0 0 1 1.7-.9Z"/></svg><small>Call</small></a><a href="sms:+12243458151" data-conversion="sms"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v7A2.5 2.5 0 0 1 17.5 15H11l-4.7 4v-4.4A2.5 2.5 0 0 1 4 12.5v-7Z"/></svg><small>Text</small></a><a href="/request/" class="dock-quote" data-conversion="quote"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg><small>Request</small></a>';document.body.appendChild(contactDock);
const fab=document.querySelector('.fab');if(fab){fab.setAttribute('aria-label','Quick contact actions');if(!fab.querySelector('[data-fab-quote]')){const quote=document.createElement('a');quote.href='/request/';quote.setAttribute('aria-label','Get a quote');quote.dataset.fabQuote='true';quote.dataset.conversion='quote';quote.innerHTML='<span aria-hidden="true">↗</span><span class="fab-label">Get quote</span>';fab.appendChild(quote);}fab.querySelectorAll('a').forEach(link=>{if(link.querySelector('.fab-label'))return;const label=document.createElement('span');label.className='fab-label';label.textContent=link.href.startsWith('tel:')?'Call':'Text';link.appendChild(label);});}

const makes={
Acura:['ILX','Integra','MDX','RDX','TLX'],Audi:['A3','A4','A5','A6','A7','A8','Q3','Q5','Q7','Q8','e-tron','RS3','RS5','RS6','RS7'],BMW:['2 Series','3 Series','4 Series','5 Series','7 Series','8 Series','X1','X2','X3','X4','X5','X6','X7','M2','M3','M4','M5','M8','i4','i5','i7','iX'],Buick:['Enclave','Encore','Envision'],Cadillac:['CT4','CT5','Escalade','Lyriq','XT4','XT5','XT6'],Chevrolet:['Blazer','Camaro','Colorado','Corvette','Equinox','Silverado','Suburban','Tahoe','Trailblazer','Traverse'],Chrysler:['200','300','Pacifica'],Dodge:['Challenger','Charger','Durango','Hornet'],Ford:['Bronco','Bronco Sport','Edge','Escape','Expedition','Explorer','F-150','F-250 Super Duty','F-350 Super Duty','F-450 Super Duty','Maverick','Mustang','Ranger','Transit'],GMC:['Acadia','Canyon','Sierra 1500','Sierra HD','Terrain','Yukon'],Genesis:['G70','G80','G90','GV70','GV80'],Honda:['Accord','Civic','CR-V','HR-V','Odyssey','Pilot','Passport','Ridgeline'],Hyundai:['Elantra','Ioniq','Kona','Palisade','Santa Cruz','Santa Fe','Sonata','Tucson','Venue'],Infiniti:['Q50','Q60','QX50','QX55','QX60','QX80'],Jaguar:['F-Pace','F-Type','I-Pace','XE','XF'],Jeep:['Cherokee','Compass','Gladiator','Grand Cherokee','Wagoneer','Wrangler'],Kia:['Carnival','Forte','K5','Niro','Seltos','Sorento','Soul','Sportage','Telluride'],Lexus:['ES','GX','IS','LC','LS','LX','NX','RC','RX','TX','UX'],Lincoln:['Aviator','Corsair','Nautilus','Navigator'],Mazda:['CX-30','CX-5','CX-50','CX-90','Mazda3','Mazda6','MX-5 Miata'],'Mercedes-Benz':['A-Class','C-Class','E-Class','S-Class','CLA','CLS','GLA','GLB','GLC','GLE','GLS','G-Class','EQS','EQE','AMG GT'],Mitsubishi:['Eclipse Cross','Outlander','Outlander Sport','Mirage'],Nissan:['Altima','Armada','Frontier','Kicks','Maxima','Murano','Pathfinder','Rogue','Sentra','Titan','Z'],Porsche:['718 Boxster','718 Cayman','911','Cayenne','Macan','Panamera','Taycan'],Ram:['1500','2500','3500','ProMaster'],Rivian:['R1T','R1S'],Subaru:['Ascent','BRZ','Crosstrek','Forester','Impreza','Legacy','Outback','WRX'],Tesla:['Model 3','Model S','Model X','Model Y','Cybertruck'],Toyota:['4Runner','Camry','Corolla','Crown','GR86','Grand Highlander','Highlander','Land Cruiser','Prius','RAV4','Sequoia','Sienna','Tacoma','Tundra'],Volkswagen:['Atlas','Golf','GTI','Jetta','ID.4','Taos','Tiguan','Touareg'],Volvo:['C40','S60','S90','V60','V90','XC40','XC60','XC90'],Polaris:['Ranger','RZR','Sportsman','General','Scrambler'],'Can-Am':['Defender','Maverick','Outlander','Renegade']
};
const cities=['Provo','Orem','Lehi','American Fork','Pleasant Grove','Saratoga Springs','Lindon','Draper','Spanish Fork','Other / Not Listed'];
const coverage=['Provo','Orem','Lehi','American Fork','Pleasant Grove','Saratoga Springs','Lindon','Draper','Spanish Fork'];
const $=id=>document.getElementById(id);
const coverageChips=$('coverageChips');if(coverageChips)coverage.forEach(c=>{const s=document.createElement('span');s.className='chip';s.textContent=c;coverageChips.appendChild(s)});
const city=$('city'),make=$('make'),model=$('model'),year=$('year'),cityManual=$('cityManual'),modelManual=$('modelManual');
if(city&&make&&model&&year&&cityManual&&modelManual){
  cities.forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=c;city.appendChild(o)});
  Object.keys(makes).sort().forEach(m=>{const o=document.createElement('option');o.value=m;o.textContent=m;make.appendChild(o)});
  for(let y=new Date().getFullYear()+1;y>=1990;y--){const o=document.createElement('option');o.value=y;o.textContent=y;year.appendChild(o)}
  function resetModels(){model.innerHTML='<option value="">Select make first</option>';model.disabled=!make.value;modelManual.style.display='none';if(make.value){(makes[make.value]||[]).forEach(m=>{const o=document.createElement('option');o.value=m;o.textContent=m;model.appendChild(o)});const x=document.createElement('option');x.value='Other / Not Listed';x.textContent='Other / Not Listed';model.appendChild(x)}}
  make.addEventListener('change',resetModels);model.addEventListener('change',()=>{const manual=model.value==='Other / Not Listed';modelManual.style.display=manual?'block':'none';modelManual.required=manual});city.addEventListener('change',()=>{const manual=city.value==='Other / Not Listed';cityManual.style.display=manual?'block':'none';cityManual.required=manual});resetModels();
}

const vehiclePreview=$('vehiclePreview'),vehiclePreviewLabel=$('vehiclePreviewLabel');
function updateVehiclePreview(){
 if(!vehiclePreview||!vehiclePreviewLabel)return;
 const selectedMake=make?.value||'';
 const selectedModel=(modelManual?.value||model?.value||'').trim();
 const selectedYear=year?.value||'';
 const chosenModel=selectedModel&&selectedModel!=='Other / Not Listed'?selectedModel:'';
 const label=[selectedYear,selectedMake,chosenModel].filter(Boolean).join(' ');
 vehiclePreviewLabel.textContent=label||'Choose a vehicle make and model';
 const vehicleDetails=vehiclePreview.querySelector('[data-vehicle-detail]');
 if(vehicleDetails)vehicleDetails.textContent=label?'Vehicle details saved with this request.':'Used to review mobile service fit.';
}
if(make)make.addEventListener('change',updateVehiclePreview);
if(model)model.addEventListener('change',updateVehiclePreview);
if(year)year.addEventListener('change',updateVehiclePreview);
if(modelManual)modelManual.addEventListener('input',updateVehiclePreview);
updateVehiclePreview();
const serviceMenuItems=[
  ['/car-diagnostics/','Diagnostics'],['/check-engine-light/','Check engine light'],['/electrical-diagnostics/','Electrical diagnostics'],['/programming-coding/','Programming & coding'],['/brake-repair/','Brake repair'],['/battery-replacement/','Battery replacement'],['/starter-alternator-replacement/','Starter & alternator'],['/oil-change/','Oil change'],['/rv-repair/','RV service'],['/trailer-repair/','Trailer service'],['/request/?service=UTV%20%2F%20Off-Road#request','UTV / off-road'],['/fleet/','Fleet service']
];
const companyMenuItems=[
  ['/work/','Recent work'],['/reviews/','Reviews'],['/pricing/','Starting prices'],['/payments/','Payments'],['/financing/','Financing'],['/faq/','FAQs'],['/#coverage','Service coverage'],['/request/','Contact & request']
];
const linkList=items=>items.map(([href,label])=>'<a href="'+href+'">'+label+'</a>').join('');
const navlinks=document.querySelector('.navlinks');
if(navlinks&&!navlinks.querySelector('.nav-more')){
  const explore=document.createElement('details');
  explore.className='nav-more';
  explore.innerHTML='<summary>Explore</summary><div class="nav-more-panel"><section><span class="nav-more-label">Services</span>'+linkList(serviceMenuItems)+'</section><section><span class="nav-more-label">REVLINE</span>'+linkList(companyMenuItems)+'</section></div>';
  navlinks.appendChild(explore);
  document.addEventListener('pointerdown',event=>{if(!explore.contains(event.target))explore.open=false;});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&explore.open){explore.open=false;explore.querySelector('summary').focus();}});
}
const menuBtn=$('menuBtn'), mobilePanel=$('mobilePanel');
if(mobilePanel&&!mobilePanel.dataset.revlineMenu){
  mobilePanel.innerHTML='<details class="mobile-menu-group"><summary>Services &amp; diagnostics</summary><div>'+linkList(serviceMenuItems)+'</div></details><details class="mobile-menu-group"><summary>REVLINE</summary><div>'+linkList(companyMenuItems)+'</div></details><div class="mobile-panel-actions"><a href="tel:+12243458151" data-conversion="phone">Call</a><a href="sms:+12243458151" data-conversion="sms">Text</a><a href="/request/" data-conversion="quote">Request</a></div>';
  mobilePanel.dataset.revlineMenu='true';
}
if(menuBtn&&mobilePanel){menuBtn.addEventListener('click',()=>{const open=mobilePanel.classList.toggle('open');menuBtn.setAttribute('aria-expanded',open?'true':'false')});mobilePanel.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobilePanel.classList.remove('open');menuBtn.setAttribute('aria-expanded','false')}));}
const galleryFilters=document.querySelectorAll('.gallery-filter[data-filter]'),galleryCards=[...document.querySelectorAll('.gallery-card[data-categories]')];
if(galleryFilters.length&&galleryCards.length){
 const filterStatus=document.createElement('p');filterStatus.className='gallery-filter-status';filterStatus.setAttribute('role','status');filterStatus.setAttribute('aria-live','polite');document.querySelector('.gallery-toolbar')?.appendChild(filterStatus);
 galleryFilters.forEach(button=>button.addEventListener('click',()=>{
  const filter=button.dataset.filter||'all';let shown=0;
  galleryFilters.forEach(item=>item.setAttribute('aria-pressed',item===button?'true':'false'));
  galleryCards.forEach(card=>{const categories=(card.dataset.categories||'').split(/\s+/);const visible=filter==='all'||categories.includes(filter);card.hidden=!visible;if(visible)shown++;});
  filterStatus.textContent=shown+' '+(shown===1?'photo':'photos')+' shown.';
 }));
}
const lb=$('lightbox'),lbi=$('lightboxImage'),lightboxClose=$('lightboxClose');let lastGalleryFocus=null;
if(lb&&lbi&&lightboxClose){
 const closeLightbox=()=>{lb.classList.remove('open');lb.setAttribute('aria-hidden','true');document.body.classList.remove('lock');if(lastGalleryFocus)lastGalleryFocus.focus();};
 document.querySelectorAll('.gallery-card').forEach(card=>card.addEventListener('click',()=>{const img=card.querySelector('img');if(!img)return;lastGalleryFocus=card;lbi.src=img.src;lbi.alt=img.alt;lb.classList.add('open');lb.setAttribute('aria-hidden','false');document.body.classList.add('lock');lightboxClose.focus();}));
 lightboxClose.addEventListener('click',closeLightbox);
 lb.addEventListener('click',e=>{if(e.target===lb)closeLightbox();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&lb.classList.contains('open'))closeLightbox();});
}
const heroVideo=document.querySelector('[data-hero-video]');
if(heroVideo){
 const source=(heroVideo.dataset.src||'').trim();
 const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(source&&/^\/media\/[A-Za-z0-9._-]+\.mp4$/.test(source)&&!reduceMotion){
  const heroMedia=heroVideo.closest('.hero-media');
  heroVideo.addEventListener('playing',()=>heroMedia?.classList.add('video-ready'),{once:true});
  heroVideo.src=source;heroVideo.load();
  heroVideo.play().catch(()=>{});
 }
}
const form=$('serviceForm');
const formStatus=$('formStatus');
const fileInput=$('attachments');
if(fileInput&&form){
  fileInput.addEventListener('change',()=>{
    const files=Array.from(fileInput.files||[]);
    const total=files.reduce((sum,file)=>sum+file.size,0);
    const invalid=files.length>3||total>10*1024*1024||files.some(file=>!['image/jpeg','image/png'].includes(file.type));
    fileInput.setCustomValidity(invalid?'Choose up to 3 JPG or PNG images totaling less than 10 MB.':'');
    if(formStatus)formStatus.textContent=invalid?fileInput.validationMessage:(files.length?'Photos ready to attach.':'Ready when you are.');
  });
}
const requestedService=new URLSearchParams(window.location.search).get('service');
const serviceSelect=$('service');
const serviceAliases={'diagnostics':'Mobile Diagnostics','mobile car diagnostics':'Mobile Diagnostics','electrical diagnostics':'Electrical Diagnostics','brake service':'Brake Repair','mobile brake repair':'Brake Repair','starter & alternator service':'Starter & Alternator Replacement','mobile battery replacement':'Battery Replacement','mobile oil change':'Oil Change','vehicle programming & coding':'Programming & Coding'};
if(serviceSelect&&requestedService){
  const normalizedService=serviceAliases[requestedService.trim().toLowerCase()]||requestedService;
  const option=Array.from(serviceSelect.options).find(item=>item.textContent.trim().toLowerCase()===normalizedService.trim().toLowerCase());
  if(option)serviceSelect.value=option.value;
}
const preferredDate=$('preferredDate');
if(preferredDate){const localNow=new Date();localNow.setMinutes(localNow.getMinutes()-localNow.getTimezoneOffset());preferredDate.min=localNow.toISOString().slice(0,10)}
form?.addEventListener('submit',event=>{
  if(fileInput&&!fileInput.reportValidity()){event.preventDefault();return}
  const submit=form.querySelector('button[type="submit"]');
  if(submit){submit.disabled=true;submit.textContent='Sending request…';}
  if(formStatus)formStatus.textContent='Sending your request to REVLINE…';
  trackConversion('service_request_submitted',{form:'service_request'});
});

const revealEls=document.querySelectorAll('.reveal');
document.documentElement.classList.add('motion-ready');
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


const counters=document.querySelectorAll('[data-count]');
if(counters.length&&'IntersectionObserver' in window&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  const countObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;const node=entry.target;const end=Number(node.dataset.count);if(!Number.isFinite(end)||end<1){countObserver.unobserve(node);return;}const start=performance.now(),duration=650;const tick=now=>{const progress=Math.min((now-start)/duration,1);node.textContent=String(Math.round(end*(1-Math.pow(1-progress,3))));if(progress<1)requestAnimationFrame(tick);};requestAnimationFrame(tick);countObserver.unobserve(node);}),{threshold:.65});
  counters.forEach(node=>countObserver.observe(node));
}

document.querySelectorAll('img:not(#lightboxImage)').forEach(img=>{
  img.addEventListener('error',()=>{
    if(img.dataset.fallbackUsed) return;
    img.dataset.fallbackUsed='true';
    img.src='/revline-r.webp';
  },{once:true});
});
if(location.pathname==='/thank-you.html')trackConversion('service_request_received',{page:'thank-you'});
})();
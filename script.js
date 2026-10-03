(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const menuToggle = $('#menuToggle');
  const mobileMenu = $('#mobileMenu');
  const closeMenu = () => {
    mobileMenu?.classList.remove('open');
    menuToggle?.classList.remove('active');
    menuToggle?.setAttribute('aria-expanded','false');
    menuToggle?.setAttribute('aria-label','Open menu');
  };
  menuToggle?.addEventListener('click', () => {
    const open = !mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', open);
    menuToggle.classList.toggle('active', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  $$('#mobileMenu a').forEach(a => a.addEventListener('click', closeMenu));

  const header = $('#siteHeader');
  let scrollTick = false;
  const updateHeader = () => {
    header?.classList.toggle('scrolled', window.scrollY > 30);
    document.documentElement.style.setProperty('--bg-y', `${Math.max(-32, Math.min(32, -window.scrollY * 0.035))}px`);
  };
  addEventListener('scroll', () => {
    if (scrollTick) return;
    scrollTick = true;
    requestAnimationFrame(() => { scrollTick = false; updateHeader(); });
  }, {passive:true});
  updateHeader();

  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:0.06, rootMargin:'0px 0px -20px'});
    revealEls.forEach(el => observer.observe(el));
  } else revealEls.forEach(el => el.classList.add('in'));

  const MAKE_MODELS = {
    Acura:['ILX','Integra','MDX','RDX','TLX','RLX','NSX','TSX','ZDX'],
    'Alfa Romeo':['Giulia','Stelvio','Tonale','4C'],
    Audi:['A3','A4','A5','A6','A7','A8','Q3','Q4 e-tron','Q5','Q7','Q8','e-tron','RS 3','RS 5','RS 6','RS 7','RS Q8','S3','S4','S5','S6','S7','S8'],
    BMW:['2 Series','3 Series','4 Series','5 Series','6 Series','7 Series','8 Series','X1','X2','X3','X4','X5','X6','X7','XM','i4','i5','i7','iX','M2','M3','M4','M5','M8','Z4'],
    Buick:['Enclave','Encore','Encore GX','Envision','LaCrosse','Regal'],
    Cadillac:['CT4','CT5','CT6','Escalade','LYRIQ','XT4','XT5','XT6','ATS','CTS','DTS','SRX'],
    Chevrolet:['Blazer','Bolt EV','Camaro','Colorado','Corvette','Equinox','Express','Impala','Malibu','Silverado 1500','Silverado 2500HD','Silverado 3500HD','Suburban','Tahoe','Traverse','Trax'],
    Chrysler:['200','300','Pacifica','Pacifica Hybrid','Town & Country','Voyager'],
    Dodge:['Challenger','Charger','Durango','Grand Caravan','Hornet','Journey'],
    Ford:['Bronco','Bronco Sport','Edge','Escape','Expedition','Explorer','F-150','F-150 Lightning','F-250 Super Duty','F-350 Super Duty','F-450 Super Duty','Fusion','Maverick','Mustang','Mustang Mach-E','Ranger','Transit','Transit Connect'],
    Genesis:['G70','G80','G90','GV60','GV70','GV80'],
    GMC:['Acadia','Canyon','Hummer EV','Sierra 1500','Sierra 2500HD','Sierra 3500HD','Terrain','Yukon','Yukon XL'],
    Honda:['Accord','Civic','CR-V','CR-Z','Element','Fit','HR-V','Insight','Odyssey','Passport','Pilot','Ridgeline'],
    Hyundai:['Accent','Elantra','Ioniq','Ioniq 5','Ioniq 6','Kona','Palisade','Santa Cruz','Santa Fe','Sonata','Tucson','Venue'],
    INFINITI:['Q50','Q60','QX30','QX50','QX55','QX60','QX80','G35','G37'],
    Jaguar:['F-Pace','F-Type','I-Pace','XE','XF','XJ'],
    Jeep:['Cherokee','Compass','Gladiator','Grand Cherokee','Grand Wagoneer','Renegade','Wrangler','Wagoneer'],
    Kia:['Carnival','EV6','Forte','K5','Niro','Optima','Rio','Seltos','Sorento','Soul','Sportage','Telluride'],
    'Land Rover':['Defender','Discovery','Discovery Sport','Range Rover','Range Rover Sport','Range Rover Velar','Range Rover Evoque'],
    Lexus:['ES','GX','IS','LC','LS','LX','NX','RC','RX','RZ','TX','UX'],
    Lincoln:['Aviator','Corsair','Nautilus','Navigator','MKC','MKZ'],
    Lucid:['Air','Gravity'],
    Maserati:['Ghibli','Grecale','GranTurismo','Levante','MC20','Quattroporte'],
    Mazda:['CX-3','CX-30','CX-5','CX-50','CX-9','CX-90','Mazda3','Mazda6','MX-5 Miata'],
    'Mercedes-Benz':['A-Class','C-Class','CLA','CLS','E-Class','EQE','EQS','G-Class','GLA','GLB','GLC','GLE','GLS','S-Class','SL','AMG GT','AMG GT 4-Door'],
    MINI:['Cooper','Countryman','Clubman','Convertible','Hardtop'],
    Mitsubishi:['Eclipse Cross','Mirage','Outlander','Outlander Sport'],
    Nissan:['Altima','Armada','Frontier','GT-R','Kicks','Leaf','Maxima','Murano','Pathfinder','Rogue','Sentra','Titan','Versa','Z'],
    Porsche:['718 Boxster','718 Cayman','911','Cayenne','Macan','Panamera','Taycan'],
    Ram:['1500','1500 Classic','2500','3500','ProMaster','ProMaster City'],
    Rivian:['R1T','R1S'],
    Subaru:['Ascent','BRZ','Crosstrek','Forester','Impreza','Legacy','Outback','Solterra','WRX'],
    Tesla:['Model 3','Model S','Model X','Model Y','Cybertruck'],
    Toyota:['4Runner','Avalon','bZ4X','Camry','Corolla','Corolla Cross','Crown','GR86','Grand Highlander','Highlander','Land Cruiser','Prius','RAV4','Sequoia','Sienna','Tacoma','Tundra','Venza'],
    Volkswagen:['Arteon','Atlas','Atlas Cross Sport','Beetle','Golf','Golf GTI','Golf R','ID.4','ID.7','Jetta','Passat','Taos','Tiguan'],
    Volvo:['C40 Recharge','EX30','EX90','S60','S90','V60','V90','XC40','XC60','XC90'],
    Hummer:['H1','H2','H3','EV'],
    International:['CV','HV','LT','LoneStar','MV','RH','WorkStar'],
    Isuzu:['NPR','NQR','NRR','F-Series','G-Series'],
    Kenworth:['T270','T370','T380','T680','T880','W900'],
    Mack:['Anthem','Granite','LR','MD','Pinnacle'],
    Peterbilt:['330','337','389','520','537','548','567','579'],
    'Western Star':['47X','49X','57X','6900'],
    Freightliner:['Cascadia','Cascadia Evolution','M2 106','M2 112','Century Class','Columbia','Coronado','Sprinter'],
    Hino:['195','258','268','338','L Series','XL Series'],
    Karma:['GS-6','Revero']
  };
  const MAKES = Object.keys(MAKE_MODELS).sort((a,b)=>a.localeCompare(b));
  const YEARS = Array.from({length:new Date().getFullYear()-1979},(_,i)=>String(new Date().getFullYear()-i));
  const CITIES = ['American Fork','Bluffdale','Bountiful','Brigham City','Cedar City','Clearfield','Clinton','Cottonwood Heights','Draper','Eagle Mountain','Farmington','Herriman','Kaysville','Layton','Lehi','Lindon','Logan','Mapleton','Midvale','Millcreek','Murray','Nephi','North Salt Lake','Ogden','Orem','Park City','Payson','Pleasant Grove','Pleasant View','Provo','Riverton','Roosevelt','Roy','Salem','Salt Lake City','Sandy','Santaquin','Saratoga Springs','South Jordan','South Ogden','South Salt Lake','Spanish Fork','Springville','St. George','Syracuse','Taylorsville','Tooele','Vernal','Vineyard','Washington','West Jordan','West Valley City','Woods Cross'];

  const fillSelect = (select, values, placeholder, preserve=false) => {
    if (!select) return;
    const current = preserve ? select.value : '';
    select.innerHTML = `<option value="">${placeholder}</option>`;
    values.forEach(v => {
      const opt = document.createElement('option');
      opt.value=v; opt.textContent=v; select.appendChild(opt);
    });
    if (preserve && values.includes(current)) select.value=current;
  };
  fillSelect($('#requestYear'), YEARS, 'Select year');
  fillSelect($('#otherYear'), YEARS, 'Select year');
  fillSelect($('#requestMake'), MAKES, 'Select make');
  fillSelect($('#requestCity'), CITIES, 'Select Utah city / town');

  const requestMake=$('#requestMake'), requestModel=$('#requestModel');
  const syncModels=()=>{
    const make=requestMake?.value;
    fillSelect(requestModel, make && MAKE_MODELS[make] ? MAKE_MODELS[make] : [], make ? 'Select model' : 'Select make first');
    if(requestModel) requestModel.disabled=!make;
  };
  requestMake?.addEventListener('change',syncModels);

  const serviceSelect=$('#serviceSelect');
  $$('[data-service-link]').forEach(link=>{
    link.addEventListener('click',()=>{
      const v=link.dataset.serviceLink;
      if(serviceSelect){
        const o=[...serviceSelect.options].find(opt=>opt.textContent===v);
        if(o) serviceSelect.value=o.value;
      }
    });
  });

  const autoFields=$('.auto-fields'), otherFields=$('.other-fields'), category=$('#requestCategory');
  const autoReq=[$('#requestYear'),$('#requestMake'),$('#requestModel')];
  const otherReq=[$('#otherType')];
  const setVehicleMode=mode=>{
    const auto=mode==='auto';
    autoFields?.classList.toggle('hidden',!auto);
    otherFields?.classList.toggle('hidden',auto);
    if(category) category.value=auto?'Car / Truck':'Other';
    autoReq.forEach(el=>{if(el){el.disabled=!auto;el.required=auto;}});
    otherReq.forEach(el=>{if(el){el.disabled=auto;el.required=!auto;}});
    $$('.switch-btn').forEach(btn=>btn.classList.toggle('active',btn.dataset.vehicle===mode));
  };
  $$('.switch-btn').forEach(btn=>btn.addEventListener('click',()=>setVehicleMode(btn.dataset.vehicle)));
  setVehicleMode('auto');

  // Form UX: native FormSubmit contract is left intact.
  const form=$('#requestForm'), help=$('#formHelp'), msg=$('#formMessage'), fileInput=form?.querySelector('input[type="file"]');
  const emailField=form?.querySelector('input[name="email"]');
  const replyTo=form?.querySelector('input[name="_replyto"]');
  emailField?.addEventListener('input',()=>{ if(replyTo) replyTo.value=emailField.value.trim(); });
  form?.addEventListener('submit',e=>{
    if(fileInput?.files?.length){
      const total=[...fileInput.files].reduce((s,f)=>s+f.size,0);
      if(total>10*1024*1024){
        e.preventDefault();
        if(msg){msg.className='form-message error';msg.textContent='Please keep the attachment under 10 MB.';}
        return;
      }
    }
    const btn=form.querySelector('button[type="submit"]');
    if(btn){btn.disabled=true;btn.innerHTML='Sending request… <b>→</b>';}
    if(help) help.textContent='Sending securely to REVLINE…';
  });

  // Lightbox
  const lightbox=$('#lightbox'), lbImg=$('#lightboxImage'), lbCap=$('#lightboxCaption');
  const closeLightbox=()=>{
    lightbox?.classList.remove('open');
    lightbox?.setAttribute('aria-hidden','true');
    if(lbImg) lbImg.src='';
    document.body.classList.remove('locked');
  };
  $$('[data-full]').forEach(item=>{
    item.addEventListener('click',()=>{
      if(!lightbox||!lbImg) return;
      lbImg.src=item.dataset.full;
      lbImg.alt=item.dataset.caption||'REVLINE work';
      if(lbCap) lbCap.textContent=item.dataset.caption||'';
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden','false');
      document.body.classList.add('locked');
    });
  });
  $('#lightboxClose')?.addEventListener('click',closeLightbox);
  $('#lightboxBg')?.addEventListener('click',closeLightbox);
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){closeLightbox();closeMenu();}
  });
})();

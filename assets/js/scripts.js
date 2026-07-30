// Localize a transient runtime string via i18n.js (no-op in English / if i18n absent).
const t=s=>(window.t||(x=>x))(s);

// Page titles for SEO
const titles={home:'EquaCore Digital — Digital Operations. Delivered Right.',services:'Services — EquaCore Digital',servicenow:'ServiceNow Nigeria — Consulting, Talent & Managed Services',haloitsm:'Halo Services (HaloITSM, HaloPSA, HaloCRM) — EquaCore Digital',talent:'Talent Augmentation — EquaCore Digital','talent-pool':'Join Our Talent Pool — EquaCore Digital',engagement:'Engagement Models — EquaCore Digital',about:'About — EquaCore Digital',markets:'Markets Served — EquaCore Digital',contact:'Contact — EquaCore Digital',privacy:'Privacy Policy — EquaCore Digital','thank-you':'Thank You — EquaCore Digital','enquiry-thanks':'Message Received — EquaCore Digital'};

// Per-route meta descriptions — answer-first, distinct per page so each indexed URL has its own snippet (SEO + AI answer engines)
const descs={
  home:'EquaCore Digital is a full Halo partner delivering HaloITSM, HaloPSA, and HaloCRM implementations — plus ServiceNow talent augmentation, managed services, and independent advisory. Based in Nigeria, delivering globally.',
  services:'EquaCore Digital delivers four services: ServiceNow talent augmentation, full Halo platform implementation (HaloITSM, HaloPSA, HaloCRM), managed services, and independent advisory.',
  servicenow:'EquaCore Digital is a Nigeria-based ServiceNow practice offering consulting, talent augmentation, managed services, and independent advisory for organisations in Nigeria and worldwide. Headquartered in Lagos.',
  haloitsm:'EquaCore Digital is a full Halo Technology Alliance Partner implementing HaloITSM, HaloPSA, and HaloCRM — covering migrations, process alignment, onboarding, and post-go-live managed support.',
  talent:'EquaCore Digital places pre-vetted, enterprise-ready ServiceNow and Halo professionals — administrators, developers, architects, BAs, CMDB/Discovery/SAM specialists, and certified Halo administrators — with global enterprises.',
  'talent-pool':'Join the EquaCore talent pool. ServiceNow and Halo professionals in Nigeria can register to be matched with enterprise placements across Nigeria, the UK, and Europe — permanent, contract, or embedded.',
  engagement:'EquaCore Digital engagement models: staff augmentation, managed services, and advisory — with structured governance and measurable outcomes for distributed teams.',
  about:'EquaCore Digital is a practitioner-led digital operations firm specialising in ServiceNow and the full Halo platform, based in Nigeria and delivering globally.',
  markets:'EquaCore Digital serves clients across Nigeria, the UK, Europe, and West Africa with ServiceNow and Halo platform delivery backed by structured governance.',
  contact:'Contact EquaCore Digital to discuss ServiceNow talent, Halo platform implementation, managed services, or advisory. Based in Lagos, Nigeria, delivering globally.',
  privacy:'EquaCore Digital privacy policy — how we collect, use, and protect your data.'
};

// Update canonical, description, and Open Graph/Twitter meta to match the active route.
// Canonical is origin-relative so .ng URLs stay self-referencing on the .ng hostname (compliance requirement).
function setMeta(id){
  const title=titles[id]||titles.home;
  const desc=descs[id]||descs.home;
  const path=(id==='home'||!id)?'/':'/'+id;
  const url=location.origin+path;
  const set=(sel,attr,val)=>{const el=document.querySelector(sel);if(el)el.setAttribute(attr,val);};
  set('link[rel="canonical"]','href',url);
  set('meta[name="description"]','content',desc);
  set('meta[property="og:url"]','content',url);
  set('meta[property="og:title"]','content',title);
  set('meta[name="twitter:title"]','content',title);
  set('meta[property="og:description"]','content',desc);
  set('meta[name="twitter:description"]','content',desc);
  // Keep hreflang alternates in sync for client-side navigation.
  set('link[hreflang="en"]','href','https://equacoredigital.com'+path);
  set('link[hreflang="en-NG"]','href','https://equacoredigital.ng'+path);
  set('link[hreflang="x-default"]','href','https://equacoredigital.com'+path);
}

// Single reveal observer, re-created on each route so new .rv nodes get observed.
let observer=null;
function initObserver(){
  if(observer)observer.disconnect();
  observer=new IntersectionObserver(entries=>{
    entries.forEach(en=>{if(en.isIntersecting){en.target.classList.add('vis');observer.unobserve(en.target)}})
  },{threshold:.08,rootMargin:'0px 0px -30px 0px'});
  document.querySelectorAll('.rv:not(.vis)').forEach(el=>observer.observe(el));
}

// Path-based routing with history support
function showPage(id){
  if(!document.getElementById('pg-'+id))id='home';
  document.querySelectorAll('.pg').forEach(p=>p.classList.remove('act'));
  document.getElementById('pg-'+id).classList.add('act');
  document.querySelectorAll('.nl').forEach(l=>l.classList.remove('act'));
  const navMap={home:0,services:1,servicenow:1,haloitsm:1,talent:1,'talent-pool':1,'thank-you':1,engagement:2,about:3,markets:3,contact:4,privacy:4,'enquiry-thanks':4};
  const directLinks=document.querySelectorAll('.nls > .nl');
  if(directLinks[navMap[id]])directLinks[navMap[id]].classList.add('act');
  // Close mobile nav
  document.getElementById('nls').classList.remove('op');
  const ntBtn=document.getElementById('nt');
  ntBtn.classList.remove('op');
  ntBtn.setAttribute('aria-expanded','false');
  // Update title + canonical/description/OG meta for the active route
  document.title=titles[id]||titles.home;
  setMeta(id);
  // Scroll & re-observe
  window.scrollTo({top:0,behavior:'smooth'});
  setTimeout(()=>{document.querySelectorAll('.pg.act .rv').forEach(el=>el.classList.remove('vis'));initObserver()},120);
}

// Path-based routing - handles direct URLs, back/forward, and SPA navigation
function handleRoute(){
  let path=location.pathname.replace(/^\//, '').replace(/\.html$/, '').replace(/\/$/, '')||'';
  if(!path && location.hash){
    // Some referrers redirect to /#page — canonicalise to /page
    path=location.hash.replace(/^#/,'');
    history.replaceState(null,'','/'+path);
  }
  showPage(path||'home');
}
// Intercept internal link clicks - push state without full page reload
document.addEventListener('click',function(e){
  const a=e.target.closest('a[href]');
  if(!a)return;
  const href=a.getAttribute('href');
  if(!href||href.startsWith('http')||href.startsWith('mailto:')||href.startsWith('//')||href==='#main')return;
  e.preventDefault();
  const path=href.replace(/^\//, '').replace(/\/$/, '')||'home';
  history.pushState(null,'',href);
  showPage(path);
});
window.addEventListener('popstate',handleRoute);
window.addEventListener('hashchange',handleRoute);
window.addEventListener('DOMContentLoaded',()=>{handleRoute();initObserver()});

// Dropdown state helper — sets .om class and aria-expanded in sync
function setDropdown(hd,open){
  const btn=hd.querySelector('.hd-btn');
  hd.classList.toggle('om',open);
  if(btn)btn.setAttribute('aria-expanded',open);
}
function closeAllDropdowns(){document.querySelectorAll('.nl.hd').forEach(function(hd){setDropdown(hd,false)});}

// Mobile tap toggle (desktop width guard keeps this mobile-only)
function tmd(el){if(window.innerWidth<=768){event.stopPropagation();setDropdown(el,!el.classList.contains('om'));}}

// Desktop: keep aria-expanded in sync with CSS hover / focus-within state
document.querySelectorAll('.nl.hd').forEach(function(hd){
  hd.addEventListener('mouseenter',function(){if(window.innerWidth>768)setDropdown(hd,true);});
  hd.addEventListener('mouseleave',function(){if(window.innerWidth>768)setDropdown(hd,false);});
  hd.addEventListener('focusin',function(){if(window.innerWidth>768)setDropdown(hd,true);});
  hd.addEventListener('focusout',function(e){if(window.innerWidth>768&&!hd.contains(e.relatedTarget))setDropdown(hd,false);});
});

// Close on Escape (works on both desktop and mobile)
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeAllDropdowns();});

// Close on outside click
document.addEventListener('click',function(e){if(!e.target.closest('.nl.hd'))closeAllDropdowns();});

// Close dropdown when a menu link is followed (cleans up mobile .om state)
// No stopPropagation — clicks must reach the document-level SPA router
document.querySelectorAll('.ndd a').forEach(function(a){
  a.addEventListener('click',function(){
    const hd=a.closest('.nl.hd');
    if(hd)setDropdown(hd,false);
  });
});

// Toggle mobile nav
function tn(){
  const nls=document.getElementById('nls');
  const ntBtn=document.getElementById('nt');
  nls.classList.toggle('op');
  ntBtn.classList.toggle('op');
  ntBtn.setAttribute('aria-expanded',nls.classList.contains('op'));
}

// Scroll effects
function onScroll(){
  const y=window.scrollY;
  document.getElementById('nav').classList.toggle('sc',y>10);
  document.getElementById('stt').classList.toggle('show',y>400);
}
window.addEventListener('scroll',onScroll,{passive:true});

// Page-load timestamp for time-trap (per-load is fine; SPA nav still leaves it >>3s)
const PAGE_LOADED_AT=Date.now();

// Spam classifier. Returns null if clean, else {reason, silent}.
// silent=true  -> fake success (honeypot/time-trap) so bots learn nothing
// silent=false -> inline error (email regex) so real users can self-correct
function isSpam(payload, elapsedMs){
  if(payload.website) return {reason:'honeypot', silent:true};
  if(elapsedMs < 3000) return {reason:'too_fast', silent:true};
  const email=(payload.email||'').toLowerCase().trim();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return {reason:'bad_email', silent:false};
  const [local,domain]=email.split('@');
  if(local===domain.split('.')[0]) return {reason:'bad_email', silent:false};
  const disposable=['mailinator.com','tempmail.com','guerrillamail.com','10minutemail.com','throwawaymail.com','yopmail.com','trashmail.com','sharklasers.com','maildrop.cc','getnada.com','temp-mail.org','fakeinbox.com'];
  if(disposable.includes(domain)) return {reason:'bad_email', silent:false};
  return null;
}

// Contact form submit: client-side validation + spam guards, then POST to n8n.
function hs(e){
  e.preventDefault();
  const form=e.target;
  if(!form.checkValidity()){form.reportValidity();return}
  const b=form.querySelector('button[type="submit"]');
  const errEl=document.getElementById('cf-error');
  errEl.style.display='none';errEl.textContent='';
  const fd=new FormData(form);
  const payload={name:fd.get('name'),email:fd.get('email'),company:fd.get('company')||'',platform:fd.get('platform')||'',message:fd.get('message'),website:fd.get('website')||'',cf_token:fd.get('cf-turnstile-response')||'',elapsed_ms:Date.now()-PAGE_LOADED_AT,src:'web'};
  const spam=isSpam(payload, payload.elapsed_ms);
  if(spam){
    if(spam.silent){
      form.reset();
      history.pushState(null,'','/enquiry-thanks');
      showPage('enquiry-thanks');
    } else {
      errEl.textContent=t('Please enter a valid email address from a real domain.');
      errEl.style.display='block';
    }
    return;
  }
  if(!payload.cf_token){
    errEl.textContent=t('Please complete the security check and try again.');
    errEl.style.display='block';
    return;
  }
  b.disabled=true;
  b.textContent=t('Sending...');
  fetch(form.action,{method:'POST',body:JSON.stringify(payload),headers:{'Content-Type':'application/json','Accept':'application/json'}})
  .then(r=>{
    if(r.ok){
      form.reset();
      if(window.turnstile)turnstile.reset();
      b.disabled=false;
      history.pushState(null,'','/enquiry-thanks');
      showPage('enquiry-thanks');
    } else {throw new Error('fail')}
  })
  .catch(()=>{
    b.innerHTML='<span>'+t('Error — please try again')+'</span>';
    b.style.background='#e53e3e';
    setTimeout(()=>{b.innerHTML=t('Send Message')+' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>';b.style.background='';b.disabled=false},3000);
  });
}

// Booking gate — every "Book a demo" action opens a mini-form; the MS Bookings
// URL is only returned by n8n after server-side Turnstile verification.
(function(){
  const modal=document.getElementById('bkm');
  if(!modal)return;
  const form=document.getElementById('bkf');
  const err=document.getElementById('bk-err');
  const fallback=document.getElementById('bk-fallback');
  const tsHost=document.getElementById('bk-ts');
  let tsId=null,openedAt=0,lastFocus=null;
  function open(){
    lastFocus=document.activeElement;
    modal.hidden=false;openedAt=Date.now();
    document.body.style.overflow='hidden';
    if(window.turnstile){
      if(tsId===null){tsId=turnstile.render(tsHost,{sitekey:'0x4AAAAAADNeUrBaLGCiZE2q',size:'flexible'});}
      else{turnstile.reset(tsId);}
    }
    document.getElementById('bk-n').focus();
  }
  function close(){
    modal.hidden=true;document.body.style.overflow='';
    err.style.display='none';fallback.style.display='none';
    if(lastFocus&&lastFocus.focus)lastFocus.focus();
  }
  document.addEventListener('click',function(e){
    const book=e.target.closest('[data-book]');
    if(book){e.preventDefault();e.stopPropagation();open();return;}
    if(e.target.closest('[data-bkm-close]'))close();
  },true);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!modal.hidden)close();});
  form.addEventListener('submit',function(e){
    e.preventDefault();
    if(!form.checkValidity()){form.reportValidity();return}
    err.style.display='none';
    const token=(window.turnstile&&tsId!==null)?turnstile.getResponse(tsId):'';
    if(!token){err.textContent=t('Please complete the security check.');err.style.display='block';return}
    const fd=new FormData(form);
    const payload={name:fd.get('name'),email:fd.get('email'),company:fd.get('company')||'',website:fd.get('website')||'',cf_token:token,elapsed_ms:Date.now()-openedAt,src:'demo-gate'};
    const spam=isSpam(payload,payload.elapsed_ms);
    if(spam&&!spam.silent){err.textContent=t('Please enter a valid email address from a real domain.');err.style.display='block';return}
    const b=form.querySelector('button[type="submit"]');
    b.disabled=true;b.textContent=t('Checking...');
    fetch('https://voidnox.app.n8n.cloud/webhook/demo-gate',{method:'POST',body:JSON.stringify(payload),headers:{'Content-Type':'application/json'}})
    .then(r=>r.json())
    .then(d=>{
      b.disabled=false;b.textContent=t('Continue to booking');
      var u;try{u=new URL(d&&d.url)}catch(_){u=null}
      if(d&&d.ok&&u&&u.protocol==='https:'&&/(^|\.)office\.com$|(^|\.)microsoft\.com$/.test(u.hostname)){
        const w=window.open(u.href,'_blank','noopener');
        fallback.href=u.href;fallback.style.display='block';
        if(w)setTimeout(close,1500);
      }else{
        err.textContent=t('We could not verify your request. Please try again, or use the contact form instead.');
        err.style.display='block';
        if(window.turnstile&&tsId!==null)turnstile.reset(tsId);
      }
    })
    .catch(function(){
      b.disabled=false;b.textContent=t('Continue to booking');
      err.textContent=t('Connection error — please try again.');
      err.style.display='block';
    });
  });
})();

// Cursor-tracking mint glow for .glow-card — one rAF-throttled listener feeds
// viewport coords into :root vars; cards light up as the pointer sweeps past.
(function(){
  if(!document.querySelector('.glow-card'))return;
  var s=document.documentElement.style;
  s.setProperty('--x','-9999');s.setProperty('--y','-9999');
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var tick=false,cx=0,cy=0;
  window.addEventListener('pointermove',function(e){
    cx=e.clientX;cy=e.clientY;
    if(!tick){tick=true;requestAnimationFrame(function(){
      s.setProperty('--x',cx.toFixed(1));s.setProperty('--y',cy.toFixed(1));tick=false;
    });}
  },{passive:true});
})();

// Talent Pool — native form posts multipart (fields + CV) to the n8n webhook.
(function(){
  const form=document.getElementById('tpf');
  if(!form)return;
  const err=document.getElementById('tp-err');
  const cv=document.getElementById('tp-cv');
  form.addEventListener('submit',function(e){
    e.preventDefault();
    if(!form.checkValidity()){form.reportValidity();return}
    err.style.display='none';
    if(cv.files[0]&&cv.files[0].size>8*1024*1024){
      err.textContent=t('Your CV is larger than 8 MB. Please upload a smaller file.');err.style.display='block';return;
    }
    const fd=new FormData(form);
    fd.set('certifications','Minimum cert attested: yes - '+String(fd.get('certifications')||'').trim());
    const token=fd.get('cf-turnstile-response')||'';
    if(!token){err.textContent=t('Please complete the security check.');err.style.display='block';return}
    fd.append('cf_token',token);
    fd.append('elapsed_ms',String(Date.now()-PAGE_LOADED_AT));
    const b=form.querySelector('button[type="submit"]');
    b.disabled=true;b.textContent=t('Submitting...');
    fetch('https://voidnox.app.n8n.cloud/webhook/talent-apply',{method:'POST',body:fd})
    .then(r=>r.json())
    .then(d=>{
      b.disabled=false;b.textContent=t('Submit Application');
      if(d&&d.ok){
        form.reset();
        if(window.turnstile)turnstile.reset();
        history.pushState(null,'','/thank-you');showPage('thank-you');
      }else{
        err.textContent=t('We could not verify your application. Please complete the security check and try again.');
        err.style.display='block';
        if(window.turnstile)turnstile.reset();
      }
    })
    .catch(function(){
      b.disabled=false;b.textContent=t('Submit Application');
      err.textContent=t('Connection error — please try again.');err.style.display='block';
    });
  });
})();

// Aether Flow — particle network behind the home hero. Runs only while the
// hero is on screen; static single frame under prefers-reduced-motion.
(function(){
  const canvas=document.getElementById('af');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch=matchMedia('(hover: none)').matches;
  const mouse={x:null,y:null,radius:200};
  let particles=[],rafId=null,W=0,H=0;

  class Particle{
    constructor(x,y,dx,dy,size){this.x=x;this.y=y;this.dx=dx;this.dy=dy;this.size=size}
    draw(){ctx.beginPath();ctx.arc(this.x,this.y,this.size,0,Math.PI*2);ctx.fillStyle='rgba(45,212,191,.6)';ctx.fill()}
    update(){
      if(this.x>W||this.x<0)this.dx=-this.dx;
      if(this.y>H||this.y<0)this.dy=-this.dy;
      if(mouse.x!==null){
        const dx=mouse.x-this.x,dy=mouse.y-this.y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<mouse.radius+this.size&&d>0){
          const f=(mouse.radius-d)/mouse.radius;
          this.x-=dx/d*f*5;this.y-=dy/d*f*5;
        }
      }
      this.x+=this.dx;this.y+=this.dy;this.draw();
    }
  }

  function size(){
    const r=canvas.parentElement.getBoundingClientRect();
    const dpr=Math.min(window.devicePixelRatio||1,2);
    W=r.width;H=r.height;
    canvas.width=W*dpr;canvas.height=H*dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function init(){
    size();particles=[];
    const mobile=W<=768;
    const n=Math.min(Math.floor(W*H/(mobile?14000:9000)),mobile?40:90);
    for(let i=0;i<n;i++){
      particles.push(new Particle(Math.random()*W,Math.random()*H,Math.random()*.4-.2,Math.random()*.4-.2,Math.random()*2+1));
    }
  }
  function connect(){
    const max=(W/7)*(H/7);
    for(let a=0;a<particles.length;a++){
      for(let b=a;b<particles.length;b++){
        const dx=particles[a].x-particles[b].x,dy=particles[a].y-particles[b].y;
        const d2=dx*dx+dy*dy;
        if(d2<max){
          const o=(1-d2/20000)*.35;
          if(o<=0)continue;
          let near=false;
          if(mouse.x!==null){
            const mx=particles[a].x-mouse.x,my=particles[a].y-mouse.y;
            near=Math.sqrt(mx*mx+my*my)<mouse.radius;
          }
          ctx.strokeStyle=near?'rgba(94,234,212,'+Math.min(o*2,.8)+')':'rgba(45,212,191,'+o+')';
          ctx.lineWidth=1;
          ctx.beginPath();ctx.moveTo(particles[a].x,particles[a].y);ctx.lineTo(particles[b].x,particles[b].y);ctx.stroke();
        }
      }
    }
  }
  function frame(){
    ctx.clearRect(0,0,W,H);
    for(const p of particles)p.update();
    connect();
  }
  function loop(){rafId=requestAnimationFrame(loop);frame()}
  function stop(){if(rafId!==null){cancelAnimationFrame(rafId);rafId=null}}

  if(!touch&&!reduce){
    window.addEventListener('mousemove',function(e){
      const r=canvas.getBoundingClientRect();
      mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;
    },{passive:true});
    window.addEventListener('mouseout',function(){mouse.x=null;mouse.y=null});
  }
  window.addEventListener('resize',function(){if(rafId!==null||reduce)init()},{passive:true});

  new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){init();if(reduce){frame()}else if(rafId===null){loop()}}
      else stop();
    });
  }).observe(canvas.closest('.hero-c'));
})();
document.getElementById("yr").textContent=new Date().getFullYear();

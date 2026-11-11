// A one-shot illustration, kept separate from the existing delivery scenes.
(function(){
  const root=document.querySelector('[data-sn-platform]');
  if(!root)return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const page=root.closest('.pg');
  const toggle=root.querySelector('[data-sn-toggle]');
  const replay=root.querySelector('[data-sn-replay]');
  const sources=[...root.querySelectorAll('.sn-platform-source')];
  const rows=[...root.querySelectorAll('.sn-platform-row')];
  const leadership=root.querySelector('.sn-platform-leadership');
  const duration=8200;
  let elapsed=reduce.matches?duration:0,visible=false,paused=false,last=null,frame=null;
  const clamp=n=>Math.max(0,Math.min(1,n));
  const translate=s=>(window.t||(value=>value))(s);
  const setData=(key,value)=>{if(root.dataset[key]!==String(value))root.dataset[key]=value};

  function eligible(){
    return visible&&!paused&&!reduce.matches&&!document.hidden&&elapsed<duration&&(!page||page.classList.contains('act'));
  }
  function draw(){
    const time=reduce.matches?duration:elapsed;
    setData('snElapsed',Math.round(time));
    setData('snPhase',time>=duration?'complete':time>=7300?'leadership':time>=3200?'outcomes':'sources');
    sources.forEach((source,i)=>{
      const progress=clamp((time-400-i*450)/650);
      source.classList.toggle('is-joined',progress===1);
      source.querySelector('.sn-source-solid').style.strokeDashoffset=100*(1-progress);
      const signal=source.querySelector('.sn-source-signal');
      signal.setAttribute('cx',72*progress);
      signal.style.opacity=progress>0&&progress<1?1:0;
    });
    rows.forEach((row,i)=>{
      const markers=[...row.querySelectorAll('.sn-platform-marker')];
      const segments=root.querySelectorAll('[data-row-links="'+i+'"] .sn-platform-segment');
      markers.forEach((marker,column)=>{
        const progress=clamp((time-3200-i*900-column*650)/650);
        marker.classList.toggle('is-complete',progress===1);
        segments[column].style.strokeDashoffset=100*(1-progress);
      });
    });
    leadership.style.opacity=clamp((time-7300)/800);
    const settled=time>=duration;
    const label=reduce.matches||settled?'Static illustration':paused?'Resume animation':'Pause animation';
    const state=reduce.matches?'static':settled?'complete':paused?'paused':eligible()?'running':'waiting';
    setData('snState',state);
    toggle.disabled=reduce.matches||settled;
    const pressed=String(paused&&!settled&&!reduce.matches);
    if(toggle.getAttribute('aria-pressed')!==pressed)toggle.setAttribute('aria-pressed',pressed);
    const translated=translate(label);
    if(toggle.getAttribute('aria-label')!==translated)toggle.setAttribute('aria-label',translated);
    const caption=toggle.querySelector('.scene-control-label');
    if(caption.textContent!==translated)caption.textContent=translated;
    const icon=toggle.querySelector('.scene-control-icon');
    const symbol=reduce.matches||settled?'✓':paused?'▶':'Ⅱ';
    if(icon.textContent!==symbol)icon.textContent=symbol;
    replay.disabled=reduce.matches;
    const replayLabel=translate('Replay animation');
    if(replay.getAttribute('aria-label')!==replayLabel)replay.setAttribute('aria-label',replayLabel);
  }
  function tick(now){
    frame=null;
    if(reduce.matches){sync();return}
    if(eligible()){
      if(last!==null)elapsed=Math.min(duration,elapsed+now-last);
      last=now;
      draw();
    }else last=null;
    if(eligible())frame=requestAnimationFrame(tick);
  }
  function sync(){
    if(reduce.matches){elapsed=duration;paused=false}
    if(!eligible()){
      last=null;
      if(frame!==null){cancelAnimationFrame(frame);frame=null}
    }
    draw();
    if(frame===null&&eligible())frame=requestAnimationFrame(tick);
  }
  toggle.addEventListener('click',()=>{
    if(toggle.disabled)return;
    paused=!paused;last=null;sync();
  });
  replay.addEventListener('click',()=>{
    if(reduce.matches)return;
    elapsed=0;paused=false;last=null;sync();
  });
  new IntersectionObserver(entries=>{
    visible=entries[0].isIntersecting&&entries[0].intersectionRatio>=.08;
    sync();
  },{threshold:.08}).observe(root);
  if(page)new MutationObserver(sync).observe(page,{attributes:true,attributeFilter:['class']});
  new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  document.addEventListener('visibilitychange',sync);
  reduce.addEventListener('change',sync);
  root.classList.add('is-enhanced');
  sync();
})();

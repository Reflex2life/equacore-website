// Connect the same operation on each pass; only the moving ink fades to restart.
(function(){
  const root=document.querySelector('[data-sn-platform]');
  if(!root)return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const page=root.closest('.pg');
  const sources=[...root.querySelectorAll('.sn-platform-source')];
  const rows=[...root.querySelectorAll('.sn-platform-row')];
  const leadership=root.querySelector('.sn-platform-leadership');
  const duration=8200,resetMs=600,cycleMs=duration+resetMs;
  let elapsed=0,visible=false,last=null,frame=null;
  const clamp=n=>Math.max(0,Math.min(1,n));
  const setData=(key,value)=>{if(root.dataset[key]!==String(value))root.dataset[key]=value};

  function eligible(){
    return visible&&!reduce.matches&&!document.hidden&&(!page||page.classList.contains('act'));
  }
  function draw(){
    const time=reduce.matches?duration:elapsed%cycleMs;
    const fade=reduce.matches?1:1-clamp((time-duration)/resetMs);
    setData('snCycle',reduce.matches?0:Math.floor(elapsed/cycleMs));
    setData('snElapsed',Math.round(time));
    setData('snPhase',reduce.matches?'complete':time>=duration?'restart':time>=7300?'leadership':time>=3200?'outcomes':'sources');
    sources.forEach((source,i)=>{
      const progress=clamp((time-400-i*450)/650);
      source.classList.toggle('is-joined',progress===1);
      const solid=source.querySelector('.sn-source-solid');
      solid.style.strokeDashoffset=100*(1-progress);
      solid.style.opacity=fade;
      const signal=source.querySelector('.sn-source-signal');
      signal.setAttribute('cx',72*progress);
      signal.style.opacity=progress>0&&progress<1?1:0;
    });
    rows.forEach((row,i)=>{
      const markers=[...row.querySelectorAll('.sn-platform-marker')];
      const segments=root.querySelectorAll('[data-row-links="'+i+'"] .sn-platform-segment');
      markers.forEach((marker,column)=>{
        const progress=clamp((time-3200-i*900-column*650)/650);
        marker.classList.toggle('is-complete',progress===1&&(time<duration||reduce.matches));
        segments[column].style.strokeDashoffset=100*(1-progress);
        segments[column].style.opacity=fade;
      });
    });
    leadership.style.opacity=clamp((time-7300)/800)*fade;
    setData('snState',reduce.matches?'static':eligible()?'running':'waiting');
  }
  function tick(now){
    frame=null;
    if(reduce.matches){sync();return}
    if(eligible()){
      if(last!==null)elapsed+=now-last;
      last=now;
      draw();
    }else last=null;
    if(eligible())frame=requestAnimationFrame(tick);
  }
  function sync(){
    if(!eligible()){
      last=null;
      if(frame!==null){cancelAnimationFrame(frame);frame=null}
    }
    draw();
    if(frame===null&&eligible())frame=requestAnimationFrame(tick);
  }
  new IntersectionObserver(entries=>{
    visible=entries[0].isIntersecting&&entries[0].intersectionRatio>=.08;
    sync();
  },{threshold:.08}).observe(root);
  if(page)new MutationObserver(sync).observe(page,{attributes:true,attributeFilter:['class']});
  document.addEventListener('visibilitychange',sync);
  reduce.addEventListener('change',sync);
  root.classList.add('is-enhanced');
  sync();
})();

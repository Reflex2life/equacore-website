// These two labelled journeys settle completely for eight seconds between passes.
(function(){
  const roots=[...document.querySelectorAll('[data-labelled-journey]')];
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const scenes=roots.map(root=>({root,visible:false,elapsed:0,last:null,
    stages:[...root.querySelectorAll('.labelled-stage')],
    pills:[...root.querySelectorAll('.eng32-journey-strip span')],
    dots:[...root.querySelectorAll('.journey-dot')],
    status:root.querySelector('.journey-status'),
    pulse:root.querySelector('.process-route-highlight'),
    input:root.querySelector('.journey-input-pulse')}));
  scenes.forEach(s=>{
    s.routeLength=s.pulse.getTotalLength();
    // Distances follow the node positions on each drawn route, then its return leg.
    s.routeStops=s.dots.length?[0,264,468,672,936,s.routeLength]:[0,158,316,474,s.routeLength];
  });
  let frame=null;
  function eligible(s){return s.visible&&!reduce.matches&&!document.hidden&&s.root.closest('.pg').classList.contains('act')}
  function draw(s){
    const activeMs=s.stages.length*3000,cycleMs=activeMs+8000;
    const time=reduce.matches?activeMs:s.elapsed%cycleMs;
    const complete=reduce.matches||time>=activeMs;
    const stage=Math.min(s.stages.length-1,Math.floor(time/3000));
    s.root.dataset.sceneCycle=reduce.matches?0:Math.floor(s.elapsed/cycleMs);
    s.root.dataset.sceneElapsed=Math.round(time);
    s.root.dataset.scenePhase=reduce.matches?'complete':complete?'hold':'active';
    s.root.dataset.activeStage=stage+1;
    s.stages.forEach((node,i)=>{
      node.classList.toggle('is-current',!complete&&i===stage);
      node.classList.toggle('is-complete',complete||i<stage);
    });
    s.pills.forEach((pill,i)=>{
      pill.classList.toggle('is-current',i===stage);
      pill.classList.toggle('is-complete',complete||i<stage);
    });
    const step=Math.min(2,Math.floor(time/(activeMs/3)));
    const statuses=s.dots.length?['Draft','Human review','Approved']:['Live service','Handover pack','Run & improve'];
    const status=t(statuses[step]);
    if(s.status.textContent!==status)s.status.textContent=status;
    s.dots.forEach((dot,i)=>dot.classList.toggle('is-complete',complete||i<=step));
    const distance=s.routeStops[stage]+(s.routeStops[stage+1]-s.routeStops[stage])*(time%3000)/3000;
    s.pulse.style.strokeDashoffset=complete?'0':String(-1000*distance/s.routeLength);
    s.pulse.style.opacity=complete?'0':'.9';
    s.input.style.strokeDashoffset=complete?'0':String(-100*(time%3000)/3000);
    s.input.style.opacity=complete?'0':String(Math.min(1,(time%3000)/300,(3000-time%3000)/300));
  }
  function tick(now){
    frame=null;
    // A live preference change must settle even if it arrives before this frame.
    if(reduce.matches){sync();return}
    scenes.forEach(s=>{
      if(eligible(s)){
        if(s.last!==null)s.elapsed+=now-s.last;
        s.last=now;draw(s);
      }else s.last=null;
    });
    if(scenes.some(eligible))frame=requestAnimationFrame(tick);
  }
  function sync(){
    scenes.forEach(s=>{if(!eligible(s))s.last=null;draw(s)});
    if(frame!==null&&!scenes.some(eligible)){cancelAnimationFrame(frame);frame=null}
    if(frame===null&&scenes.some(eligible))frame=requestAnimationFrame(tick);
  }
  const io=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{scenes.find(s=>s.root===entry.target).visible=entry.isIntersecting&&entry.intersectionRatio>=.08});sync();
  },{threshold:.08});
  scenes.forEach(s=>io.observe(s.root));
  const legacySync=journeyReplaySync;
  journeyReplaySync=function(){legacySync();sync()};
  const deliverySync=window.deliverySceneSync;
  window.deliverySceneSync=function(){if(deliverySync)deliverySync();sync()};
  document.addEventListener('visibilitychange',sync);
  reduce.addEventListener('change',sync);
  sync();
})();

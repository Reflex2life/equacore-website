// Homepage operations cycle: four readable stages, then a settled eight-second hold.
(function(){
  const root=document.querySelector('[data-sn-operations]');
  if(!root)return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const modules=[['AI','Now Assist'],['ITSM',''],['CMDB',''],['ITOM',''],['CSM',''],['Asset','ITAM'],['HR','HRSD']];
  const statuses=[['Review','signals'],['Coordinate','work'],['Review','findings'],['Feed','next pass']];
  const nodes=[...root.querySelectorAll('.sn-module-node')];
  const pills=[...root.querySelectorAll('.eng32-journey-strip span')];
  const pulse=root.querySelector('.process-route-highlight');
  const progress=root.querySelector('.sn-work-progress');
  const statusAction=root.querySelector('.sn-status-action');
  const statusDetail=root.querySelector('.sn-status-detail');
  const outcome=root.querySelector('.sn-outcome');
  let elapsed=0,last=null,visible=false,frame=null;
  function text(node,value){if(node.textContent!==value)node.textContent=value}
  function draw(){
    const activeMs=16000,cycleMs=24000;
    const time=reduce.matches?activeMs:elapsed%cycleMs;
    const complete=reduce.matches||time>=activeMs;
    const stage=Math.min(3,Math.floor(time/4000));
    root.dataset.sceneCycle=reduce.matches?0:Math.floor(elapsed/cycleMs);
    root.dataset.sceneElapsed=Math.round(time);
    root.dataset.scenePhase=reduce.matches?'complete':complete?'hold':'active';
    root.dataset.activeStage=stage+1;
    nodes.forEach((node,i)=>{
      // Sliding windows expose all seven capabilities across one active pass.
      const pair=reduce.matches?[['AI','Now Assist'],['ITSM','ITOM'],['CMDB',t('Asset')+' (ITAM)'],['CSM','HR (HRSD)']][i]:modules[(i+stage)%modules.length];
      text(node.querySelector('.sn-module-label'),t(pair[0]));
      text(node.querySelector('.sn-module-detail'),pair[1]);
      node.classList.toggle('is-current',!complete&&i===stage);
      node.classList.toggle('is-complete',complete||i<stage);
    });
    text(statusAction,t(statuses[stage][0]));
    text(statusDetail,t(statuses[stage][1]));
    // Four short pulses trace the ring; every moving value settles for the hold.
    pulse.style.strokeDashoffset=complete?'0':String(-1000*(time%4000)/4000);
    pulse.style.opacity=complete?'0':String(Math.min(1,(time%4000)/250,(4000-time%4000)/250)*.9);
    progress.style.strokeDashoffset=String(100*(1-Math.min(time/activeMs,1)));
    outcome.classList.toggle('is-complete',stage===3);
    pills.forEach((pill,i)=>{
      pill.classList.toggle('is-current',i===stage);
      pill.classList.toggle('is-complete',complete||i<stage);
    });
  }
  function eligible(){return visible&&!reduce.matches&&!document.hidden&&root.closest('.pg').classList.contains('act')}
  function tick(now){
    frame=null;
    if(reduce.matches){sync();return}
    if(eligible()){
      if(last!==null)elapsed+=now-last;
      last=now;draw();frame=requestAnimationFrame(tick);
    }else last=null;
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
    visible=entries[0].isIntersecting&&entries[0].intersectionRatio>=.08;sync();
  },{threshold:.08}).observe(root);
  const legacySync=journeyReplaySync;
  journeyReplaySync=function(){legacySync();sync()};
  const deliverySync=window.deliverySceneSync;
  window.deliverySceneSync=function(){if(deliverySync)deliverySync();sync()};
  document.addEventListener('visibilitychange',sync);
  reduce.addEventListener('change',sync);
  sync();
})();

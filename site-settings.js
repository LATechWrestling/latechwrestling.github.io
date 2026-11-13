// Applies settings published by the private editor to every public page.
(async function(){
  const gear=document.getElementById('buy-team-gear');
  if(!gear)return;
  try{const r=await fetch('content.json',{cache:'no-store'});if(!r.ok)return;const settings=await r.json();if(settings.gearEnabled===false){gear.remove();return;}if(settings.gearUrl)gear.href=settings.gearUrl;if(settings.gearLabel)gear.textContent=settings.gearLabel;}catch(e){}
})();

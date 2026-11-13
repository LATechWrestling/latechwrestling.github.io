(async function(){
  const footer=document.querySelector('footer');
  if(!footer)return;
  const indicator=document.createElement('p');
  indicator.className='site-updated';
  indicator.textContent='Last updated: unavailable';
  footer.appendChild(indicator);
  try{
    const script=document.currentScript;
    const dataUrl=new URL('site-updated.json',script.src);
    const response=await fetch(dataUrl,{cache:'no-store'});
    const data=await response.json();
    const date=new Date(data.updatedAt);
    if(Number.isNaN(date.getTime()))return;
    indicator.textContent='Last updated: '+new Intl.DateTimeFormat(undefined,{year:'numeric',month:'long',day:'numeric',hour:'numeric',minute:'2-digit'}).format(date);
  }catch(error){console.warn('Last-updated timestamp could not be loaded.',error);}
})();

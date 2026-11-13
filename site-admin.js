// The private editor is revealed by clicking the site logo five times quickly.
// It is intentionally not displayed in the normal public navigation.
(function(){
  const logo=document.querySelector('.logo-link');
  const link=document.querySelector('.hidden-admin-link');
  if(!logo||!link)return;
  let clicks=0,timer;
  logo.addEventListener('click',function(event){
    // On the home page the logo already points to the current page. Preventing
    // the no-op navigation lets the click counter survive long enough to work.
    if(location.pathname.endsWith('/index.html') || location.pathname.endsWith('/')) event.preventDefault();
    clicks++;clearTimeout(timer);timer=setTimeout(()=>clicks=0,2500);
    if(clicks>=5){link.classList.remove('hidden-admin-link');link.textContent='Private Editor';link.focus();clicks=0;}
  });
})();

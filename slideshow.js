// slideshow.js - simple slideshow that uses embedded JSON and optional news.json
(async function(){
  const wrapper = document.querySelector('#news-slideshow .slides-wrapper');
  const indicatorsEl = document.querySelector('#news-slideshow .indicators');
  const prevBtn = document.querySelector('#news-slideshow .prev');
  const nextBtn = document.querySelector('#news-slideshow .next');
  const embedded = document.getElementById('embedded-news');

  let slides = [];
  try{
    slides = JSON.parse(embedded.textContent || '[]');
  }catch(e){ console.error('Invalid embedded news JSON', e); }

  // try to load local news.json (optional)
  try{
    const res = await fetch('news.json');
    if(res.ok){
      const local = await res.json();
      if(Array.isArray(local)) slides = local.concat(slides);
    }
  }catch(e){ /* ignore if not present */ }

  if(!slides.length){
    wrapper.innerHTML = '<p>No news available.</p>';
    return;
  }

  let idx = 0;
  function render(){
    wrapper.innerHTML = '';
    indicatorsEl.innerHTML = '';
    slides.forEach((s,i)=>{
      const a = document.createElement('a');
      a.href = s.link || '#';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'news-slide' + (i===idx? ' active':'');

      const img = document.createElement('img');
      img.src = s.image || 'images/RaymondFavaza.jpg';
      img.alt = s.title || 'News';
      a.appendChild(img);

      const cap = document.createElement('div');
      cap.className = 'news-caption';
      const h4 = document.createElement('h4');
      h4.textContent = s.title || '';
      cap.appendChild(h4);
      a.appendChild(cap);

      wrapper.appendChild(a);

      const dot = document.createElement('button');
      dot.className = 'indicator' + (i===idx? ' active':'');
      dot.setAttribute('aria-label', 'Go to slide ' + (i+1));
      dot.addEventListener('click', ()=>{ idx = i; update(); });
      indicatorsEl.appendChild(dot);
    });
  }

  function update(){
    const slidesEls = wrapper.querySelectorAll('.news-slide');
    slidesEls.forEach((el,i)=> el.classList.toggle('active', i===idx));
    const dots = indicatorsEl.querySelectorAll('.indicator');
    dots.forEach((d,i)=> d.classList.toggle('active', i===idx));
  }

  function next(){ idx = (idx+1) % slides.length; update(); }
  function prev(){ idx = (idx-1 + slides.length) % slides.length; update(); }

  nextBtn.addEventListener('click', (e)=>{ e.preventDefault(); next(); });
  prevBtn.addEventListener('click', (e)=>{ e.preventDefault(); prev(); });

  // autoplay
  let autoplay = setInterval(()=> next(), 6000);
  // pause on hover
  wrapper.addEventListener('mouseenter', ()=> clearInterval(autoplay));
  wrapper.addEventListener('mouseleave', ()=> autoplay = setInterval(()=> next(), 6000));

  render();
})();

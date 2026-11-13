// Render all roster data, including coaches, from roster.json.
(async function(){
  const main=document.querySelector('main');
  if(!main)return;
  main.classList.add('data-loading');
  main.innerHTML='<p class="roster-loading">Loading roster…</p>';
  document.querySelector('.coaches')?.remove();
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  try{
    const response=await fetch('roster.json',{cache:'no-store'});
    const people=await response.json();
    if(!Array.isArray(people))return;
    const card=p=>`<article class="athlete-card${p.role?' coach-card':''}" data-name="${esc(p.name)}"><img src="${esc(p.photo||'images/logo.png')}" alt="${esc(p.name)}" class="athlete-photo"><div class="athlete-left">${p.weight?`<div class="weight-pill">${esc(p.weight)} lbs</div>`:''}<h3 class="athlete-name"><a href="${esc(p.bio||'#')}">${esc(p.name)}</a></h3></div><div class="athlete-info"><div class="athlete-right"><div class="athlete-meta">${esc(p.role||p.classYear)}</div><div class="athlete-school">${esc(p.school)}</div><div class="athlete-hometown">${esc(p.hometown)}</div>${p.bio?`<a class="bio-link" href="${esc(p.bio)}">Full Bio</a>`:''}</div></div></article>`;
    main.innerHTML=`<h2>Men's Team</h2><div class="roster-controls"><label for="roster-search" class="visually-hidden">Search roster</label><input id="roster-search" type="search" placeholder="Search by name, school, hometown..." aria-label="Search roster"><label for="roster-sort">Sort by</label><select id="roster-sort" aria-label="Sort roster"><option value="name">Name (A-Z)</option><option value="class">Class</option><option value="hometown">Hometown</option><option value="weight">Weight</option></select></div><div id="roster-results"></div>`;
    const coaches=document.querySelector('.coaches');
    if(coaches)coaches.remove();
    const render=()=>{
      const q=(document.getElementById('roster-search').value||'').toLowerCase();
      const sort=document.getElementById('roster-sort').value;
      const order={Freshman:1,Sophomore:2,Junior:3,Senior:4,Graduate:5};
      const filtered=people.filter(p=>[p.name,p.school,p.hometown,p.role].join(' ').toLowerCase().includes(q));
      filtered.sort((a,b)=>sort==='name'?a.name.localeCompare(b.name):sort==='class'?(order[a.classYear]||0)-(order[b.classYear]||0):sort==='weight'?(+a.weight||0)-(+b.weight||0):(a.hometown||'').localeCompare(b.hometown||''));
      const men=filtered.filter(p=>!p.role), staff=filtered.filter(p=>p.role);
      document.getElementById('roster-results').innerHTML=men.map(card).join('')+(staff.length?`<section class="coaches roster-grid" aria-label="Coaches"><h2>Coaches</h2>${staff.map(card).join('')}</section>`:'');
    };
    document.getElementById('roster-search').addEventListener('input',render);
    document.getElementById('roster-sort').addEventListener('change',render);
    main.classList.remove('data-loading');
    render();
  }catch(error){console.warn('Roster data could not be loaded.',error);main.innerHTML='<p class="roster-loading">Roster data could not be loaded.</p>';main.classList.remove('data-loading');}
})();

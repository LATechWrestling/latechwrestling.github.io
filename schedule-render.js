// Render schedule data as complete rows. This keeps logos and results in the same
// markup as the event text instead of relying on a second post-render pass.
(async function(){
  const body=document.querySelector('#schedule-table tbody');
  if(!body)return;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  try{
    const response=await fetch('schedule.json',{cache:'no-store'});
    const rows=await response.json();
    if(!Array.isArray(rows))return;
    body.innerHTML=rows.map(e=>{
      const away=/away|at|,\s*[A-Z]{2}/i.test(e.location||'')&&!/home/i.test(e.location||'');
      const tournament=/tournament|classic|championship|invite/i.test(e.opponent||'');
      const logo=e.logo||'images/logo.png';
      return `<tr class="event-row has-logo-rendered" data-logo="${esc(logo)}" data-type="${tournament?'Tournament':'dual'}" isConference="${/conference|ncwa/i.test(e.opponent||'')}"><td class="event-cell"><div class="logo-slot"><img class="opponent-logo" src="${esc(logo)}" alt="${esc(e.opponent||'Opponent')} logo"></div><div class="event-left with-logo"><div class="event-text"><div class="event-meta">${esc(e.date)} · ${esc(e.time||'TBD')}</div><div class="event-title">${away?'<span class="away-pill">at</span>':''}${esc(e.opponent)}</div></div></div><div class="event-right">${e.result?`<div class="event-result" data-has-result="true"><span class="result-text">${esc(e.result)}</span></div>`:''}</div><div class="event-location">${esc(e.location||'TBD')}</div></td></tr>`;
    }).join('');
    document.dispatchEvent(new CustomEvent('schedule:updated'));
  }catch(error){console.warn('Schedule data could not be loaded.',error);}
})();

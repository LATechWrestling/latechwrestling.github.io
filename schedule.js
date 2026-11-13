// Render the public schedule from schedule.json so the editor only needs to maintain one file.
(async function(){
  const body=document.querySelector('#schedule-table tbody'); if(!body)return;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  try{
    const r=await fetch('schedule.json',{cache:'no-store'}); const rows=await r.json();
    if(!Array.isArray(rows))return;
    body.innerHTML=rows.map(e=>{
      const away=/away|at|,\s*[A-Z]{2}/i.test(e.location||'')&&!/home/i.test(e.location||'');
      const tournament=/tournament|classic|championship|invite/i.test(e.opponent||'');
      return `<tr class="event-row" data-logo="${esc(e.logo||'images/logo.png')}" data-type="${tournament?'Tournament':'dual'}" isConference="${/conference|ncwa/i.test(e.opponent||'')}"><td class="event-cell"><div class="event-left"><div class="event-meta">${esc(e.date)} · ${esc(e.time||'TBD')}</div><div class="event-title">${away?'<span class="away-pill">at</span>':''}${esc(e.opponent)}</div><div class="event-result" data-has-result="${e.result?'true':'false'}"><span class="result-text">${esc(e.result||'')}</span></div></div><div class="event-location">${esc(e.location||'TBD')}</div></td></tr>`;
    }).join('');
    document.dispatchEvent(new CustomEvent('schedule:updated'));
  }catch(e){console.warn('Schedule data could not be loaded.',e);}
})();

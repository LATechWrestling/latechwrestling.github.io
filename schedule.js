// schedule.js - read-only renderer; prefer project `schedule.json` then fall back to embedded JSON
(async function(){
  const tableBody = document.querySelector('#schedule-table tbody');

  // default/sample data (developer can edit embedded JSON in schedule.html)
  const sample = [
    { date: '2025-11-01', time: '7:00 PM', opponent: 'University X', location: 'Away', result: 'L 10-20', note: 'Exhibition' },
    { date: '2025-11-08', time: '6:00 PM', opponent: 'State College', location: 'Home', result: '', note: '' }
  ];

  function render(rows){
    tableBody.innerHTML = '';
    rows.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHtml(r.date || '')}</td>
        <td>${escapeHtml(r.time || '')}</td>
        <td>${escapeHtml(r.opponent || '')}</td>
        <td>${escapeHtml(r.location || '')}</td>
        <td>${escapeHtml(r.result || '')}</td>
        <td>${escapeHtml(r.note || '')}</td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // helper to escape HTML when inserting into the read-only table
  function escapeHtml(s){ return String(s).replace(/[&\"'<>]/g, c=>({ '&':'&amp;','\"':'&quot;',"'":'&#39;','<':'&lt;','>':'&gt;' }[c])); }

  // try to fetch `schedule.json` from the site root (developer can maintain this file), then fall back
  async function loadSchedule(){
    // 1) try external file
    try{
      const resp = await fetch('schedule.json', { cache: 'no-store' });
      if(resp && resp.ok){
        const data = await resp.json();
        if(Array.isArray(data) && data.length){ render(data); return; }
      }
    }catch(err){
      // fetch can fail when opening files over file:// or if the file doesn't exist — ignore and try embedded
    }

    // 2) fall back to embedded JSON inside schedule.html
    try{
      const embedded = document.getElementById('embedded-schedule');
      if(embedded){
        const data = JSON.parse(embedded.textContent || '[]');
        if(Array.isArray(data) && data.length){ render(data); return; }
      }
    }catch(e){ /* invalid embedded JSON */ }

    // 3) final fallback: sample
    render(sample);
  }

  // kick off
  loadSchedule();
})();

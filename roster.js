// roster.js - simple search and sort for the roster grid
(function(){
  const searchInput = document.getElementById('roster-search');
  const sortSelect = document.getElementById('roster-sort');
  // Find the roster grid that contains the controls (this is the athlete grid)
  const allGrids = Array.from(document.querySelectorAll('.roster-grid'));
  let grid = allGrids.find(g => g.querySelector('.roster-controls')) || allGrids[0];
  // Only manage athlete cards inside the chosen grid (so coaches in a separate grid are not affected)
  const cards = Array.from(grid.querySelectorAll('.athlete-card'));

  // class order mapping for sorting
  const classOrder = { 'Freshman': 1, 'Sophomore': 2, 'Junior': 3, 'Senior': 4 };

  function normalize(str){
    return (str || '').toString().trim().toLowerCase();
  }

  function matchesQuery(card, q){
    if(!q) return true;
    q = q.toLowerCase();
    const name = card.dataset.name || '';
    const hometown = card.dataset.hometown || '';
    const school = card.querySelector('.athlete-school')?.textContent || '';
    return name.toLowerCase().includes(q) || hometown.toLowerCase().includes(q) || school.toLowerCase().includes(q);
  }

  function filterAndRender(){
    const q = searchInput.value.trim().toLowerCase();
    const visible = cards.filter(c => matchesQuery(c, q));

    // sort by current option
    const sortBy = sortSelect.value;
    const sorted = visible.slice().sort((a,b) => compareCards(a,b,sortBy));

    // remove all cards and re-append sorted visible cards
    // keep those hidden (non-matching) removed from DOM to hide
    cards.forEach(c => c.remove());
    sorted.forEach(c => grid.appendChild(c));
  }

  function compareCards(a,b,sortBy){
    if(sortBy === 'name'){
      return normalize(a.dataset.name).localeCompare(normalize(b.dataset.name));
    }
    if(sortBy === 'class'){
      const ca = classOrder[a.dataset.class] || 0;
      const cb = classOrder[b.dataset.class] || 0;
      return ca - cb;
    }
    if(sortBy === 'hometown'){
      return normalize(a.dataset.hometown).localeCompare(normalize(b.dataset.hometown));
    }
    if(sortBy === 'weight'){
      const wa = parseInt(a.dataset.weight) || 0;
      const wb = parseInt(b.dataset.weight) || 0;
      return wa - wb;
    }
    return 0;
  }

  // debounce helper
  function debounce(fn, wait){
    let t;
    return function(...args){
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this,args), wait);
    }
  }

  // Attach events
  if(searchInput){
    searchInput.addEventListener('input', debounce(filterAndRender, 180));
  }
  if(sortSelect){
    sortSelect.addEventListener('change', filterAndRender);
  }

  // populate weight-pill elements from data-weight (create if missing)
  function populateWeightPills(){
    cards.forEach(card => {
      try{
        const weight = card.dataset.weight;
        if(!weight) return;
        // find existing weight-pill in left area
        let pill = card.querySelector('.weight-pill');
        if(!pill){
          // create and insert into athlete-left if present, otherwise prepend to card
          pill = document.createElement('div');
          pill.className = 'weight-pill';
          const left = card.querySelector('.athlete-left');
          if(left) left.insertBefore(pill, left.firstChild);
          else card.insertBefore(pill, card.firstChild);
        }
        pill.textContent = weight + ' lbs';
      }catch(e){/* ignore per-card errors */}
    });
  }

  // Initial render to ensure order — populate weight pills first
  document.addEventListener('DOMContentLoaded', function(){
    populateWeightPills();
    filterAndRender();
  });
})();

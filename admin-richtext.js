(function(){
  const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const cleanFragment=value=>{
    const source=String(value||'');
    const doc=new DOMParser().parseFromString(source.includes('<html')?source:'<body>'+source+'</body>','text/html');
    const allowed=new Set(['P','BR','STRONG','B','EM','I','U','UL','OL','LI','H3','H4','A']);
    [...doc.body.querySelectorAll('*')].forEach(node=>{
      if(!allowed.has(node.tagName)){node.replaceWith(...node.childNodes);return;}
      [...node.attributes].forEach(attribute=>{if(node.tagName!=='A'||attribute.name!=='href')node.removeAttribute(attribute.name);});
      if(node.tagName==='A'&&!/^https?:\/\//i.test(node.getAttribute('href')||''))node.removeAttribute('href');
    });
    return doc.body.innerHTML;
  };
  const enhance=()=>document.querySelectorAll('#roster-list textarea[data-key="bioText"]').forEach(textarea=>{
    if(textarea.dataset.richtextReady)return;
    textarea.dataset.richtextReady='true';
    const wrap=document.createElement('div');
    wrap.className='bio-richtext-wrap';
    const toolbar=document.createElement('div');
    toolbar.className='bio-richtext-toolbar';
    [['bold','Bold'],['italic','Italic'],['underline','Underline']].forEach(([command,label])=>{
      const button=document.createElement('button');
      button.type='button'; button.textContent=label; button.title=label;
      button.onclick=()=>{document.execCommand(command,false); editor.focus(); sync();};
      toolbar.appendChild(button);
    });
    const editor=document.createElement('div');
    editor.className='bio-richtext-editor'; editor.contentEditable='true'; editor.setAttribute('role','textbox'); editor.setAttribute('aria-multiline','true');
    const value=textarea.value||'';
    editor.innerHTML=value.trim().startsWith('<')?cleanFragment(value):value.split(/\r?\n/).filter(Boolean).map(line=>`<p>${escapeHtml(line)}</p>`).join('');
    const sync=()=>{textarea.value=cleanFragment(editor.innerHTML);textarea.dispatchEvent(new Event('input',{bubbles:true}));};
    editor.addEventListener('input',sync);
    wrap.append(toolbar,editor); textarea.hidden=true; textarea.parentNode.insertBefore(wrap,textarea);
  });
  new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true});
  enhance();
})();

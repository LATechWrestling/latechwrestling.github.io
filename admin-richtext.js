(function(){
  const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const cleanFragment=value=>{
    const source=String(value||''),doc=new DOMParser().parseFromString(source.includes('<html')?source:'<body>'+source+'</body>','text/html');
    const allowed=new Set(['P','BR','STRONG','B','EM','I','U','S','STRIKE','UL','OL','LI','H3','H4','BLOCKQUOTE','A']);
    [...doc.body.querySelectorAll('*')].forEach(node=>{
      if(!allowed.has(node.tagName)){node.replaceWith(...node.childNodes);return;}
      [...node.attributes].forEach(attribute=>{if(node.tagName!=='A'||attribute.name!=='href')node.removeAttribute(attribute.name);});
      if(node.tagName==='A'&&!/^https?:\/\//i.test(node.getAttribute('href')||''))node.removeAttribute('href');
    });
    return doc.body.innerHTML;
  };
  const command=(editor,sync,name,value=null)=>{editor.focus();document.execCommand(name,false,value);sync();};
  const enhance=()=>document.querySelectorAll('#roster-list textarea[data-key="bioText"]').forEach(textarea=>{
    if(textarea.dataset.richtextReady)return;
    textarea.dataset.richtextReady='true';
    const wrap=document.createElement('div'),toolbar=document.createElement('div'),editor=document.createElement('div');
    wrap.className='bio-richtext-wrap'; toolbar.className='bio-richtext-toolbar';
    const sync=()=>{textarea.value=cleanFragment(editor.innerHTML);textarea.dispatchEvent(new Event('input',{bubbles:true}));};
    const addButton=(label,title,name,value=null)=>{const button=document.createElement('button');button.type='button';button.textContent=label;button.title=title;button.setAttribute('aria-label',title);button.onclick=()=>command(editor,sync,name,value);toolbar.appendChild(button);};
    addButton('↶','Undo','undo'); addButton('↷','Redo','redo'); addButton('B','Bold','bold'); addButton('I','Italic','italic'); addButton('U','Underline','underline'); addButton('S','Strikethrough','strikeThrough');
    const format=document.createElement('select');format.title='Text style';format.setAttribute('aria-label','Text style');[['p','Paragraph'],['h3','Heading'],['blockquote','Quote']].forEach(([value,label])=>{const option=document.createElement('option');option.value=value;option.textContent=label;format.appendChild(option);});format.onchange=()=>command(editor,sync,'formatBlock',format.value);toolbar.appendChild(format);
    addButton('≡','Align left','justifyLeft'); addButton('≡','Center','justifyCenter'); addButton('≡','Align right','justifyRight'); addButton('• List','Bulleted list','insertUnorderedList'); addButton('1. List','Numbered list','insertOrderedList');
    const link=document.createElement('button');link.type='button';link.textContent='Link';link.title='Insert link';link.setAttribute('aria-label','Insert link');link.onclick=()=>{const url=prompt('Enter an https:// link');if(/^https:\/\//i.test(url||''))command(editor,sync,'createLink',url);};toolbar.appendChild(link); addButton('Clear','Clear formatting','removeFormat');
    editor.className='bio-richtext-editor';editor.contentEditable='true';editor.setAttribute('role','textbox');editor.setAttribute('aria-multiline','true');
    const value=textarea.value||'';editor.innerHTML=value.trim().startsWith('<')?cleanFragment(value):value.split(/\r?\n/).filter(Boolean).map(line=>`<p>${escapeHtml(line)}</p>`).join('');editor.addEventListener('input',sync);
    wrap.append(toolbar,editor);textarea.hidden=true;textarea.parentNode.insertBefore(wrap,textarea);
  });
  new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true}); enhance();
})();

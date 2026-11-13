(function(){
  const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const cleanFragment=value=>{
    const source=String(value||''),doc=new DOMParser().parseFromString(source.includes('<html')?source:'<body>'+source+'</body>','text/html');
    const allowed=new Set(['P','BR','STRONG','B','EM','I','U','S','STRIKE','SUP','UL','OL','LI','H3','H4','BLOCKQUOTE','A','FONT']);
    [...doc.body.querySelectorAll('*')].forEach(node=>{
      if(!allowed.has(node.tagName)){node.replaceWith(...node.childNodes);return;}
      [...node.attributes].forEach(attribute=>{const keep=(node.tagName==='A'&&attribute.name==='href')||(node.tagName==='FONT'&&['size','color'].includes(attribute.name));if(!keep)node.removeAttribute(attribute.name);});
      if(node.tagName==='A'&&!/^https?:\/\//i.test(node.getAttribute('href')||''))node.removeAttribute('href');
    });
    return doc.body.innerHTML;
  };
  const enhance=()=>document.querySelectorAll('#roster-list textarea[data-key="bioText"]').forEach(textarea=>{
    if(textarea.dataset.richtextReady)return;
    textarea.dataset.richtextReady='true';
    const wrap=document.createElement('div'),toolbar=document.createElement('div'),editor=document.createElement('div');
    wrap.className='bio-richtext-wrap';toolbar.className='bio-richtext-toolbar';
    const sync=()=>{textarea.value=cleanFragment(editor.innerHTML);textarea.dispatchEvent(new Event('input',{bubbles:true}));};
    const command=(name,value=null)=>{editor.focus();if(editor._savedRange){const selection=getSelection();selection.removeAllRanges();selection.addRange(editor._savedRange);}document.execCommand(name,false,value);sync();};
    const addButton=(label,title,name,value=null,parent=toolbar)=>{const button=document.createElement('button');button.type='button';button.className='bio-tool-button';button.textContent=label;button.title=title;button.setAttribute('aria-label',title);button.onmousedown=event=>event.preventDefault();button.onclick=()=>command(name,value);parent.appendChild(button);};
    const addSelect=(options,title,parent=toolbar)=>{const select=document.createElement('select');select.className='bio-tool-select';select.title=title;select.setAttribute('aria-label',title);options.forEach(([value,label])=>{const option=document.createElement('option');option.value=value;option.textContent=label;select.appendChild(option);});select.onmousedown=event=>event.preventDefault();select.onchange=()=>command(select.dataset.command,select.value);parent.appendChild(select);return select;};
    addSelect([['3','12pt'],['4','14pt'],['5','18pt'],['6','24pt']], 'Font size', toolbar).dataset.command='fontSize';
    addSelect([['<p>','Paragraph'],['<h3>','Heading'],['<blockquote>','Quote']], 'Text style', toolbar).dataset.command='formatBlock';
    const divider=document.createElement('span');divider.className='bio-toolbar-divider';toolbar.appendChild(divider);
    addButton('B','Bold','bold');addButton('I','Italic','italic');addButton('U','Underline','underline');
    addButton('A̲','Text color','foreColor','#334155');addButton('▰','Highlight','hiliteColor','#fff3a3');addButton('T²','Superscript','superscript');
    const more=document.createElement('button');more.type='button';more.className='bio-tool-button bio-more-button';more.textContent='⋮';more.title='More formatting';more.setAttribute('aria-label','More formatting');more.onmousedown=event=>event.preventDefault();
    const extra=document.createElement('div');extra.className='bio-richtext-extra';more.onclick=()=>extra.classList.toggle('is-open');toolbar.append(more,extra);
    addButton('≡','Align left','justifyLeft',null,extra);addButton('≡','Center','justifyCenter',null,extra);addButton('≡','Align right','justifyRight',null,extra);addButton('• List','Bulleted list','insertUnorderedList',null,extra);addButton('1. List','Numbered list','insertOrderedList',null,extra);addButton('Link','Insert link','createLink',null,extra);addButton('Clear','Clear formatting','removeFormat',null,extra);
    extra.querySelector('[aria-label="Insert link"]').onclick=()=>{const url=prompt('Enter an https:// link');if(/^https:\/\//i.test(url||''))command('createLink',url);};
    editor.className='bio-richtext-editor';editor.contentEditable='true';editor.setAttribute('role','textbox');editor.setAttribute('aria-multiline','true');
    const value=textarea.value||'';editor.innerHTML=value.trim().startsWith('<')?cleanFragment(value):value.split(/\r?\n/).filter(Boolean).map(line=>`<p>${escapeHtml(line)}</p>`).join('');
    const saveSelection=()=>{const selection=getSelection();if(selection.rangeCount&&editor.contains(selection.anchorNode))editor._savedRange=selection.getRangeAt(0).cloneRange();};
    editor.addEventListener('input',sync);editor.addEventListener('mouseup',saveSelection);editor.addEventListener('keyup',saveSelection);editor.addEventListener('focus',saveSelection);
    wrap.append(toolbar,editor);textarea.hidden=true;textarea.parentNode.insertBefore(wrap,textarea);
  });
  new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true});enhance();
})();

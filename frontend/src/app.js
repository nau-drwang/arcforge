let localSeed = null;

async function loadLocalSeed(){
  if(localSeed) return localSeed;
  const r = await fetch('/data/artworks.json');
  if(!r.ok) throw new Error('Local artwork seed failed');
  localSeed = await r.json();
  return localSeed;
}

function isZh(){ return document.documentElement.lang && document.documentElement.lang.toLowerCase().startsWith('zh'); }
function t(en, zh){ return isZh() ? zh : en; }
function money(cents, currency='USD'){
  if(!cents) return t('Inquiry','询价');
  return new Intl.NumberFormat('en-US',{style:'currency',currency}).format((cents||0)/100);
}
function mediaUrl(key){
  if(!key) return '/assets/images/arcforge-hero.webp';
  if(String(key).startsWith('/')) return key;
  return `/media/${key}`;
}
async function loadProducts(){
  try{
    const r=await fetch('/api/products');
    if(!r.ok) throw new Error('API failed');
    const d=await r.json();
    if(d.products?.length && d.source !== 'sample') return d.products;
  }catch(e){}
  const seed = await loadLocalSeed();
  return seed.artworks || [];
}
function escapeHtml(value=''){
  return String(value).replace(/[&<>"]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]));
}
function galleryStrip(p){
  const images = Array.isArray(p.gallery) && p.gallery.length ? p.gallery.slice(0,4) : [p.cover_media_key];
  return `<div class="mini-gallery">${images.map((img, i)=>`<button class="mini-img" type="button" data-full="${escapeHtml(mediaUrl(img))}" data-caption="${escapeHtml(p.title)} view ${i+1}"><img src="${mediaUrl(img)}" alt="${escapeHtml(p.alt || p.title)} view ${i+1}" loading="lazy"></button>`).join('')}</div>`;
}
function card(p){
  const cover = mediaUrl(p.cover_media_key);
  const full = mediaUrl((Array.isArray(p.gallery) && p.gallery[0]) || p.cover_media_key);
  const displayTitle = isZh() && p.title_zh ? p.title_zh : p.title;
  const secondaryTitle = isZh() && p.title_zh ? p.title : p.title_zh;
  const category = isZh() ? (p.category_zh || p.category || '作品') : (p.category || 'Artwork');
  const description = isZh() ? (p.description_zh || p.description || '') : (p.description || '');
  const material = isZh() ? (p.material_zh || p.material || '手工上色树脂') : (p.material || 'Hand-painted resin');
  const availability = p.inventory>0 ? t('Available / Commission','可咨询 / 可定制') : t('Archive','档案');
  const inquiryUrl = `${isZh()?'/zh-checkout.html':'/checkout.html'}?artwork=${encodeURIComponent(p.id)}&title=${encodeURIComponent(displayTitle)}`;
  return `<article class="card artwork-card"><button class="product-img image-button" type="button" data-full="${escapeHtml(full)}" data-caption="${escapeHtml(displayTitle)}"><img src="${cover}" alt="${escapeHtml(p.alt || displayTitle)}" loading="lazy"></button><div class="card-body"><div class="title-row"><div><p class="category">${escapeHtml(category)}</p><h3>${escapeHtml(displayTitle)}</h3>${secondaryTitle?`<span class="zh-title">${escapeHtml(secondaryTitle)}</span>`:''}</div><span class="price">${money(p.price_cents,p.currency)}</span></div><p class="desc">${escapeHtml(description)}</p>${galleryStrip({...p,title:displayTitle})}<dl class="details"><div><dt>${t('Material','材质')}</dt><dd>${escapeHtml(material)}</dd></div><div><dt>${t('Availability','状态')}</dt><dd>${availability}</dd></div></dl><div class="card-actions"><span class="tag">${escapeHtml(p.slug || p.id)}</span><a class="btn primary" href="${inquiryUrl}">${t('Inquire','咨询')}</a></div></div></article>`;
}
function setupLightbox(){
  const box=document.querySelector('[data-lightbox]');
  if(!box) return;
  const img=box.querySelector('img');
  const caption=box.querySelector('[data-lightbox-caption]');
  const close=box.querySelector('.lightbox-close');
  function open(src, text){
    img.src=src;
    img.alt=text || 'ArcForge artwork image';
    caption.textContent=text || '';
    box.hidden=false;
    document.body.classList.add('modal-open');
  }
  function shut(){
    box.hidden=true;
    img.src='';
    document.body.classList.remove('modal-open');
  }
  document.addEventListener('click', e=>{
    const trigger=e.target.closest('[data-full]');
    if(trigger){
      e.preventDefault();
      open(trigger.dataset.full, trigger.dataset.caption);
    }
  });
  close?.addEventListener('click', shut);
  box.addEventListener('click', e=>{ if(e.target===box) shut(); });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape' && !box.hidden) shut(); });
}
(async()=>{
  setupLightbox();
  const grid=document.querySelector('[data-products]');
  if(grid){
    const products=await loadProducts();
    grid.innerHTML=products.map(card).join('');
  }
})();

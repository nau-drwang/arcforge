let localSeed = null;

async function loadLocalSeed(){
  if(localSeed) return localSeed;
  const r = await fetch('/data/artworks.json');
  if(!r.ok) throw new Error('Local artwork seed failed');
  localSeed = await r.json();
  return localSeed;
}

function money(cents, currency='USD'){
  if(!cents) return 'Inquiry';
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
  return `<article class="card artwork-card"><button class="product-img image-button" type="button" data-full="${escapeHtml(full)}" data-caption="${escapeHtml(p.title)}"><img src="${cover}" alt="${escapeHtml(p.alt || p.title)}" loading="lazy"></button><div class="card-body"><div class="title-row"><div><p class="category">${escapeHtml(p.category || 'Artwork')}</p><h3>${escapeHtml(p.title)}</h3>${p.title_zh?`<span class="zh-title">${escapeHtml(p.title_zh)}</span>`:''}</div><span class="price">${money(p.price_cents,p.currency)}</span></div><p class="desc">${escapeHtml(p.description||'')}</p>${galleryStrip(p)}<dl class="details"><div><dt>Material</dt><dd>${escapeHtml(p.material||'Hand-painted resin')}</dd></div><div><dt>Availability</dt><dd>${p.inventory>0?'Available / Commission':'Archive'}</dd></div></dl><div class="card-actions"><span class="tag">${escapeHtml(p.slug || p.id)}</span><a class="btn primary" href="/checkout.html?artwork=${encodeURIComponent(p.id)}&title=${encodeURIComponent(p.title)}">Inquire</a></div></div></article>`;
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

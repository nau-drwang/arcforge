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
function galleryStrip(p){
  const images = Array.isArray(p.gallery) && p.gallery.length ? p.gallery.slice(0,4) : [p.cover_media_key];
  return `<div class="mini-gallery">${images.map((img, i)=>`<img src="${mediaUrl(img)}" alt="${p.alt || p.title} view ${i+1}" loading="lazy">`).join('')}</div>`;
}
function card(p){
  return `<article class="card artwork-card"><div class="product-img"><img src="${mediaUrl(p.cover_media_key)}" alt="${p.alt || p.title}" loading="lazy"></div><div class="card-body"><div class="title-row"><div><p class="category">${p.category || 'Artwork'}</p><h3>${p.title}</h3>${p.title_zh?`<span class="zh-title">${p.title_zh}</span>`:''}</div><span class="price">${money(p.price_cents,p.currency)}</span></div><p class="desc">${p.description||''}</p>${galleryStrip(p)}<dl class="details"><div><dt>Material</dt><dd>${p.material||'Hand-painted resin'}</dd></div><div><dt>Availability</dt><dd>${p.inventory>0?'Available / Commission':'Archive'}</dd></div></dl><div class="card-actions"><span class="tag">${p.slug || p.id}</span><a class="btn primary" href="/checkout.html?artwork=${encodeURIComponent(p.id)}&title=${encodeURIComponent(p.title)}">Inquire</a></div></div></article>`;
}
(async()=>{
  const grid=document.querySelector('[data-products]');
  if(grid){
    const products=await loadProducts();
    grid.innerHTML=products.map(card).join('');
  }
})();

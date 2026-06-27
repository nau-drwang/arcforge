const fallback = [
  { id:'sample-ash-waraxe-lord', title:'灰烬战斧领主', price_cents:42000, currency:'USD', material:'手绘树脂 / 金属旧化', height_cm:32, inventory:1, description:'重甲、披风和岩石底座做旧处理，适合收藏柜中央陈列。', cover_media_key:null },
  { id:'sample-mooncrystal-mage', title:'月晶秘法师', price_cents:36000, currency:'USD', material:'半透明树脂 / 冷光漆', height_cm:28, inventory:1, description:'法杖和晶体以低饱和蓝绿呈现，强调手工笔触和层次。', cover_media_key:null },
  { id:'sample-wing-oath-guardian', title:'翼誓守卫', price_cents:51000, currency:'USD', material:'树脂 / 仿石底座', height_cm:35, inventory:3, description:'展开翼片和长枪形成竖向轮廓，适合高柜或独立展台。', cover_media_key:null }
];
function money(cents, currency='USD'){ return new Intl.NumberFormat('en-US',{style:'currency',currency}).format((cents||0)/100); }
function mediaUrl(key){ return key ? `/media/${key}` : '/hero-sculptures.png'; }
async function loadProducts(){ try{ const r=await fetch('/api/products'); if(!r.ok) throw new Error('API failed'); const d=await r.json(); return d.products?.length ? d.products : fallback; }catch(e){ return fallback; } }
function card(p){ return `<article class="card"><div class="product-img"><img src="${mediaUrl(p.cover_media_key)}" alt="${p.title}"></div><div class="card-body"><div class="title-row"><h3>${p.title}</h3><span class="price">${money(p.price_cents,p.currency)}</span></div><p class="desc">${p.description||''}</p><dl class="details"><div><dt>材质</dt><dd>${p.material||'手绘树脂'}</dd></div><div><dt>高度</dt><dd>${p.height_cm?`${p.height_cm} cm`:'待确认'}</dd></div></dl><div class="card-actions"><span class="tag">${p.inventory>1?`库存 ${p.inventory} 件`:'现货 / 预订'}</span><a class="btn primary" href="/checkout.html?artwork=${encodeURIComponent(p.id)}&title=${encodeURIComponent(p.title)}">购买</a></div></div></article>`; }
(async()=>{ const grid=document.querySelector('[data-products]'); if(grid){ const products=await loadProducts(); grid.innerHTML=products.map(card).join(''); }})();

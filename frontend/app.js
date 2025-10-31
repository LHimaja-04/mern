/* ===========================================================
   EduKart • Vanilla JS Frontend (Index Page)
   - Product catalog (mock)
   - Search, category filter, sorting
   - Add to cart, add to wishlist
   - LocalStorage persistence
   - Nav badge + user name rendering
   =========================================================== */

(function(){
  // ---------- LocalStorage Keys ----------
  const LS = {
    CART: 'edukart_cart_v1',
    WISHLIST: 'edukart_wishlist_v1',
    USER: 'edukart_user_v1'
  };

  // ---------- Mock Catalog ----------
  const PRODUCTS = [
    { id:'b101', title:'Algorithms 101 (E-Book)', price:199, rating:4.6, category:'Books',
      img:'https://picsum.photos/seed/algos101/640/400', desc:'Crisp intro to algorithms with worked examples.' },
    { id:'b102', title:'System Design Primer (PDF)', price:299, rating:4.5, category:'Books',
      img:'https://picsum.photos/seed/sysdesign/640/400', desc:'Scalable systems, diagrams, trade-offs.' },
    { id:'b103', title:'Python for Data Science', price:249, rating:4.6, category:'Books',
      img:'https://picsum.photos/seed/pyds/640/400', desc:'Pandas, NumPy, viz, ML quickstart.' },
    { id:'s201', title:'Premium Notebook (A5, 200p)', price:149, rating:4.3, category:'Stationery',
      img:'https://picsum.photos/seed/notebook/640/400', desc:'Smooth pages, dot-grid, lay-flat.' },
    { id:'s202', title:'Tri-Grip Ball Pens (10 pack)', price:99, rating:4.2, category:'Stationery',
      img:'https://picsum.photos/seed/penpack/640/400', desc:'0.7mm, low-smear ink, exam-friendly.' },
    { id:'k301', title:'Electronics Starter Kit', price:799, rating:4.4, category:'Kits',
      img:'https://picsum.photos/seed/eleckit/640/400', desc:'Breadboard, sensors, jumper wires, LEDs.' },
    { id:'k302', title:'Robotics Kit Jr.', price:1199, rating:4.7, category:'Kits',
      img:'https://picsum.photos/seed/robokit/640/400', desc:'Build mini bots, code basics included.' },
    { id:'c401', title:'DSA Crash Course (Video)', price:499, rating:4.6, category:'Courses',
      img:'https://picsum.photos/seed/dsacourse/640/400', desc:'Arrays → Graphs, with patterns & problems.' },
    { id:'c402', title:'System Design Live (Cohort)', price:1499, rating:4.8, category:'Courses',
      img:'https://picsum.photos/seed/syslive/640/400', desc:'High-scale systems, interviews, mock rounds.' },
    { id:'d501', title:'Drawing Kit (Charcoal+Pencils)', price:259, rating:4.1, category:'Drawing',
      img:'https://picsum.photos/seed/drawkit/640/400', desc:'Shading essentials, erasers, blender.' },
    { id:'e601', title:'Exam Essentials Pack', price:349, rating:4.5, category:'Essentials',
      img:'https://picsum.photos/seed/examkit/640/400', desc:'Highlighters, sticky notes, tabs, ruler.' }
  ];

  // ---------- State ----------
  const state = {
    products: PRODUCTS.slice(),
    filtered: [],
    categories: ['All', ...Array.from(new Set(PRODUCTS.map(p => p.category)))],
    activeCategory: 'All',
    query: '',
    sort: 'featured'
  };

  // ---------- Elements ----------
  const grid = byId('grid');
  const emptyState = byId('emptyState');
  const categoryTabs = byId('categoryTabs');
  const searchInput = byId('searchInput');
  const clearSearch = byId('clearSearch');
  const sortSelect = byId('sortSelect');
  const cartCount = byId('cartCount');
  const meLink = byId('meLink');

  document.addEventListener('DOMContentLoaded', init);

  function init(){
    renderUser();
    renderTabs();
    filterAndRender();
    updateCartBadge();

    // Events
    if(searchInput) searchInput.addEventListener('input', onSearch);
    if(clearSearch) clearSearch.addEventListener('click', ()=>{ searchInput.value=''; state.query=''; filterAndRender(); });
    if(sortSelect) sortSelect.addEventListener('change', (e)=>{ state.sort=e.target.value; filterAndRender(); });
  }

  // ---------- Renderers ----------
  function renderUser(){
    try {
      const user = JSON.parse(localStorage.getItem(LS.USER) || 'null');
      if(user && user.name){
        meLink.textContent = 'Account';
        meLink.href = './login.html';
        meLink.title = user.name;
      }
    } catch {}
  }

  function renderTabs(){
    categoryTabs.innerHTML = '';
    state.categories.forEach(cat => {
      const a = document.createElement('a');
      a.href = 'javascript:void(0)';
      a.className = 'tab' + (cat === state.activeCategory ? ' active' : '');
      a.textContent = cat;
      a.addEventListener('click', () => {
        state.activeCategory = cat;
        setActiveTab(cat);
        filterAndRender();
        document.querySelector('main').scrollIntoView({behavior:'smooth'});
      });
      categoryTabs.appendChild(a);
    });
  }
  function setActiveTab(cat){
    [...categoryTabs.children].forEach(c => c.classList.toggle('active', c.textContent===cat));
  }

  function filterAndRender(){
    const q = state.query.trim().toLowerCase();
    const cat = state.activeCategory;

    let list = state.products.filter(p => {
      const matchQ = !q || p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
      const matchC = cat === 'All' || p.category === cat;
      return matchQ && matchC;
    });

    switch(state.sort){
      case 'price-asc': list.sort((a,b)=>a.price-b.price); break;
      case 'price-desc': list.sort((a,b)=>b.price-a.price); break;
      case 'rating-desc': list.sort((a,b)=>b.rating-a.rating); break;
      case 'title-asc': list.sort((a,b)=>a.title.localeCompare(b.title)); break;
      default: /* featured */ break;
    }

    state.filtered = list;
    renderGrid();
  }

  function renderGrid(){
    grid.innerHTML = '';
    if(state.filtered.length === 0){
      emptyState.classList.remove('hidden');
      return;
    }
    emptyState.classList.add('hidden');

    const frag = document.createDocumentFragment();
    state.filtered.forEach(p => frag.appendChild(productCard(p)));
    grid.appendChild(frag);
  }

  function productCard(p){
    const el = document.createElement('article');
    el.className = 'card';
    el.innerHTML = `
      <img src="${p.img}" alt="${escapeHtml(p.title)}" />
      <div class="content">
        <div class="title">${escapeHtml(p.title)}</div>
        <div class="desc">${escapeHtml(p.desc)}</div>
        <div class="meta">
          <span>⭐ ${p.rating.toFixed(1)}</span>
          <span class="price">₹${p.price}</span>
        </div>
        <div class="actions">
          <button class="btn" data-id="${p.id}" data-act="view">View</button>
          <button class="btn" data-id="${p.id}" data-act="wish">Wishlist</button>
          <button class="btn primary" data-id="${p.id}" data-act="add">Add to Cart</button>
        </div>
      </div>
    `;
    el.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', e=>{
        const id = e.currentTarget.getAttribute('data-id');
        const act = e.currentTarget.getAttribute('data-act');
        if(act==='view') viewItem(p);
        if(act==='add') addToCart(id);
        if(act==='wish') addToWishlist(p);
      });
    });
    return el;
  }

  // ---------- Events ----------
  function onSearch(e){
    state.query = e.target.value || '';
    filterAndRender();
  }

  // ---------- Cart / Wishlist ----------
  function addToCart(id){
    const item = state.products.find(p=>p.id===id);
    if(!item) return;
    const cart = readJSON(LS.CART, {});
    cart[id] = cart[id] || { ...item, qty:0 };
    cart[id].qty += 1;
    writeJSON(LS.CART, cart);
    updateCartBadge();
    alert('Added to cart.');
  }

  function addToWishlist(p){
    const wl = readJSON(LS.WISHLIST, {});
    if(!wl[p.id]){
      wl[p.id] = { ...p, qty: 1 };
      writeJSON(LS.WISHLIST, wl);
      alert('Added to wishlist.');
    }else{
      alert('Already in wishlist.');
    }
  }

  function updateCartBadge(){
    try{
      const cart = JSON.parse(localStorage.getItem(LS.CART) || '{}');
      const count = Object.values(cart).reduce((s,i)=> s + (i.qty||0), 0);
      cartCount.textContent = count;
    }catch{ cartCount.textContent = '0'; }
  }

  // ---------- Utils ----------
  function byId(id){ return document.getElementById(id); }
  function readJSON(key, fallback){ try{ return JSON.parse(localStorage.getItem(key)) ?? fallback; }catch{ return fallback; } }
  function writeJSON(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
  function escapeHtml(s){ return (s||'').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])); }
  function viewItem(p){
    alert(`${p.title}\n\n${p.desc}\n\nCategory: ${p.category}\nPrice: ₹${p.price}\nRating: ${p.rating}`);
  }
})();

import { getWishlist, setWishlist, getCart, setCart, currency, getUser } from './storage.js';

const grid = document.getElementById('wishGrid');
const meLink = document.getElementById('meLink');

init();

function init(){
  renderUser();
  seedFromCartIfEmpty(); // Optional: if wishlist empty, demonstrate with any cart items
  renderWishlist();
}

function renderUser(){
  const u = getUser();
  meLink.textContent = u ? (u.name || 'Account') : 'Login';
}

function seedFromCartIfEmpty(){
  const w = getWishlist();
  if(Object.keys(w).length === 0){
    const c = getCart();
    // copy one item from cart if present to show UI
    const first = Object.values(c)[0];
    if(first){ w[first.id] = {...first, qty:1}; setWishlist(w); }
  }
}

function renderWishlist(){
  const wish = getWishlist();
  const items = Object.values(wish);
  grid.innerHTML = '';

  if(items.length === 0){
    grid.innerHTML = `<div class="card" style="grid-column:1/-1"><div class="content"><h3>No saved items</h3><p class="desc">Browse products and add them to your wishlist.</p><a class="btn primary" href="/index.html">Go Shopping</a></div></div>`;
    return;
  }

  items.forEach(p=>{
    const el = document.createElement('article');
    el.className = 'card';
    el.innerHTML = `
      <img src="${p.img}" alt="${p.title}" />
      <div class="content">
        <div class="title">${p.title}</div>
        <div class="meta"><span>Saved</span><span class="price">${currency(p.price)}</span></div>
        <div class="actions">
          <button class="btn" data-id="${p.id}" data-act="move">Move to Cart</button>
          <button class="btn primary" data-id="${p.id}" data-act="buy">Buy Now</button>
          <button class="btn outline" data-id="${p.id}" data-act="rm">Remove</button>
        </div>
      </div>
    `;
    grid.appendChild(el);
  });

  grid.querySelectorAll('button').forEach(b=> b.addEventListener('click', onAction));
}

function onAction(e){
  const id = e.currentTarget.getAttribute('data-id');
  const act = e.currentTarget.getAttribute('data-act');
  const wish = getWishlist();
  const item = wish[id];
  if(!item) return;

  if(act === 'rm'){
    delete wish[id];
    setWishlist(wish);
    renderWishlist();
    return;
  }

  if(act === 'move' || act === 'buy'){
    // move to cart
    const cart = getCart();
    cart[id] = cart[id] || { ...item, qty: 0 };
    cart[id].qty += 1;
    setCart(cart);
    // remove from wishlist
    delete wish[id];
    setWishlist(wish);
    if(act === 'buy'){
      location.href = '/cart.html';
      return;
    }
    renderWishlist();
  }
}

import { getCart, setCart, getOrders, setOrders, currency, nowISO, getUser } from './storage.js';

const cartEl = document.getElementById('cartContainer');
const subtotalEl = document.getElementById('subtotal');
const totalEl = document.getElementById('total');
const clearBtn = document.getElementById('clearCartBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
const meLink = document.getElementById('meLink');

init();

function init(){
  renderUser();
  renderCart();
  clearBtn.addEventListener('click', clearCart);
  checkoutBtn.addEventListener('click', checkout);
}

function renderUser(){
  const u = getUser();
  meLink.textContent = u ? (u.name || 'Account') : 'Login';
  meLink.href = u ? '/login.html' : '/login.html';
}

function entries(){
  const cart = getCart();
  return Object.values(cart);
}

function totals(){
  const items = entries();
  const subtotal = items.reduce((s,i)=> s + (i.price * i.qty), 0);
  return { items, subtotal, total: subtotal };
}

function renderCart(){
  const list = entries();
  cartEl.innerHTML = '';

  if(list.length === 0){
    cartEl.innerHTML = `<p style="padding:16px;color:var(--muted);text-align:center">Cart is empty. Time to manifest some productivity ✨</p>`;
  }else{
    const frag = document.createDocumentFragment();
    list.forEach(i=>{
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <img src="${i.img}" alt="${i.title}" />
        <div>
          <h4>${i.title}</h4>
          <div class="qty">
            <button data-act="dec" data-id="${i.id}">−</button>
            <span>${i.qty}</span>
            <button data-act="inc" data-id="${i.id}">+</button>
          </div>
          <div class="remove" data-act="rm" data-id="${i.id}">Remove</div>
        </div>
        <div class="item-price">${currency(i.price * i.qty)}</div>
      `;
      frag.appendChild(row);
    });
    cartEl.appendChild(frag);

    cartEl.querySelectorAll('button, .remove').forEach(el=>{
      el.addEventListener('click', handleAction);
    });
  }

  const { subtotal, total } = totals();
  subtotalEl.textContent = currency(subtotal);
  totalEl.textContent = currency(total);
}

function handleAction(e){
  const act = e.currentTarget.getAttribute('data-act');
  const id = e.currentTarget.getAttribute('data-id');
  const cart = getCart();

  if(!cart[id]) return;

  if(act === 'dec'){ cart[id].qty = Math.max(1, cart[id].qty - 1); }
  if(act === 'inc'){ cart[id].qty += 1; }
  if(act === 'rm'){ delete cart[id]; }

  setCart(cart);
  renderCart();
}

function clearCart(){
  setCart({});
  renderCart();
}

function checkout(){
  const user = getUser();
  if(!user){
    alert('Please login to checkout.');
    location.href = `/login.html?next=${encodeURIComponent('/cart.html')}`;
    return;
  }
  const { items, total } = totals();
  if(items.length === 0){
    alert('Cart is empty.');
    return;
  }

  // Create order
  const order = {
    orderId: 'OD' + Math.random().toString(36).slice(2, 8).toUpperCase(),
    placedAt: nowISO(),
    items: items.map(({id,title,price,qty,img})=>({id,title,price,qty,img})),
    total,
    status: 'PLACED',
    email: user.email || null,
    shipTo: user.address || 'Default Address',
  };

  const orders = getOrders();
  orders.unshift(order);
  setOrders(orders);

  // Clear cart
  setCart({});

  alert(`Order placed!\nOrder ID: ${order.orderId}`);
  location.href = '/orders.html';
}

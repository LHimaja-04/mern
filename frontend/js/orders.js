import { getOrders, currency, getUser } from './storage.js';

const wrap = document.getElementById('ordersWrap');
const meLink = document.getElementById('meLink');

init();

function init(){
  renderUser();
  renderOrders();
}

function renderUser(){
  const u = getUser();
  meLink.textContent = u ? (u.name || 'Account') : 'Login';
}

function renderOrders(){
  const orders = getOrders();
  wrap.innerHTML = '';

  if(orders.length === 0){
    wrap.innerHTML = `<div class="card"><div class="content"><h3>No orders yet</h3><p class="desc">Place your first order from the cart page.</p><a class="btn primary" href="/index.html">Browse Products</a></div></div>`;
    return;
  }

  orders.forEach(o=>{
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="content">
        <div class="meta" style="margin-bottom:.3rem">
          <strong>Order ${o.orderId}</strong>
          <span>${new Date(o.placedAt).toLocaleString()}</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:.5rem">
          ${o.items.map(i=>`
            <div style="display:grid;grid-template-columns:64px 1fr auto;gap:10px;align-items:center;border-bottom:1px dashed var(--border);padding-bottom:8px">
              <img src="${i.img}" alt="${i.title}" style="width:64px;height:64px;object-fit:cover;border-radius:8px"/>
              <div>
                <div class="title">${i.title}</div>
                <div class="meta">Qty: ${i.qty} • ${currency(i.price)}</div>
              </div>
              <div class="item-price">${currency(i.price * i.qty)}</div>
            </div>
          `).join('')}
        </div>
        <div class="line total" style="margin-top:.6rem">
          <strong>Total</strong><strong>${currency(o.total)}</strong>
        </div>
        <div class="meta">Status: <strong>${o.status}</strong></div>
      </div>
    `;
    wrap.appendChild(card);
  });
}

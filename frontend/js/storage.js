// js/storage.js
const LS_KEYS = {
  CART: 'edukart_cart_v1',
  ORDERS: 'edukart_orders_v1',
  WISHLIST: 'edukart_wishlist_v1',
  USER: 'edukart_user_v1',
};

const store = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  set(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
};

export function getCart() { return store.get(LS_KEYS.CART, {}); }
export function setCart(c) { store.set(LS_KEYS.CART, c); }

export function getOrders() { return store.get(LS_KEYS.ORDERS, []); }
export function setOrders(o) { store.set(LS_KEYS.ORDERS, o); }

export function getWishlist() { return store.get(LS_KEYS.WISHLIST, {}); }
export function setWishlist(w) { store.set(LS_KEYS.WISHLIST, w); }

export function getUser() { return store.get(LS_KEYS.USER, null); }
export function setUser(u) { store.set(LS_KEYS.USER, u); }
export function clearUser() { localStorage.removeItem(LS_KEYS.USER); }

export function currency(n){ return `₹${Number(n||0).toLocaleString('en-IN')}`; }

export function nowISO(){ return new Date().toISOString(); }

// Auth guard (redirects to login if not present)
export function requireAuth() {
  const u = getUser();
  if (!u) {
    const here = encodeURIComponent(location.pathname);
    location.href = `/login.html?next=${here}`;
  }
  return u;
}

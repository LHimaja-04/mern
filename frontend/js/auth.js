import { getUser, setUser, clearUser } from './storage.js';

const nameEl = document.getElementById('name');
const emailEl = document.getElementById('email');
const addrEl = document.getElementById('addr');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');

const params = new URLSearchParams(location.search);
const next = params.get('next') || '/index.html';

init();

function init(){
  const u = getUser();
  if(u){
    nameEl.value = u.name || '';
    emailEl.value = u.email || '';
    addrEl.value = u.address || '';
  }
  loginBtn.addEventListener('click', onLogin);
  logoutBtn.addEventListener('click', onLogout);
}

function onLogin(){
  const name = nameEl.value.trim();
  const email = emailEl.value.trim();
  const address = addrEl.value.trim();

  if(!name || !email){
    alert('Name and Email are required.');
    return;
  }
  setUser({ name, email, address });
  location.href = next;
}

function onLogout(){
  clearUser();
  alert('Logged out.');
  location.reload();
}

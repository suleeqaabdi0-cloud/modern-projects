const PRODUCTS = [
  { id: 1, emoji: "🥦", name: "Broccoli", type: "vegetable", price: 2.99, unit: "kg" },
  { id: 2, emoji: "🍅", name: "Yaanyo", type: "vegetable", price: 1.49, unit: "kg" },
  { id: 3, emoji: "🥕", name: "Bataati", type: "vegetable", price: 1.29, unit: "kg" },
  { id: 4, emoji: "🥬", name: "Salad", type: "vegetable", price: 0.99, unit: "xabo" },
  { id: 5, emoji: "🧅", name: "Basal", type: "vegetable", price: 0.89, unit: "kg" },

  { id: 6, emoji: "🍓", name: "Strawberry", type: "fruit", price: 3.49, unit: "kg" },
  { id: 7, emoji: "🍇", name: "Canab", type: "fruit", price: 4.99, unit: "kg" },
  { id: 8, emoji: "🍎", name: "Tufaax", type: "fruit", price: 2.49, unit: "kg" },

  { id: 9, emoji: "🍊", name: "Orange", type: "citrus", price: 1.99, unit: "kg" },
  { id: 10, emoji: "🍋", name: "Lemon", type: "citrus", price: 1.49, unit: "kg" },

  { id: 11, emoji: "🍍", name: "Pineapple", type: "tropical", price: 3.99, unit: "xabo" },
  { id: 12, emoji: "🥭", name: "Lambe", type: "tropical", price: 2.99, unit: "xabo" },
  { id: 13, emoji: "🍌", name: "Muus", type: "tropical", price: 1.59, unit: "kg" },
];

let cart = [];
let currentFilter = "all";
let currentSearch = "";
let cartOpen = false;

function getUsers() {
  return JSON.parse(localStorage.getItem("fm_users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("fm_users", JSON.stringify(users));
}

function setCurrentUser(user) {
  sessionStorage.setItem("fm_current_user", JSON.stringify(user));
}

function getCurrentUser() {
  return JSON.parse(sessionStorage.getItem("fm_current_user"));
}


function register() {

  const username = document.getElementById("registerUsername").value.trim();

  const email = document.getElementById("registerEmail").value.trim();

  const password = document.getElementById("registerPassword").value.trim();


  if (!username || !email || !password) {
    showToast(" Buuxi dhammaan fields-ka", true);
    return;
  }


  const users = getUsers();

  const exists = users.find(user => user.username === username);

  if (exists) {
    showToast(" Username hore ayaa loo isticmaalay", true);
    return;
  }


  const newUser = {
    username,
    email,
    password
  };


  users.push(newUser);

  saveUsers(users);

  showToast(" Account waa la sameeyay");


  document.getElementById("registerUsername").value = "";
  document.getElementById("registerEmail").value = "";
  document.getElementById("registerPassword").value = "";


  showLogin();
}


function login() {

  const username = document.getElementById("loginUsername").value.trim();

  const password = document.getElementById("loginPassword").value.trim();


  if (!username || !password) {
    showToast(" Geli username iyo password", true);
    return;
  }


  const users = getUsers();


  const user = users.find(
    user =>
      user.username === username &&
      user.password === password
  );


  if (!user) {
    showToast(" Username ama password waa qalad", true);
    return;
  }


  setCurrentUser(user);

  loadCart();

  hideAuthOverlay();

  showToast(`👋 Soo dhawoow ${user.username}`);


  document.getElementById("loginUsername").value = "";
  document.getElementById("loginPassword").value = "";
}

function logout() {

  sessionStorage.removeItem("fm_current_user");

  cart = [];

  renderCart();

  showAuthOverlay();

  showToast("👋 Waad logout gareysay");
}

function showRegister() {
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("registerBox").style.display = "block";
}

function showLogin() {
  document.getElementById("registerBox").style.display = "none";
  document.getElementById("loginBox").style.display = "block";
}

function hideAuthOverlay() {
  document.getElementById("authOverlay").style.display = "none";
}

function showAuthOverlay() {
  document.getElementById("authOverlay").style.display = "flex";
}


function renderProducts() {

  const grid = document.getElementById("products-grid");

  let filtered = PRODUCTS.filter(product => {

    const matchFilter =
      currentFilter === "all" ||
      product.type === currentFilter;

    const matchSearch =
      product.name.toLowerCase()
      .includes(currentSearch.toLowerCase());

    return matchFilter && matchSearch;
  });


  if (filtered.length === 0) {

    grid.innerHTML = `
      <div class="no-results">
        🔍 Wax alaab ah lama helin
      </div>
    `;

    return;
  }


  grid.innerHTML = filtered.map(product => `

    <div class="product-card">

      <div class="product-emoji">
        ${product.emoji}
      </div>

      <div class="product-name">
        ${product.name}
      </div>

      <div class="product-type">
        ${product.type}
      </div>

      <div class="product-price">
        $${product.price}
        <span>/ ${product.unit}</span>
      </div>


      <div id="desc-${product.id}">
        <button
          class="desc-btn"
          onclick="loadDescription(${product.id})"
        >
          
        </button>
      </div>


      <button
        class="add-btn"
        onclick="addToCart(${product.id})"
      >
        🛒 Ku dar Basket
      </button>

    </div>

  `).join("");
}

function setFilter(filter, button) {

  currentFilter = filter;

  document
    .querySelectorAll(".filter-btn")
    .forEach(btn => btn.classList.remove("active"));

  button.classList.add("active");

  renderProducts();
}

function filterProducts() {

  currentSearch =
    document.getElementById("search-input").value;

  renderProducts();
}


function loadDescription(productId) {

  const descriptions = {

    1: "🥦 Broccoli fresh ah oo vitamins badan leh.",

    2: "🍅 Yaanyo cusub oo organic taste leh.",

    3: "🥕 Bataati caafimaad leh oo energy badan leh.",

    4: "🥬 Salad fresh ah oo crispy leh.",

    5: "🧅 Basal cusub oo cooking-ka kuu macaaneynaya.",

    6: "🍓 Strawberry juicy ah oo aad u macaan.",

    7: "🍇 Canab fresh ah oo energy badan leh.",

    8: "🍎 Tufaax caafimaad leh oo fresh ah.",

    9: "🍊 Orange vitamin C badan leh.",

    10: "🍋 Lemon fresh ah oo almost every juice ku fiican.",

    11: "🍍 Pineapple tropical ah oo sweet badan.",

    12: "🥭 Lambe cusub oo aad u macaan.",

    13: "🍌 Muus fresh ah oo daily energy leh."
  };


  const desc = document.getElementById(`desc-${productId}`);

  desc.innerHTML = `
    <div class="desc-loading">
      ⏳ Loading...
    </div>
  `;


  setTimeout(() => {

    desc.innerHTML = `
      <div class="desc-text">
        ${descriptions[productId]}
      </div>

      <div class="desc-badge">
        ✨ AI
      </div>
    `;

  }, 1000);
}

function addToCart(productId) {

  if (!getCurrentUser()) {

    showToast("🔐 Fadlan login samee", true);

    showAuthOverlay();

    return;
  }


  const product = PRODUCTS.find(p => p.id === productId);

  const existing = cart.find(item => item.id === productId);


  if (existing) {

    existing.qty++;

  } else {

    cart.push({
      ...product,
      qty: 1
    });
  }


  saveCart();

  renderCart();

  showToast(` ${product.name} basketka ayaa lagu daray`);
}


function removeFromCart(productId) {

  cart = cart.filter(item => item.id !== productId);

  saveCart();

  renderCart();
}


function changeQty(productId, amount) {

  const item = cart.find(i => i.id === productId);

  if (!item) return;

  item.qty += amount;

  if (item.qty <= 0) {
    removeFromCart(productId);
  }

  saveCart();

  renderCart();
}


function renderCart() {

  const cartItems =
    document.getElementById("cart-items");

  const cartFooter =
    document.getElementById("cart-footer");

  const cartCount =
    document.getElementById("cart-count");


  const totalQty =
    cart.reduce((sum, item) => sum + item.qty, 0);

  cartCount.textContent = totalQty;


  if (cart.length === 0) {

    cartItems.innerHTML = `
      <div class="cart-empty">
        <span>🛒</span>
        Basket waa madhan yahay
      </div>
    `;

    cartFooter.style.display = "none";

    return;
  }


  cartFooter.style.display = "block";


  let total = 0;


  cartItems.innerHTML = cart.map(item => {

    total += item.price * item.qty;

    return `

      <div class="cart-item">

        <div class="cart-item-emoji">
          ${item.emoji}
        </div>

        <div style="flex:1">

          <div class="cart-item-name">
            ${item.name}
          </div>

          <div class="cart-item-price">
            $${(item.price * item.qty).toFixed(2)}
          </div>

        </div>


        <div class="qty-controls">

          <button
            class="qty-btn"
            onclick="changeQty(${item.id}, -1)"
          >
            -
          </button>

          <span>${item.qty}</span>

          <button
            class="qty-btn"
            onclick="changeQty(${item.id}, 1)"
          >
            +
          </button>

        </div>


        <button
          class="remove-btn"
          onclick="removeFromCart(${item.id})"
        >
          🗑️
        </button>

      </div>

    `;
  }).join("");


  document.getElementById("cart-total").textContent =
    `$${total.toFixed(2)}`;
}


function saveCart() {

  const user = getCurrentUser();

  if (!user) return;

  localStorage.setItem(
    `cart_${user.username}`,
    JSON.stringify(cart)
  );
}

function loadCart() {

  const user = getCurrentUser();

  if (!user) return;

  const saved =
    JSON.parse(
      localStorage.getItem(`cart_${user.username}`)
    ) || [];

  cart = saved;

  renderCart();
}


function toggleCart() {

  cartOpen = !cartOpen;

  document
    .getElementById("cart-panel")
    .classList.toggle("open");

  document
    .getElementById("cart-overlay")
    .classList.toggle("open");
}


function clearCart() {

  cart = [];

  saveCart();

  renderCart();

  showToast("🗑️ Basket waa la nadiifiyay");
}


function checkout() {

  if (cart.length === 0) return;

  showToast("🎉 Mahadsanid dalabkaaga!");

  clearCart();

  toggleCart();
}


let toastTimeout;

function showToast(message, error = false) {

  const toast = document.getElementById("toast");

  toast.textContent = message;

  toast.style.background =
    error ? "#d32f2f" : "#1b5e20";

  toast.classList.add("show");


  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {

    toast.classList.remove("show");

  }, 3000);
}


document.addEventListener("DOMContentLoaded", () => {

  renderProducts();

  const user = getCurrentUser();

  if (user) {

    hideAuthOverlay();

    loadCart();

  } else {

    showAuthOverlay();
  }
});
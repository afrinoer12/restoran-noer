const menus = [
  {
    id: 1,
    name: 'Nasi Goreng Spesial',
    category: 'Makanan',
    price: 25000,
    desc: 'Nasi goreng lezat dengan telur, ayam, sayuran, dan bumbu khas restoran.',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    name: 'Ayam Bakar Madu',
    category: 'Makanan',
    price: 32000,
    desc: 'Ayam bakar empuk dengan olesan madu dan sambal khas yang nikmat.',
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    name: 'Mie Goreng Seafood',
    category: 'Makanan',
    price: 28000,
    desc: 'Mie goreng gurih dengan tambahan seafood segar dan sayuran pilihan.',
    image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    name: 'Es Teh Lemon',
    category: 'Minuman',
    price: 12000,
    desc: 'Minuman segar perpaduan teh pilihan dan lemon yang menyegarkan.',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 5,
    name: 'Kopi Susu Aren',
    category: 'Minuman',
    price: 18000,
    desc: 'Kopi susu creamy dengan rasa manis gula aren khas Indonesia.',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 6,
    name: 'Chocolate Cake',
    category: 'Dessert',
    price: 22000,
    desc: 'Cake cokelat lembut dengan topping manis yang cocok sebagai penutup.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80'
  }
];

const menuGrid = document.getElementById('menuGrid');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const filterButtons = document.querySelectorAll('.filter-btn');
const checkoutBtn = document.getElementById('checkoutBtn');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

let cart = [];

function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
}

function renderMenus(category = 'all') {
  const filteredMenus = category === 'all'
    ? menus
    : menus.filter(menu => menu.category === category);

  menuGrid.innerHTML = filteredMenus.map(menu => `
    <article class="menu-card">
      <img src="${menu.image}" alt="${menu.name}">
      <div class="menu-info">
        <span class="menu-category">${menu.category}</span>
        <h3>${menu.name}</h3>
        <p>${menu.desc}</p>
        <div class="menu-footer">
          <span class="price">${formatRupiah(menu.price)}</span>
          <button class="add-btn" onclick="addToCart(${menu.id})">Tambah</button>
        </div>
      </div>
    </article>
  `).join('');
}

function addToCart(id) {
  const selectedMenu = menus.find(menu => menu.id === id);
  const itemInCart = cart.find(item => item.id === id);

  if (itemInCart) {
    itemInCart.qty += 1;
  } else {
    cart.push({ ...selectedMenu, qty: 1 });
  }

  renderCart();
}

function changeQty(id, action) {
  const item = cart.find(item => item.id === id);

  if (!item) return;

  if (action === 'plus') {
    item.qty += 1;
  } else {
    item.qty -= 1;
  }

  cart = cart.filter(item => item.qty > 0);
  renderCart();
}

function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Belum ada pesanan.</p>';
    cartTotal.textContent = formatRupiah(0);
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div>
        <h4>${item.name}</h4>
        <p>${formatRupiah(item.price)} x ${item.qty}</p>
      </div>
      <div class="qty-actions">
        <button onclick="changeQty(${item.id}, 'minus')">-</button>
        <strong>${item.qty}</strong>
        <button onclick="changeQty(${item.id}, 'plus')">+</button>
      </div>
    </div>
  `).join('');

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartTotal.textContent = formatRupiah(total);
}

function checkoutWhatsApp() {
  if (cart.length === 0) {
    alert('Keranjang masih kosong. Silakan pilih menu terlebih dahulu.');
    return;
  }

  const orderList = cart.map(item => `- ${item.name} x${item.qty} = ${formatRupiah(item.price * item.qty)}`).join('\n');
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const message = `Halo RestoNoer, saya ingin memesan:\n\n${orderList}\n\nTotal: ${formatRupiah(total)}\n\nNama:\nAlamat:\nCatatan:`;
  const phoneNumber = '6285265818793';
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  window.open(url, '_blank');
}

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    renderMenus(button.dataset.category);
  });
});

checkoutBtn.addEventListener('click', checkoutWhatsApp);

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});

renderMenus();
renderCart();

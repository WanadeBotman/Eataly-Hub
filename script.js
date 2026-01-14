const menuData = [
    { cat: 'starters', name: 'Antipasti', items: [
        { id: 1, name: "Gold Arancini", price: 18, img: "https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=1000&auto=format&fit=crop", desc: "Crispy saffron risotto balls with a molten ragu center." },
        { id: 2, name: "Tuscan Bruschetta", price: 16, img: "https://images.unsplash.com/photo-1572656631137-7935297eff55?q=80&w=1000&auto=format&fit=crop", desc: "Charred sourdough topped with garlic and heirloom tomatoes." }
    ]},
    { cat: 'pasta', name: 'Le Paste', items: [
        { id: 3, name: "Lobster Ravioli", price: 32, img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1000&auto=format&fit=crop", desc: "Handmade pasta parcels with fresh Atlantic lobster butter." },
        { id: 4, name: "Classic Carbonara", price: 21, img: "https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=1000&auto=format&fit=crop", desc: "Authentic Guanciale, Pecorino Romano, and toasted pepper." }
    ]},
    { cat: 'pizza', name: 'Le Pizze', items: [
        { id: 5, name: "Black Truffle Pizza", price: 28, img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop", desc: "Fresh truffle shavings, fontina cheese, and wild mushrooms." },
        { id: 6, name: "Margherita DOP", price: 22, img: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=1000&auto=format&fit=crop", desc: "San Marzano tomatoes, buffalo mozzarella, and fresh basil." }
    ]},
    { cat: 'mains', name: 'Secondi', items: [
        { id: 7, name: "Veal Saltimbocca", price: 38, img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=1000&auto=format&fit=crop", desc: "Tender veal wrapped in prosciutto with a white wine reduction." },
        { id: 8, name: "Mediterranean Bass", price: 34, img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=1000&auto=format&fit=crop", desc: "Grilled sea bass with lemon, capers, and roasted fennel." }
    ]},
    { cat: 'salads', name: 'Insalata', items: [
        { id: 9, name: "Tuscan Kale", price: 14, img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1000&auto=format&fit=crop", desc: "Lemon vinaigrette, pine nuts, and aged pecorino." }
    ]},
    { cat: 'desserts', name: 'Dolci', items: [
        { id: 10, name: "Tiramisu Classico", price: 12, img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=1000&auto=format&fit=crop", desc: "Layers of espresso-soaked ladyfingers and mascarpone cream." },
        { id: 11, name: "Panna Cotta", price: 10, img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1000&auto=format&fit=crop", desc: "Silky vanilla bean custard with a mixed berry compote." }
    ]},
    { cat: 'drinks', name: 'Bevande', items: [
        { id: 12, name: "Aperol Spritz", price: 15, img: "https://images.unsplash.com/photo-1560512823-829485b8bf24?q=80&w=1000&auto=format&fit=crop", desc: "The quintessential Italian aperitivo with fresh orange." }
    ]}
];

let cart = JSON.parse(localStorage.getItem('EATALY_CART')) || [];

// Render the menu with specific 8-chapter sections
function renderMenu() {
    const main = document.getElementById('menu-sections');
    main.innerHTML = menuData.map(group => `
        <section id="${group.cat}">
            <h2 class="section-title">${group.name}</h2>
            <div class="menu-grid">
                ${group.items.map(item => `
                    <div class="food-card">
                        <img src="${item.img}" alt="${item.name}" loading="lazy">
                        <div class="food-info">
                            <h3>${item.name}</h3>
                            <p>${item.desc}</p>
                            <div class="card-footer">
                                <span class="price">$${item.price}</span>
                                <button class="add-btn" onclick="addToCart(${item.id})">Add to Order</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
    `).join('');
}

// Logic to add items to cart
function addToCart(id) {
    let product;
    menuData.forEach(g => {
        const found = g.items.find(i => i.id === id);
        if(found) product = found;
    });

    const existing = cart.find(i => i.id === id);
    if(existing) {
        existing.qty++;
    } else {
        cart.push({...product, qty: 1});
    }
    syncCart();
}

// Manage quantity updates
function updateQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    
    item.qty += delta;
    if(item.qty < 1) {
        cart = cart.filter(i => i.id !== id);
    }
    syncCart();
}

// Sync cart with LocalStorage and UI
function syncCart() {
    localStorage.setItem('EATALY_CART', JSON.stringify(cart));
    renderCart();
}

// Render the Sidebar Cart
function renderCart() {
    const container = document.getElementById('cart-items-container');
    const badge = document.getElementById('cart-counter');
    
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.img}">
            <div style="flex:1">
                <h4>${item.name}</h4>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
                </div>
            </div>
            <strong>$${item.price * item.qty}</strong>
        </div>
    `).join('');

    const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    document.getElementById('subtotal').innerText = `$${total}.00`;
    document.getElementById('final-total').innerText = `$${total}.00`;
    
    const count = cart.reduce((sum, i) => sum + i.qty, 0);
    badge.innerText = count;
    badge.style.display = count > 0 ? 'block' : 'none';
}

// Sidebar Interaction
const sideCart = document.getElementById('side-cart');
const overlay = document.getElementById('overlay');

document.getElementById('cart-open').onclick = () => { 
    sideCart.classList.add('active'); 
    overlay.classList.add('active'); 
};

document.getElementById('cart-close').onclick = () => { 
    sideCart.classList.remove('active'); 
    overlay.classList.remove('active'); 
};

overlay.onclick = () => { 
    sideCart.classList.remove('active'); 
    overlay.classList.remove('active'); 
};

// Search Logic
document.getElementById('search-input').oninput = (e) => {
    const val = e.target.value.toLowerCase();
    document.querySelectorAll('.food-card').forEach(card => {
        const title = card.querySelector('h3').innerText.toLowerCase();
        card.style.display = title.includes(val) ? 'block' : 'none';
    });
};

// Checkout Simulation
document.getElementById('checkout-trigger').onclick = () => {
    if(cart.length === 0) {
        alert("Your table is currently empty!");
        return;
    }
    document.getElementById('confirm-modal').style.display = 'flex';
    cart = [];
    syncCart();
};

// Init
renderMenu();
renderCart();
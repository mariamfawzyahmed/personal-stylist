const productsGrid = document.getElementById('products-grid');
const cartCountLabel = document.getElementById('cart-count');

// مصفوفة البيانات المحدثة بالأسماء الصحيحة
const myStyles = [
    { id: 1, title: "Modern Casual Set", price: 420, image: "https://files.cdn.printful.com/o/upload/blog-post-img-upload/0d/0d61df06987ef555ddb60d9fd2cf8531_l", category: "WOMAN" },
    { id: 2, title: "Classic White Tee", price: 350, image: "https://files.cdn.printful.com/upload/catalogProductImage/4b/4b282d1a09efe90e9299fbdef0f45ec6_l", category: "WOMAN" },
    { id: 3, title: "Olive Urban Hoodie", price: 850, image: "https://files.cdn.printful.com/upload/catalogProductImage/0a/0ae890fc2fc38dedec0addf1f71e6dbc_l", category: "WOMAN" },
    { id: 4, title: "Grey Cropped Hoodie", price: 920, image: "https://files.cdn.printful.com/o/upload/product-catalog-img/16/16546c8b251eacfbb2c22c5f31ddc557_l", category: "WOMAN" },

    { id: 5, title: "Classic White Oversized", price: 180, image: "https://files.cdn.printful.com/o/upload/product-catalog-img/56/562d1c7b3e97d51f8db3f388b8b22724_l", category: "MEN" },
    { id: 6, title: "Navy Half-Zip Knit", price: 85, image: "https://files.cdn.printful.com/o/upload/product-catalog-img/bd/bdff9eeb2d4ca7c8d526ec837063446c_l", category: "MEN" },
    { id: 7, title: "Essential Petrol Tee", price: 210, image: "https://files.cdn.printful.com/o/upload/product-catalog-img/20/2079a3ee4cc472ad952fe16654f274cd_l", category: "MEN" },
    { id: 8, title: "Signature Grey Joggers", price: 145, image: "https://files.cdn.printful.com/upload/catalogProductImage/41/417e55c786b17b8ac1edad3601d76dd0_l", category: "MEN" },

    { id: 9, title: "Kids Heather Hoodie", price: 120, image: "https://files.cdn.printful.com/o/upload/product-catalog-img/49/4931e4473343d62881d6ad65a8633ba7_l", category: "KIDS" },
    { id: 10, title: "Kids Basic Black Tee", price: 65, image: "https://files.cdn.printful.com/o/upload/product-catalog-img/83/83b0b635cb8735fcaa550a8be89be8ea_l", category: "KIDS" },
    { id: 11, title: "Kids Everyday Grey Tee", price: 150, image: "https://files.cdn.printful.com/o/upload/product-catalog-img/82/82f0f45cdea15044d0a83f17c21f7ee8_l", category: "KIDS" },
    { id: 12, title: "Kids Navy Hoodie", price: 95, image: "https://files.cdn.printful.com/o/upload/product-catalog-img/bc/bcedeeb0ff51112cb20950d141ade155_l", category: "KIDS" },
    
    { id: 13, title: "Classic Backpack", price: 90, image: "https://files.cdn.printful.com/o/upload/product-catalog-img/82/822c42dd6c8cc9f7dde941c7a7d17532_l", category: "ACCESSORIES" },
    { id: 14, title: "Urban Snapback", price: 35, image: "https://files.cdn.printful.com/o/upload/product-catalog-img/58/58cbd46a855012039c5cae4aac3d3449_l", category: "ACCESSORIES" },
    { id: 15, title: "Leather Wallet", price: 55, image: "https://files.cdn.printful.com/o/upload/product-catalog-img/01/013bbc7a10ee44e0e8c980c1d9934716_l", category: "ACCESSORIES" },
    { id: 16, title: "Designer Phone Case", price: 25, image: "https://files.cdn.printful.com/o/upload/product-catalog-img/fc/fcd216879a72862714f14fc91d0ed1f5_l", category: "ACCESSORIES" }
];

let sessionCounter = 0;

function displayProducts(products) {
    if(!productsGrid) return;
    productsGrid.innerHTML = ""; 
    
    let cart = JSON.parse(localStorage.getItem('myCart')) || [];

    products.forEach(p => {
        const cartItem = cart.find(item => item.id === p.id);
        
        // تبديل الزر بناءً على وجود المنتج في السلة
        const buttonHTML = cartItem 
            ? `<div class="qty-controls-main">
                <button onclick="updateQtyMain(${p.id}, -1)">-</button>
                <span>${cartItem.quantity}</span>
                <button onclick="updateQtyMain(${p.id}, 1)">+</button>
               </div>`
            : `<button class="add-btn" onclick="addToBag(${p.id})">Add to bag</button>`;

        productsGrid.innerHTML += `
            <div class="product-card">
                <div class="img-container">
                    <img src="${p.image}" alt="${p.title}">
                </div>
                <h3>${p.title}</h3>
                <span class="price">$${p.price}</span>
                <div id="btn-container-${p.id}">${buttonHTML}</div>
            </div>
        `;
    });
}

function addToBag(id) {
    let cart = JSON.parse(localStorage.getItem('myCart')) || [];
    const item = myStyles.find(p => p.id === id);
    
    cart.push({...item, quantity: 1});
    localStorage.setItem('myCart', JSON.stringify(cart));

    sessionCounter += 1;
    updateCounterDisplay();
    refreshCurrentView(); // تحديث الأزرار فوراً

    const notify = document.getElementById('notification');
    if(notify) {
        notify.style.display = 'block';
        setTimeout(() => notify.style.display = 'none', 2000);
    }
}

function updateQtyMain(id, delta) {
    let cart = JSON.parse(localStorage.getItem('myCart')) || [];
    const itemIndex = cart.findIndex(p => p.id === id);

    if (itemIndex !== -1) {
        cart[itemIndex].quantity += delta;
        sessionCounter += delta;

        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }

        localStorage.setItem('myCart', JSON.stringify(cart));
        updateCounterDisplay();
        refreshCurrentView();
    }
}

// دالة مساعدة لتحديث الصفحة بدون فقدان الفلتر الحالي
function refreshCurrentView() {
    const activeBtn = document.querySelector('.btn-filter.active');
    const type = activeBtn ? activeBtn.innerText.toLowerCase() : 'all outfits';
    
    let filtered;
    if (type === 'all outfits') {
        filtered = myStyles;
    } else {
        const category = type.split(' ')[0].toUpperCase(); // تحويل WOMAN, MEN إلخ
        filtered = myStyles.filter(p => p.category === category);
    }
    displayProducts(filtered);
}

function getStyles(type, btn) {
    const buttons = document.querySelectorAll('.btn-filter');
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const filterType = type.toUpperCase();
    const filtered = type === 'all' ? myStyles : myStyles.filter(p => p.category === filterType);
    displayProducts(filtered);
}

function updateCounterDisplay() {
    if(cartCountLabel) cartCountLabel.innerText = sessionCounter;
}

function initApp() {
    const navEntries = performance.getEntriesByType('navigation');
    
    if (navEntries.length > 0 && navEntries[0].type === 'reload') {
        sessionCounter = 0;
        localStorage.removeItem('myCart'); 
        localStorage.setItem('lastSessionCount', '0');
    } else {
        sessionCounter = parseInt(localStorage.getItem('lastSessionCount')) || 0;
    }
    
    displayProducts(myStyles);
    updateCounterDisplay();
}

window.onbeforeunload = function() {
    localStorage.setItem('lastSessionCount', sessionCounter.toString());
};

initApp();
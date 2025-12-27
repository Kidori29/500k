// Update cart badge with item count from localStorage
function updateCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    if (!cartBadge) return;

    // Get cart data from localStorage
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
        cart = [];
    }

    // Calculate total items
    let totalItems = 0;
    if (Array.isArray(cart)) {
        totalItems = cart.reduce((sum, item) => {
            return sum + (parseInt(item.quantity) || 1);
        }, 0);
    }

    // Update badge
    if (totalItems > 0) {
        cartBadge.textContent = totalItems;
        cartBadge.classList.remove('hidden');
    } else {
        cartBadge.classList.add('hidden');
    }
}

// Check login status and update header
function updateHeaderAuth() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const username = sessionStorage.getItem('username');

    if (isLoggedIn === 'true' && username) {
        // Extract name from email (part before @)
        const displayName = username.split('@')[0];

        // Find the header auth section
        const headerAuthSection = document.getElementById('headerAuthSection');
        if (headerAuthSection) {
            // Preserve cart badge
            const cartBadgeHTML = headerAuthSection.querySelector('.cart-btn-wrapper').outerHTML;

            headerAuthSection.innerHTML = `
                <span style="font-family: var(--font-display); font-weight: 600; color: var(--color-vintage-brown);">
                    <span class="material-symbols-outlined" style="vertical-align: middle; font-size: 20px; margin-right: 4px;">person</span>
                    ${displayName}
                </span>
                <button onclick="logout()" class="btn btn-secondary" style="padding: var(--spacing-xs) var(--spacing-md);">
                    <span class="material-symbols-outlined">logout</span>
                    Đăng xuất
                </button>
                ${cartBadgeHTML}
            `;
        }
    }
}

// Logout function
function logout() {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username');
    window.location.href = '../index.html';
}

// Add to cart function
function addToCart(productName, productPrice, productImage) {
    // Get current cart
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
        cart = [];
    }

    // Check if product already exists
    const existingProductIndex = cart.findIndex(item => item.name === productName);

    if (existingProductIndex !== -1) {
        // Increase quantity
        cart[existingProductIndex].quantity = (parseInt(cart[existingProductIndex].quantity) || 1) + 1;
    } else {
        // Add new product
        cart.push({
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update badge
    updateCartBadge();
}

// Run on page load
updateHeaderAuth();
updateCartBadge();

// Update when storage changes (if items added from another tab)
window.addEventListener('storage', updateCartBadge);

// Add event listeners to all "Add to cart" buttons
document.addEventListener('DOMContentLoaded', function () {
    const addToCartButtons = document.querySelectorAll('.btn-primary');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            // Get product info from parent card
            const productCard = this.closest('.product-card');
            if (!productCard) return;

            const productName = productCard.querySelector('.product-name')?.textContent || 'Sản phẩm';
            const productPrice = productCard.querySelector('.product-price')?.textContent || '0đ';
            const productImage = productCard.querySelector('.product-image')?.src || '';

            // Add to cart
            addToCart(productName, productPrice, productImage);
        });
    });
});
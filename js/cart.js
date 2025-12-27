// Load and display cart items from localStorage
function loadCart() {
    const container = document.getElementById('cartItemsContainer');
    const summaryTotal = document.getElementById('summaryTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // Get cart from localStorage
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
        cart = [];
    }

    // Clear container
    container.innerHTML = '';

    // If cart is empty
    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: var(--spacing-3xl); color: var(--color-vintage-light-brown);">
                <span class="material-symbols-outlined" style="font-size: 80px; color: var(--color-vintage-accent);">shopping_cart</span>
                <h3 style="margin-top: var(--spacing-md); font-family: var(--font-display);">Giỏ hàng trống</h3>
                <p style="margin-top: var(--spacing-sm);">Hãy thêm sản phẩm vào giỏ hàng nhé!</p>
                <a href="products.html" class="btn btn-primary" style="margin-top: var(--spacing-lg);">
                    <span class="material-symbols-outlined">shopping_bag</span>
                    Mua sắm ngay
                </a>
            </div>
        `;
        summaryTotal.textContent = '0đ';
        // Disable checkout button when cart is empty
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
    }

    // Enable checkout button when cart has items
    if (checkoutBtn) checkoutBtn.disabled = false;

    // Render cart items
    cart.forEach((item, index) => {
        const quantity = parseInt(item.quantity) || 1;

        const cartItemHTML = `
            <div class="cart-item fade-in-up" style="animation-delay: ${index * 0.1}s" data-index="${index}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='../images/product-1.jpg'">
                <div class="cart-item-info">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <p class="cart-item-price">${item.price}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="remove-btn" aria-label="Xóa sản phẩm" onclick="removeItem(${index})">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="decreaseQuantity(${index})">
                            <span class="material-symbols-outlined">remove</span>
                        </button>
                        <span class="quantity-value" id="qty-${index}">${quantity}</span>
                        <button class="quantity-btn" onclick="increaseQuantity(${index})">
                            <span class="material-symbols-outlined">add</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += cartItemHTML;
    });

    // Update total
    updateCartTotal();
}

// Update total price based on LocalStorage data
function updateCartTotal() {
    const summaryTotal = document.getElementById('summaryTotal');
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
        cart = [];
    }

    let totalPrice = 0;
    cart.forEach(item => {
        const quantity = parseInt(item.quantity) || 1;
        // Parse price (remove 'đ' and commas)
        const priceStr = item.price.replace(/[đ,.]/g, ''); // Handle both comma and dot just in case
        const price = parseInt(priceStr) || 0;
        totalPrice += price * quantity;
    });

    if (summaryTotal) {
        summaryTotal.textContent = totalPrice.toLocaleString('vi-VN') + 'đ';
    }
}

// Remove item from cart
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Remove from array
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));

    // If empty, re-render to show empty state
    if (cart.length === 0) {
        loadCart();
        return;
    }

    // Remove specific element from DOM without re-rendering everything
    const container = document.getElementById('cartItemsContainer');
    const items = container.querySelectorAll('.cart-item');

    if (items[index]) {
        items[index].remove();
    }

    // Re-index remaining items to ensure buttons work with correct index
    const remainingItems = container.querySelectorAll('.cart-item');
    remainingItems.forEach((item, newIndex) => {
        // Update dataset
        item.dataset.index = newIndex;

        // Update quantity span ID
        const qtySpan = item.querySelector('.quantity-value');
        if (qtySpan) {
            qtySpan.id = `qty-${newIndex}`;
        }

        // Update Remove Button
        const removeBtn = item.querySelector('.remove-btn');
        if (removeBtn) {
            removeBtn.setAttribute('onclick', `removeItem(${newIndex})`);
        }

        // Update Quantity Buttons
        const qtyBtns = item.querySelectorAll('.quantity-btn');
        if (qtyBtns.length >= 2) {
            // First button is decrease (minus)
            qtyBtns[0].setAttribute('onclick', `decreaseQuantity(${newIndex})`);
            // Second button is increase (plus)
            qtyBtns[1].setAttribute('onclick', `increaseQuantity(${newIndex})`);
        }
    });

    // Update total price
    updateCartTotal();
}

// Increase quantity
function increaseQuantity(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart[index].quantity = (parseInt(cart[index].quantity) || 1) + 1;
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update UI directly without re-rendering everything
    const qtyElement = document.getElementById(`qty-${index}`);
    if (qtyElement) {
        qtyElement.textContent = cart[index].quantity;
    }

    // Update total
    updateCartTotal();
}

// Decrease quantity
function decreaseQuantity(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const currentQty = parseInt(cart[index].quantity) || 1;

    if (currentQty > 1) {
        cart[index].quantity = currentQty - 1;
        localStorage.setItem('cart', JSON.stringify(cart));

        // Update UI directly without re-rendering everything
        const qtyElement = document.getElementById(`qty-${index}`);
        if (qtyElement) {
            qtyElement.textContent = cart[index].quantity;
        }

        // Update total
        updateCartTotal();
    } else {
        // If quantity is 1, remove item
        removeItem(index);
    }
}

// Load cart on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCart();

    // Add click handler for checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (!checkoutBtn.disabled) {
                window.location.href = 'checkout.html';
            }
        });
    }
});
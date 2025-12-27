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
            headerAuthSection.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px; margin-right: 24px; height: 48px;">
                    <span class="material-symbols-outlined" style="font-size: 24px; color: var(--color-vintage-brown); display: flex;">person</span>
                    <span style="font-family: var(--font-display); font-weight: 700; font-size: 18px; color: var(--color-vintage-brown); padding-top: 2px;">${displayName}</span>
                </div>
                <button onclick="logout()" class="btn btn-secondary">
                    <span class="material-symbols-outlined">logout</span>
                    Đăng xuất
                </button>
            `;
        }
    }
}

// Logout function
function logout() {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username');
    localStorage.removeItem('cart'); // Xóa giỏ hàng khi đăng xuất
    window.location.href = '../index.html';
}

// Load cart items for checkout
function loadCheckoutCart() {
    const container = document.getElementById('checkoutItemsContainer');
    const subtotalElement = document.getElementById('checkoutSubtotal');
    const totalElement = document.getElementById('checkoutTotal');
    const summaryTitle = document.getElementById('checkoutSummaryTitle');

    // Get cart from localStorage
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
        cart = [];
    }

    // Redirect if empty
    if (cart.length === 0) {
        // Option: Redirect to products or show message
        // For now, let's just show empty state or redirect
        // window.location.href = 'products.html'; // Uncomment to auto-redirect
        if (summaryTitle) summaryTitle.textContent = 'Đơn Hàng (0 sản phẩm)';
        if (container) container.innerHTML = '<p style="text-align:center; padding: 20px;">Giỏ hàng trống</p>';
        return;
    }

    // Update summary title
    let totalItems = 0;
    cart.forEach(item => totalItems += (parseInt(item.quantity) || 1));
    if (summaryTitle) summaryTitle.textContent = `Đơn Hàng (${totalItems} sản phẩm)`;

    // Calculate total and render items
    let totalPrice = 0;
    if (container) container.innerHTML = '';

    cart.forEach(item => {
        const quantity = parseInt(item.quantity) || 1;
        // Parse price
        const priceStr = item.price.replace(/[đ,.]/g, '');
        const price = parseInt(priceStr) || 0;
        totalPrice += price * quantity;

        const itemTotal = price * quantity;

        const html = `
            <div class="summary-item">
                <img src="${item.image}" alt="${item.name}" class="summary-item-image" onerror="this.src='../images/product-1.jpg'">
                <div class="summary-item-info">
                    <div class="summary-item-name">${item.name}</div>
                    <div class="summary-item-meta">SL: ${quantity}</div>
                    <div class="summary-item-price">${item.price}</div>
                </div>
            </div>
        `;
        if (container) container.innerHTML += html;
    });

    // Update totals
    const formattedTotal = totalPrice.toLocaleString('vi-VN') + 'đ';
    if (subtotalElement) subtotalElement.textContent = formattedTotal;
    if (totalElement) totalElement.textContent = formattedTotal;
}

// Run on page load
document.addEventListener('DOMContentLoaded', function () {
    updateHeaderAuth();
    loadCheckoutCart();

    // Handle Order Completion
    const completeOrderBtn = document.getElementById('completeOrderBtn');
    if (completeOrderBtn) {
        completeOrderBtn.addEventListener('click', function () {
            // In a real app, we would validate the form here
            // const form = document.querySelector('form');
            // if (!form.checkValidity()) {
            //     form.reportValidity();
            //     return;
            // }

            alert('Đã đặt hàng thành công! Cảm ơn bạn đã mua sắm tại Phuong 2Hand.');
            localStorage.removeItem('cart');
            window.location.href = '../index.html';
        });
    }
});

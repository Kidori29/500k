// Kiểm tra trạng thái đăng nhập và cập nhật header
function updateHeaderAuth() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const username = sessionStorage.getItem('username');

    if (isLoggedIn === 'true' && username) {
        // Lấy tên từ email (phần trước @)
        const displayName = username.split('@')[0];

        // Tìm phần auth trên header
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

// Hàm đăng xuất
function logout() {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username');
    localStorage.removeItem('cart'); // Xóa giỏ hàng khi đăng xuất
    window.location.href = '../index.html';
}

// Tải sản phẩm trong giỏ hàng để thanh toán
function loadCheckoutCart() {
    const container = document.getElementById('checkoutItemsContainer');
    const subtotalElement = document.getElementById('checkoutSubtotal');
    const totalElement = document.getElementById('checkoutTotal');
    const summaryTitle = document.getElementById('checkoutSummaryTitle');

    // Lấy giỏ hàng từ localStorage
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
        cart = [];
    }

    // Chuyển hướng nếu giỏ hàng trống
    if (cart.length === 0) {

        if (summaryTitle) summaryTitle.textContent = 'Đơn Hàng (0 sản phẩm)';
        if (container) container.innerHTML = '<p style="text-align:center; padding: 20px;">Giỏ hàng trống</p>';
        return;
    }

    // Cập nhật tiêu đề tóm tắt
    let totalItems = 0;
    cart.forEach(item => totalItems += (parseInt(item.quantity) || 1));
    if (summaryTitle) summaryTitle.textContent = `Đơn Hàng (${totalItems} sản phẩm)`;

    // Tính tổng tiền và hiển thị sản phẩm
    let totalPrice = 0;
    if (container) container.innerHTML = '';

    cart.forEach(item => {
        const quantity = parseInt(item.quantity) || 1;
        // Phân tích giá
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

    // Cập nhật tổng tiền
    const formattedTotal = totalPrice.toLocaleString('vi-VN') + 'đ';
    if (subtotalElement) subtotalElement.textContent = formattedTotal;
    if (totalElement) totalElement.textContent = formattedTotal;
}

// Chạy khi tải trang
document.addEventListener('DOMContentLoaded', function () {
    updateHeaderAuth();
    loadCheckoutCart();

    // Xử lý hoàn tất đơn hàng
    const completeOrderBtn = document.getElementById('completeOrderBtn');
    if (completeOrderBtn) {
        completeOrderBtn.addEventListener('click', function () {


            alert('Đã đặt hàng thành công! Cảm ơn bạn đã mua sắm tại Phuong 2Hand.');
            localStorage.removeItem('cart');
            window.location.href = '../index.html';
        });
    }
});

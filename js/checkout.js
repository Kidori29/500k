// ==========================================
// QUẢN LÝ THANH TOÁN - Checkout Management
// ==========================================
// File này xử lý:
// - Hiển thị thông tin đơn hàng từ giỏ hàng
// - Quản lý header authentication
// - Xử lý hoàn tất đơn hàng

/**
 * Kiểm tra trạng thái đăng nhập và cập nhật header
 * Hiển thị tên người dùng và nút đăng xuất nếu đã đăng nhập
 */
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

/**
 * Hàm đăng xuất
 * Xóa thông tin đăng nhập và giỏ hàng, sau đó chuyển về trang chủ
 */
function logout() {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username');
    localStorage.removeItem('cart'); // Xóa giỏ hàng khi đăng xuất
    window.location.href = '../index.html';
}

/**
 * Tải sản phẩm trong giỏ hàng để hiển thị trong trang thanh toán
 * Tính tổng tiền và hiển thị danh sách sản phẩm
 */
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

// ==========================================
// KHỞI TẠO KHI TẢI TRANG
// ==========================================
document.addEventListener('DOMContentLoaded', function () {
    // Cập nhật header và tải giỏ hàng
    updateHeaderAuth();
    loadCheckoutCart();

    // Xử lý hoàn tất đơn hàng
    const completeOrderBtn = document.getElementById('completeOrderBtn');
    if (completeOrderBtn) {
        completeOrderBtn.addEventListener('click', function () {
            // Lấy form data để validate
            const email = document.getElementById('email')?.value.trim();
            const fullname = document.getElementById('fullname')?.value.trim();
            const phone = document.getElementById('phone')?.value.trim();
            const address = document.getElementById('address')?.value.trim();
            const city = document.getElementById('city')?.value;
            const district = document.getElementById('district')?.value;

            // Validate form
            if (!email || !fullname || !phone || !address || !city || !district) {
                alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Email không hợp lệ!');
                return;
            }

            // Validate phone (chỉ số, 10-11 chữ số)
            const phoneRegex = /^[0-9]{10,11}$/;
            if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
                alert('Số điện thoại không hợp lệ!');
                return;
            }

            // Kiểm tra giỏ hàng không trống
            let cart = [];
            try {
                cart = JSON.parse(localStorage.getItem('cart')) || [];
            } catch (e) {
                cart = [];
            }

            if (cart.length === 0) {
                alert('Giỏ hàng của bạn đang trống!');
                window.location.href = 'cart.html';
                return;
            }

            // Hiển thị thông báo thành công
            alert('Đã đặt hàng thành công! Cảm ơn bạn đã mua sắm tại Phuong 2Hand.');
            
            // Xóa giỏ hàng và chuyển về trang chủ
            localStorage.removeItem('cart');
            window.location.href = '../index.html';
        });
    }
});

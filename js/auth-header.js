// Quản lý header authentication
// Xử lý hiển thị thông tin user và nút đăng xuất

// Cập nhật header với thông tin người dùng
function updateHeaderAuth() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const username = sessionStorage.getItem('username');
    const headerAuthSection = document.getElementById('headerAuthSection');

    if (!headerAuthSection)
        return;

    if (isLoggedIn === 'true' && username) {
        // Lấy tên hiển thị
        const displayName = username.split('@')[0];

        // Xác định đường dẫn tương đối
        const isIndexPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
        const basePath = isIndexPage ? './' : '../';

        // Lưu lại nút giỏ hàng nếu có
        let cartBtnHTML = '';
        const existingCartBtn = headerAuthSection.querySelector('.cart-btn-wrapper');
        if (existingCartBtn)
            cartBtnHTML = existingCartBtn.outerHTML;

        // Lấy thông tin nút hành động từ data attributes
        const actionText = headerAuthSection.dataset.actionText;
        const actionLink = headerAuthSection.dataset.actionLink;
        const actionIcon = headerAuthSection.dataset.actionIcon || 'arrow_back';

        let actionBtnHTML = '';
        if (actionText && actionLink) {
            actionBtnHTML = `
                <a href="${actionLink}" class="btn btn-secondary" style="margin-right: 16px;">
                    <span class="material-symbols-outlined">${actionIcon}</span>
                    ${actionText}
                </a>
             `;
        }

        // Render HTML
        headerAuthSection.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; margin-right: 16px; height: 48px;">
                <span class="material-symbols-outlined" style="font-size: 24px; color: var(--color-vintage-brown); display: flex;">person</span>
                <span style="font-family: var(--font-display); font-weight: 700; font-size: 18px; color: var(--color-vintage-brown); padding-top: 2px;">${displayName}</span>
            </div>
            ${actionBtnHTML}
            <button onclick="logout()" class="btn btn-secondary" style="margin-right: ${cartBtnHTML ? '16px' : '0'}">
                <span class="material-symbols-outlined">logout</span>
                Đăng xuất
            </button>
            ${cartBtnHTML}
        `;
    }
}

// Hàm đăng xuất toàn cục
function logout() {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username');
    localStorage.removeItem('cart');

    // Redirect về trang chủ
    const isIndexPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
    const targetPath = isIndexPage ? 'index.html' : '../index.html';

    window.location.href = targetPath;
}

// Cập nhật badge giỏ hàng
function updateCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    if (!cartBadge)
        return;

    // Lấy dữ liệu giỏ hàng
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
    }
    catch (e) {
        cart = [];
    }

    // Tính tổng số lượng sản phẩm
    let totalItems = 0;
    if (Array.isArray(cart)) {
        totalItems = cart.reduce((sum, item) => {
            return sum + (parseInt(item.quantity) || 1);
        }, 0);
    }

    // Cập nhật badge
    if (totalItems > 0) {
        cartBadge.textContent = totalItems;
        cartBadge.classList.remove('hidden');
    }
    else {
        cartBadge.classList.add('hidden');
    }
}

// Khởi tạo khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    updateHeaderAuth();
    updateCartBadge();
});

// Cập nhật badge khi storage thay đổi
window.addEventListener('storage', updateCartBadge);

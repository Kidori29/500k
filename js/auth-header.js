// ==========================================
// QUẢN LÝ HEADER AUTHENTICATION
// ==========================================
// File này xử lý hiển thị thông tin User và nút đăng xuất
// Đồng bộ trên tất cả các trang của website

/**
 * Cập nhật header với thông tin người dùng đã đăng nhập
 * Hiển thị tên người dùng và nút đăng xuất nếu đã đăng nhập
 */
function updateHeaderAuth() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const username = sessionStorage.getItem('username');
    const headerAuthSection = document.getElementById('headerAuthSection');

    if (!headerAuthSection) return;

    if (isLoggedIn === 'true' && username) {
        // Lấy tên hiển thị
        const displayName = username.split('@')[0];

        // Xác định đường dẫn tương đối cho nút đăng xuất/về trang chủ
        // Nếu đang ở trang index (root) thì không cần ../
        const isIndexPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
        const basePath = isIndexPage ? './' : '../';

        // Lưu lại nút giỏ hàng nếu có (để append lại sau nút đăng xuất)
        let cartBtnHTML = '';
        const existingCartBtn = headerAuthSection.querySelector('.cart-btn-wrapper');
        if (existingCartBtn) {
            cartBtnHTML = existingCartBtn.outerHTML;
        }

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

        // Render HTML chuẩn
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

/**
 * Hàm đăng xuất toàn cục
 * Xóa thông tin đăng nhập, giỏ hàng và chuyển về trang chủ
 */
function logout() {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username');
    localStorage.removeItem('cart'); // Xóa giỏ hàng khi đăng xuất

    // Redirect về trang chủ
    const isIndexPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
    const targetPath = isIndexPage ? 'index.html' : '../index.html';

    window.location.href = targetPath;
}

/**
 * Cập nhật badge giỏ hàng với số lượng từ localStorage
 * Hiển thị số lượng sản phẩm trong giỏ hàng trên badge
 */
function updateCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    if (!cartBadge) return;

    // Lấy dữ liệu giỏ hàng từ localStorage
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
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
    } else {
        cartBadge.classList.add('hidden');
    }
}

// ==========================================
// KHỞI TẠO KHI TẢI TRANG
// ==========================================
// Tự động cập nhật header và badge khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
    updateHeaderAuth();
    updateCartBadge();
});

// Cập nhật badge khi storage thay đổi (nếu thêm sản phẩm từ tab khác)
window.addEventListener('storage', updateCartBadge);

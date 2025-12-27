// AUTH HEADER MANAGER
// Xử lý hiển thị thông tin User và Nút đăng xuất đồng bộ trên tất cả các trang

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

        // Render HTML chuẩn
        headerAuthSection.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; margin-right: 16px; height: 48px;">
                <span class="material-symbols-outlined" style="font-size: 24px; color: var(--color-vintage-brown); display: flex;">person</span>
                <span style="font-family: var(--font-display); font-weight: 700; font-size: 18px; color: var(--color-vintage-brown); padding-top: 2px;">${displayName}</span>
            </div>
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
    localStorage.removeItem('cart'); // Xóa giỏ hàng khi đăng xuất

    // Redirect về trang chủ
    const isIndexPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
    const targetPath = isIndexPage ? 'index.html' : '../index.html';

    window.location.href = targetPath;
}

// Tự động chạy khi load trang
document.addEventListener('DOMContentLoaded', updateHeaderAuth);

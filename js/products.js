// Cập nhật badge giỏ hàng với số lượng từ localStorage
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
            // Giữ lại badge giỏ hàng
            const cartBadgeHTML = headerAuthSection.querySelector('.cart-btn-wrapper').outerHTML;

            headerAuthSection.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px; margin-right: 16px; height: 48px;">
                    <span class="material-symbols-outlined" style="font-size: 24px; color: var(--color-vintage-brown); display: flex;">person</span>
                    <span style="font-family: var(--font-display); font-weight: 700; font-size: 18px; color: var(--color-vintage-brown); padding-top: 2px;">${displayName}</span>
                </div>
                <button onclick="logout()" class="btn btn-secondary">
                    <span class="material-symbols-outlined">logout</span>
                    Đăng xuất
                </button>
                ${cartBadgeHTML}
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

// Hàm thêm vào giỏ hàng
function addToCart(productName, productPrice, productImage) {
    // Lấy giỏ hàng hiện tại
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
        cart = [];
    }

    // Kiểm tra nếu sản phẩm đã tồn tại
    const existingProductIndex = cart.findIndex(item => item.name === productName);

    if (existingProductIndex !== -1) {
        // Tăng số lượng
        cart[existingProductIndex].quantity = (parseInt(cart[existingProductIndex].quantity) || 1) + 1;
    } else {
        // Thêm sản phẩm mới
        cart.push({
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    }

    // Lưu vào localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Cập nhật badge
    updateCartBadge();
}

// Thêm sự kiện và khởi tạo khi tải trang
document.addEventListener('DOMContentLoaded', function () {
    // Khởi tạo header và badge giỏ hàng
    updateHeaderAuth();
    updateCartBadge();

    // Thêm sự kiện cho tất cả nút "Thêm vào giỏ"
    const addToCartButtons = document.querySelectorAll('.btn-primary');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            // Lấy thông tin sản phẩm từ thẻ cha
            const productCard = this.closest('.product-card');
            if (!productCard) return;

            const productName = productCard.querySelector('.product-name')?.textContent || 'Sản phẩm';
            const productPrice = productCard.querySelector('.product-price')?.textContent || '0đ';
            const productImage = productCard.querySelector('.product-image')?.src || '';

            // Thêm vào giỏ hàng
            addToCart(productName, productPrice, productImage);
        });
    });
});

// Cập nhật khi storage thay đổi (nếu thêm sản phẩm từ tab khác)
window.addEventListener('storage', updateCartBadge);
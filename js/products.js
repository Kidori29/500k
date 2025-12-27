// ==========================================
// QUẢN LÝ SẢN PHẨM - Products Management
// ==========================================
// File này xử lý:
// - Cập nhật badge số lượng giỏ hàng
// - Thêm sản phẩm vào giỏ hàng
// - Quản lý header authentication




/**
 * Hàm thêm sản phẩm vào giỏ hàng
 * Nếu sản phẩm đã tồn tại, tăng số lượng; nếu chưa, thêm mới
 * @param {string} productName - Tên sản phẩm
 * @param {string} productPrice - Giá sản phẩm (định dạng: "XXX,000đ")
 * @param {string} productImage - Đường dẫn ảnh sản phẩm
 */
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

// ==========================================
// KHỞI TẠO KHI TẢI TRANG
// ==========================================
document.addEventListener('DOMContentLoaded', function () {
    // Khởi tạo header và badge giỏ hàng
    // Khởi tạo header và badge giỏ hàng được xử lý bởi auth-header.js

    // Thêm sự kiện cho tất cả nút "Thêm vào giỏ"
    // Tìm tất cả nút có class btn-primary trong product-card
    const addToCartButtons = document.querySelectorAll('.product-card .btn-primary');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            // Lấy thông tin sản phẩm từ thẻ cha (product-card)
            const productCard = this.closest('.product-card');
            if (!productCard) return;

            // Trích xuất thông tin sản phẩm
            const productName = productCard.querySelector('.product-name')?.textContent || 'Sản phẩm';
            const productPrice = productCard.querySelector('.product-price')?.textContent || '0đ';
            const productImage = productCard.querySelector('.product-image')?.src || '';

            // Thêm vào giỏ hàng
            addToCart(productName, productPrice, productImage);

            // Hiển thị thông báo thành công (tùy chọn)
            // Có thể thêm toast notification ở đây
        });
    });
});



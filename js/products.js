// Quản lý sản phẩm
// Thêm sản phẩm vào giỏ hàng

// Thêm sản phẩm vào giỏ hàng
function addToCart(productName, productPrice, productImage) {
    // Lấy giỏ hàng hiện tại
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
    }
    catch (e) {
        cart = [];
    }

    // Kiểm tra sản phẩm đã tồn tại
    const existingProductIndex = cart.findIndex(item => item.name === productName);

    if (existingProductIndex !== -1) {
        // Tăng số lượng
        cart[existingProductIndex].quantity = (parseInt(cart[existingProductIndex].quantity) || 1) + 1;
    }
    else {
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

// Khởi tạo khi tải trang
document.addEventListener('DOMContentLoaded', function () {
    // Thêm sự kiện cho tất cả nút "Thêm vào giỏ"
    const addToCartButtons = document.querySelectorAll('.product-card .btn-primary');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            // Lấy thông tin sản phẩm
            const productCard = this.closest('.product-card');
            if (!productCard)
                return;

            const productName = productCard.querySelector('.product-name')?.textContent || 'Sản phẩm';
            const productPrice = productCard.querySelector('.product-price')?.textContent || '0đ';
            const productImage = productCard.querySelector('.product-image')?.src || '';

            // Thêm vào giỏ hàng
            addToCart(productName, productPrice, productImage);
        });
    });
});

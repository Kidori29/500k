// Quản lý giỏ hàng
// Xử lý hiển thị, cập nhật, xóa sản phẩm trong giỏ hàng

// Tải và hiển thị sản phẩm từ localStorage
function loadCart() {
    const container = document.getElementById('cartItemsContainer');
    const summaryTotal = document.getElementById('summaryTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // Lấy giỏ hàng
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
    }
    catch (e) {
        cart = [];
    }

    // Xóa nội dung container
    container.innerHTML = '';

    // Nếu giỏ hàng trống
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
        if (checkoutBtn)
            checkoutBtn.disabled = true;
        return;
    }

    // Kích hoạt nút thanh toán
    if (checkoutBtn)
        checkoutBtn.disabled = false;

    // Hiển thị sản phẩm
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

    // Cập nhật tổng tiền
    updateCartTotal();
}

// Cập nhật tổng tiền
function updateCartTotal() {
    const summaryTotal = document.getElementById('summaryTotal');
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
    }
    catch (e) {
        cart = [];
    }

    let totalPrice = 0;
    cart.forEach(item => {
        const quantity = parseInt(item.quantity) || 1;
        const priceStr = item.price.replace(/[đ,.]/g, '');
        const price = parseInt(priceStr) || 0;
        totalPrice += price * quantity;
    });

    if (summaryTotal)
        summaryTotal.textContent = totalPrice.toLocaleString('vi-VN') + 'đ';
}

// Xóa sản phẩm khỏi giỏ hàng
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));

    // Nếu giỏ hàng trống
    if (cart.length === 0) {
        loadCart();
        return;
    }

    // Xóa phần tử khỏi DOM
    const container = document.getElementById('cartItemsContainer');
    const items = container.querySelectorAll('.cart-item');

    if (items[index])
        items[index].remove();

    // Đánh lại chỉ số
    const remainingItems = container.querySelectorAll('.cart-item');
    remainingItems.forEach((item, newIndex) => {
        item.dataset.index = newIndex;

        const qtySpan = item.querySelector('.quantity-value');
        if (qtySpan)
            qtySpan.id = `qty-${newIndex}`;

        const removeBtn = item.querySelector('.remove-btn');
        if (removeBtn)
            removeBtn.setAttribute('onclick', `removeItem(${newIndex})`);

        const qtyBtns = item.querySelectorAll('.quantity-btn');
        if (qtyBtns.length >= 2) {
            qtyBtns[0].setAttribute('onclick', `decreaseQuantity(${newIndex})`);
            qtyBtns[1].setAttribute('onclick', `increaseQuantity(${newIndex})`);
        }
    });

    updateCartTotal();
}

// Tăng số lượng sản phẩm
function increaseQuantity(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart[index].quantity = (parseInt(cart[index].quantity) || 1) + 1;
    localStorage.setItem('cart', JSON.stringify(cart));

    const qtyElement = document.getElementById(`qty-${index}`);
    if (qtyElement)
        qtyElement.textContent = cart[index].quantity;

    updateCartTotal();
}

// Giảm số lượng sản phẩm
function decreaseQuantity(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const currentQty = parseInt(cart[index].quantity) || 1;

    if (currentQty > 1) {
        cart[index].quantity = currentQty - 1;
        localStorage.setItem('cart', JSON.stringify(cart));

        const qtyElement = document.getElementById(`qty-${index}`);
        if (qtyElement)
            qtyElement.textContent = cart[index].quantity;

        updateCartTotal();
    }
    else {
        removeItem(index);
    }
}

// Khởi tạo khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    loadCart();

    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (!checkoutBtn.disabled)
                window.location.href = 'checkout.html';
        });
    }
});
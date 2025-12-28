// Quản lý trang thanh toán
// Hiển thị đơn hàng, xử lý thanh toán và tạo hóa đơn

// Tải sản phẩm trong giỏ hàng
function loadCheckoutCart() {
    const container = document.getElementById('checkoutItemsContainer');
    const subtotalElement = document.getElementById('checkoutSubtotal');
    const totalElement = document.getElementById('checkoutTotal');
    const summaryTitle = document.getElementById('checkoutSummaryTitle');

    // Lấy giỏ hàng
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
    }
    catch (e) {
        cart = [];
    }

    // Chuyển hướng nếu giỏ hàng trống
    if (cart.length === 0) {
        if (summaryTitle)
            summaryTitle.textContent = 'Đơn Hàng (0 sản phẩm)';
        if (container)
            container.innerHTML = '<p style="text-align:center; padding: 20px;">Giỏ hàng trống</p>';
        return;
    }

    // Cập nhật tiêu đề
    let totalItems = 0;
    cart.forEach(item => totalItems += (parseInt(item.quantity) || 1));
    if (summaryTitle)
        summaryTitle.textContent = `Đơn Hàng (${totalItems} sản phẩm)`;

    // Tính tổng tiền và hiển thị sản phẩm
    let totalPrice = 0;
    if (container)
        container.innerHTML = '';

    cart.forEach(item => {
        const quantity = parseInt(item.quantity) || 1;
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
        if (container)
            container.innerHTML += html;
    });

    // Cập nhật tổng tiền
    const formattedTotal = totalPrice.toLocaleString('vi-VN') + 'đ';
    if (subtotalElement)
        subtotalElement.textContent = formattedTotal;
    if (totalElement)
        totalElement.textContent = formattedTotal;
}

// Hiển thị hóa đơn sau khi thanh toán
function showBill(orderData) {
    // Tính tổng tiền
    let totalPrice = 0;
    orderData.cart.forEach(item => {
        const quantity = parseInt(item.quantity) || 1;
        const priceStr = item.price.replace(/[đ,.]/g, '');
        const price = parseInt(priceStr) || 0;
        totalPrice += price * quantity;
    });

    // Lấy tên thành phố và quận
    const citySelect = document.getElementById('city');
    const districtSelect = document.getElementById('district');
    const cityName = citySelect?.options[citySelect.selectedIndex]?.text || orderData.city;
    const districtName = districtSelect?.options[districtSelect.selectedIndex]?.text || orderData.district;

    // Tên phương thức thanh toán
    const paymentMethodName = orderData.paymentMethod === 'cod'
        ? 'Thanh toán khi nhận hàng (COD)'
        : 'Chuyển khoản ngân hàng';

    // Tạo HTML hóa đơn
    const billHTML = `
        <div class="bill-modal-overlay" id="billModal">
            <div class="bill-modal">
                <div class="bill-header">
                    <div class="bill-logo-section">
                        <img src="../images/logo.jpg" alt="Logo" class="bill-logo">
                        <div class="bill-shop-name">PHUONG<span class="bill-shop-name-accent">.2HAND</span></div>
                    </div>
                    <div class="bill-order-info">
                        <div class="bill-title">HÓA ĐƠN BÁN HÀNG</div>
                        <div class="bill-date">Ngày: ${new Date().toLocaleDateString('vi-VN')}</div>
                        <div class="bill-time">Giờ: ${new Date().toLocaleTimeString('vi-VN')}</div>
                    </div>
                </div>

                <div class="bill-content">
                    <div class="bill-section">
                        <h3 class="bill-section-title">Thông tin khách hàng</h3>
                        <div class="bill-info-row">
                            <span class="bill-label">Họ tên:</span>
                            <span class="bill-value">${orderData.fullname}</span>
                        </div>
                        <div class="bill-info-row">
                            <span class="bill-label">Email:</span>
                            <span class="bill-value">${orderData.email}</span>
                        </div>
                        <div class="bill-info-row">
                            <span class="bill-label">SĐT:</span>
                            <span class="bill-value">${orderData.phone}</span>
                        </div>
                        <div class="bill-info-row">
                            <span class="bill-label">Địa chỉ:</span>
                            <span class="bill-value">${orderData.address}, ${districtName}, ${cityName}</span>
                        </div>
                    </div>

                    <div class="bill-section">
                        <h3 class="bill-section-title">Sản phẩm</h3>
                        <div class="bill-items">
                            ${orderData.cart.map(item => {
        const quantity = parseInt(item.quantity) || 1;
        const priceStr = item.price.replace(/[đ,.]/g, '');
        const price = parseInt(priceStr) || 0;
        const itemTotal = price * quantity;
        return `
                                    <div class="bill-item">
                                        <div class="bill-item-info">
                                            <div class="bill-item-name">${item.name}</div>
                                            <div class="bill-item-meta">SL: ${quantity} × ${item.price}</div>
                                        </div>
                                        <div class="bill-item-total">${itemTotal.toLocaleString('vi-VN')}đ</div>
                                    </div>
                                `;
    }).join('')}
                        </div>
                    </div>

                    <div class="bill-section">
                        <div class="bill-summary-row">
                            <span class="bill-label">Tạm tính:</span>
                            <span class="bill-value">${totalPrice.toLocaleString('vi-VN')}đ</span>
                        </div>
                        <div class="bill-summary-row">
                            <span class="bill-label">Phí vận chuyển:</span>
                            <span class="bill-value" style="color: var(--color-primary);">Miễn phí</span>
                        </div>
                        <div class="bill-summary-row bill-total">
                            <span class="bill-label">Tổng cộng:</span>
                            <span class="bill-value">${totalPrice.toLocaleString('vi-VN')}đ</span>
                        </div>
                    </div>

                    <div class="bill-section">
                        <div class="bill-info-row">
                            <span class="bill-label">Phương thức thanh toán:</span>
                            <span class="bill-value">${paymentMethodName}</span>
                        </div>
                        ${orderData.note ? `
                            <div class="bill-info-row">
                                <span class="bill-label">Ghi chú:</span>
                                <span class="bill-value">${orderData.note}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>

                <div class="bill-footer">
                    <div class="bill-thank-you">Cảm ơn bạn đã mua sắm tại Phuong 2Hand!</div>
                    <div class="bill-actions">
                        <button class="btn btn-primary" onclick="closeBill()">
                            <span class="material-symbols-outlined">check_circle</span>
                            Hoàn tất
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Thêm hóa đơn vào body
    document.body.insertAdjacentHTML('beforeend', billHTML);

    // Hiển thị modal
    setTimeout(() => {
        const modal = document.getElementById('billModal');
        if (modal)
            modal.classList.add('show');
    }, 10);
}

// Đóng hóa đơn
function closeBill() {
    const modal = document.getElementById('billModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
            localStorage.removeItem('cart');
            window.location.href = '../index.html';
        }, 300);
    }
}

// Khởi tạo khi tải trang
document.addEventListener('DOMContentLoaded', function () {
    loadCheckoutCart();

    const completeOrderBtn = document.getElementById('completeOrderBtn');
    if (completeOrderBtn) {
        completeOrderBtn.addEventListener('click', function () {
            // Lấy form data
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

            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Email không hợp lệ!');
                return;
            }

            // Validate phone
            const phoneRegex = /^[0-9]{10,11}$/;
            if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
                alert('Số điện thoại không hợp lệ!');
                return;
            }

            // Kiểm tra giỏ hàng
            let cart = [];
            try {
                cart = JSON.parse(localStorage.getItem('cart')) || [];
            }
            catch (e) {
                cart = [];
            }

            if (cart.length === 0) {
                alert('Giỏ hàng của bạn đang trống!');
                window.location.href = 'cart.html';
                return;
            }

            // Lấy thông tin thanh toán
            const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'cod';
            const note = document.getElementById('note')?.value.trim() || '';

            // Hiển thị hóa đơn
            showBill({
                email,
                fullname,
                phone,
                address,
                city,
                district,
                paymentMethod,
                note,
                cart
            });
        });
    }
});

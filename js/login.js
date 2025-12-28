// Thông tin đăng nhập hợp lệ
const validCredentials = [
    { username: 'admin@admin.com', password: 'admin' },
    { username: 'phuong123', password: '123' }
];

// Khởi tạo form đăng nhập
/**
 * Xử lý toggle password visibility và submit form
 */
function initLoginForm() {
    const loginForm = document.querySelector('.login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.querySelector('.toggle-password');

    if (!loginForm)
        return;

    // Ẩn/hiện mật khẩu
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;

            const icon = togglePasswordBtn.querySelector('.material-symbols-outlined');
            icon.textContent = type === 'password' ? 'visibility' : 'visibility_off';
        });
    }

    // Xử lý submit form
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Lấy giá trị input
        const username = emailInput.value.trim();
        const password = passwordInput.value;

        // Xác thực thông tin
        const isValid = validCredentials.some(
            cred => cred.username === username && cred.password === password
        );

        if (isValid) {
            // Hiệu ứng thành công
            showMessage('Đăng nhập thành công!', 'success');

            // Lưu trạng thái đăng nhập
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('username', username);

            // Kiểm tra URL chuyển hướng
            const redirectUrl = sessionStorage.getItem('redirectAfterLogin');

            // Chuyển hướng sau độ trễ
            setTimeout(() => {
                if (redirectUrl) {
                    // Xóa URL chuyển hướng
                    sessionStorage.removeItem('redirectAfterLogin');
                    // Chuyển hướng về trang gốc
                    window.location.href = redirectUrl;
                }
                else {
                    // Mặc định về trang chủ
                    window.location.href = '../index.html';
                }
            }, 1000);
        }
        else {
            // Hiệu ứng lỗi
            showMessage('Tên đăng nhập hoặc mật khẩu không đúng!', 'error');

            // Hiệu ứng rung
            loginForm.style.animation = 'shake 0.5s';
            setTimeout(() => {
                loginForm.style.animation = '';
            }, 50);
        }
    });

    // Thêm animation rung vào CSS nếu chưa có
    if (!document.querySelector('#shake-animation')) {
        const style = document.createElement('style');
        style.id = 'shake-animation';
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
                20%, 40%, 60%, 80% { transform: translateX(10px); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Hiển thị thông báo
/**
 * Hiển thị thông báo toast notification
 * @param {string} message - Nội dung thông báo
 * @param {string} type - Loại thông báo: 'success' hoặc 'error'
 */
function showMessage(message, type) {
    // Xóa tin nhắn hiện tại
    const existingMessage = document.querySelector('.login-message');
    if (existingMessage)
        existingMessage.remove();

    // Tạo element tin nhắn
    const messageDiv = document.createElement('div');
    messageDiv.className = `login-message login-message-${type}`;
    messageDiv.textContent = message;

    // Style cho tin nhắn
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 14px;
        z-index: 10000;
        animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 2.7s;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;

    if (type === 'success') {
        messageDiv.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        messageDiv.style.color = 'white';
    }
    else {
        messageDiv.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
        messageDiv.style.color = 'white';
    }

    document.body.appendChild(messageDiv);

    // Thêm animation
    if (!document.querySelector('#message-animations')) {
        const style = document.createElement('style');
        style.id = 'message-animations';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Xóa sau khi chạy animation
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Khởi tạo khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    initLoginForm();
});
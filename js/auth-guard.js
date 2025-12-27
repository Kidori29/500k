// ==========================================
// AUTH GUARD - Bảo vệ các trang yêu cầu đăng nhập
// ==========================================
// File này bảo vệ các trang yêu cầu đăng nhập
// Tự động chuyển hướng về trang login nếu chưa đăng nhập

(function () {
    'use strict';

    /**
     * Kiểm tra trạng thái đăng nhập
     * @returns {boolean} - true nếu đã đăng nhập, false nếu chưa
     */
    function checkAuth() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        const username = sessionStorage.getItem('username');

        // Nếu chưa đăng nhập
        if (!isLoggedIn || isLoggedIn !== 'true' || !username) {
            // Lưu URL hiện tại để redirect lại sau khi đăng nhập
            const currentPage = window.location.pathname;
            sessionStorage.setItem('redirectAfterLogin', currentPage);

            // Hiển thị thông báo
            showAuthRequired();

            // Chuyển hướng về trang đăng nhập sau 2 giây
            setTimeout(() => {
                window.location.href = '../pages/login.html';
            }, 2000);

            return false;
        }

        return true;
    }

    /**
     * Hiển thị thông báo yêu cầu đăng nhập
     * Tạo modal overlay với thông báo và tự động chuyển hướng
     */
    function showAuthRequired() {
        // Tạo overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        `;

        // Tạo modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            padding: 48px;
            border-radius: 24px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
            text-align: center;
            max-width: 400px;
            border: 2px solid rgba(240, 140, 160, 0.2);
            animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        `;

        modal.innerHTML = `
            <div style="
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, rgba(240, 140, 160, 0.1) 0%, rgba(240, 140, 160, 0.2) 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 24px;
            ">
                <span class="material-symbols-outlined" style="font-size: 48px; color: #F08CA0;">lock</span>
            </div>
            <h2 style="
                font-family: 'Comfortaa', cursive;
                font-size: 28px;
                font-weight: 700;
                color: #5D4037;
                margin-bottom: 12px;
            ">Yêu cầu đăng nhập</h2>
            <p style="
                font-size: 16px;
                color: #8D6E63;
                margin-bottom: 24px;
                line-height: 1.6;
            ">
                Bạn cần đăng nhập để truy cập trang này.<br>
                Đang chuyển hướng đến trang đăng nhập...
            </p>
            <div style="
                display: inline-block;
                padding: 12px 24px;
                background: linear-gradient(135deg, #F08CA0 0%, #E87A95 100%);
                color: white;
                border-radius: 12px;
                font-weight: 600;
                animation: pulse 2s ease-in-out infinite;
            ">
                <span class="material-symbols-outlined" style="font-size: 20px; vertical-align: middle;">schedule</span>
                Đợi trong giây lát...
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Thêm animations
        if (!document.querySelector('#auth-guard-animations')) {
            const style = document.createElement('style');
            style.id = 'auth-guard-animations';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from {
                        transform: scale(0.8);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // ==========================================
    // KHỞI TẠO KHI TẢI TRANG
    // ==========================================
    // Kiểm tra authentication khi DOM đã load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            checkAuth();
        });
    } else {
        checkAuth();
    }

})();
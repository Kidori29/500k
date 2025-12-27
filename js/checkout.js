// Check login status and update header
function updateHeaderAuth() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const username = sessionStorage.getItem('username');

    if (isLoggedIn === 'true' && username) {
        // Extract name from email (part before @)
        const displayName = username.split('@')[0];

        // Find the header auth section
        const headerAuthSection = document.getElementById('headerAuthSection');
        if (headerAuthSection) {
            headerAuthSection.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px; margin-right: 24px; height: 48px;">
                    <span class="material-symbols-outlined" style="font-size: 24px; color: var(--color-vintage-brown); display: flex;">person</span>
                    <span style="font-family: var(--font-display); font-weight: 700; font-size: 18px; color: var(--color-vintage-brown); padding-top: 2px;">${displayName}</span>
                </div>
                <button onclick="logout()" class="btn btn-secondary">
                    <span class="material-symbols-outlined">logout</span>
                    Đăng xuất
                </button>
            `;
        }
    }
}

// Logout function
function logout() {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username');
    localStorage.removeItem('cart'); // Xóa giỏ hàng khi đăng xuất
    window.location.href = '../index.html';
}

// Run on page load
document.addEventListener('DOMContentLoaded', function () {
    updateHeaderAuth();
});

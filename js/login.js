// Banner carousel data
const bannerSlides = [
    {
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDV-ff7XfJCnsqO9Z_NMf0VLUpr9c008zeLHeGmILperILaAAUTZDc-9aGjTBBfmJoQ788Ivapsza1uOMtAxTF_6m29k39jeqk9bDdJ9r8BQCHB-b7waJULJ0xznJt7D6RScvI9YJvg3FFgm6YkYMB-7yq1CjjNcA_0lb_O7Uj4mQWRiPqlrrVy8FxrmWfK5NHdmF9J3kxg0r3MhJolhDE5mQ6ch5BJ-HJmIrbp2J0r2YavyYDReLvSWUvKSVdjrp5SRZmv_bd8X7g',
        icon: 'auto_awesome',
        title: 'Khám phá phong cách của riêng bạn',
        text: 'Bộ sưu tập đồ Secondhand được tuyển chọn kỹ lượng, mang đến hơi thở cổ điển nhưng đầy hiện đại cho tủ đồ của bạn.'
    },
    {
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80',
        icon: 'favorite',
        title: 'Thời trang bền vững',
        text: 'Góp phần bảo vệ môi trường với những lựa chọn thời trang secondhand chất lượng cao, giảm thiểu rác thải dệt may.'
    },
    {
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80',
        icon: 'shopping_bag',
        title: 'Giá cả phải chăng',
        text: 'Sở hữu những món đồ vintage độc đáo với mức giá hợp lý, tiết kiệm nhưng vẫn thể hiện cá tính riêng.'
    }
];

// Valid login credentials
const validCredentials = [
    { username: 'admin@admin.com', password: 'admin' },
    { username: 'phuong123@gmail.com', password: '123' }
];

// State
let currentSlide = 0;
let autoPlayInterval;

// ==========================================
// BANNER CAROUSEL FUNCTIONALITY
// ==========================================

function initBannerCarousel() {
    const bannerImage = document.querySelector('.banner-image');
    const bannerIcon = document.querySelector('.banner-icon .material-symbols-outlined');
    const bannerTitle = document.querySelector('.banner-title');
    const bannerText = document.querySelector('.banner-text');
    const dots = document.querySelectorAll('.dot');

    if (!bannerImage || !bannerIcon || !bannerTitle || !bannerText) return;

    // Update slide content with fade animation
    function updateSlide(index) {
        const slide = bannerSlides[index];
        const bannerCard = document.querySelector('.banner-card');

        // Add fade out effect
        bannerCard.style.opacity = '0';
        bannerCard.style.transform = 'translateY(20px)';

        setTimeout(() => {
            // Update content
            bannerImage.style.backgroundImage = `url('${slide.image}')`;
            bannerIcon.textContent = slide.icon;
            bannerTitle.textContent = slide.title;
            bannerText.textContent = slide.text;

            // Update dots
            dots.forEach((dot, i) => {
                if (i === index) {
                    dot.classList.add('active');
                    dot.classList.remove('inactive');
                } else {
                    dot.classList.remove('active');
                    dot.classList.add('inactive');
                }
            });

            // Fade in
            setTimeout(() => {
                bannerCard.style.opacity = '1';
                bannerCard.style.transform = 'translateY(0)';
            }, 2);
        }, 300);
    }

    // Next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % bannerSlides.length;
        updateSlide(currentSlide);
    }

    // Previous slide
    function previousSlide() {
        currentSlide = (currentSlide - 1 + bannerSlides.length) % bannerSlides.length;
        updateSlide(currentSlide);
    }

    // Auto play
    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }

    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.style.cursor = 'pointer';
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlide(currentSlide);
            stopAutoPlay();
            startAutoPlay();
        });
    });

    // Banner hover - pause auto play
    const bannerSide = document.querySelector('.login-banner-side');
    if (bannerSide) {
        bannerSide.addEventListener('mouseenter', stopAutoPlay);
        bannerSide.addEventListener('mouseleave', startAutoPlay);
    }

    // Add smooth transition to banner card
    const bannerCard = document.querySelector('.banner-card');
    if (bannerCard) {
        bannerCard.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    }

    // Start auto play
    startAutoPlay();
}

// ==========================================
// LOGIN FORM FUNCTIONALITY
// ==========================================

function initLoginForm() {
    const loginForm = document.querySelector('.login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.querySelector('.toggle-password');

    if (!loginForm) return;

    // Toggle password visibility
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            
            const icon = togglePasswordBtn.querySelector('.material-symbols-outlined');
            icon.textContent = type === 'password' ? 'visibility' : 'visibility_off';
        });
    }

    // Form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get input values (using email field as username)
        const username = emailInput.value.trim();
        const password = passwordInput.value;

        // Validate credentials
        const isValid = validCredentials.some(
            cred => cred.username === username && cred.password === password
        );

        if (isValid) {
            // Success animation
            showMessage('Đăng nhập thành công!');
            
            // Store login state
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('username', username);

            // Redirect after delay
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1500);
        } else {
            // Error animation
            showMessage('Tên đăng nhập hoặc mật khẩu không đúng!', 'error');
            
            // Shake animation
            loginForm.style.animation = 'shake 0.5s';
            setTimeout(() => {
                loginForm.style.animation = '';
            }, 500);
        }
    });

    // Add shake animation to CSS if not exists
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

// ==========================================
// MESSAGE NOTIFICATION
// ==========================================

function showMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.login-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `login-message login-message-${type}`;
    messageDiv.textContent = message;
    
    // Style the message
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
    } else {
        messageDiv.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
        messageDiv.style.color = 'white';
    }

    document.body.appendChild(messageDiv);

    // Add animations
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

    // Remove after animation
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// ==========================================
// INITIALIZE ON PAGE LOAD
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initBannerCarousel();
    initLoginForm();
    
    console.log('🎨 Phuong 2Hand - Login page loaded');
    console.log('📝 Valid credentials:');
    console.log('   - admin / admin');
    console.log('   - phuong123 / 123');
});
// ==========================================
// CUSTOM SELECT - Dropdown tùy chỉnh
// ==========================================
// File này tạo dropdown tùy chỉnh thay thế cho thẻ <select> mặc định
// Để có UI đẹp hơn và nhất quán với design system

/**
 * Khởi tạo custom select cho tất cả thẻ select có class 'form-select'
 * Tạo wrapper, trigger và options tùy chỉnh
 */
document.addEventListener('DOMContentLoaded', function () {
    // Tìm tất cả thẻ select gốc có class 'form-select'
    const nativeSelects = document.querySelectorAll('.form-select');

    nativeSelects.forEach(select => {
        // Ẩn select gốc (vẫn giữ để submit form)
        select.style.display = 'none';

        // ==========================================
        // TẠO CẤU TRÚC CUSTOM SELECT
        // ==========================================
        
        // 1. Tạo Wrapper (container chính)
        const wrapper = document.createElement('div');
        wrapper.className = 'custom-select-wrapper';
        wrapper.classList.add('custom-select'); // Dùng để toggle trạng thái mở

        // 2. Tạo Trigger (nút hiển thị giá trị đã chọn)
        const trigger = document.createElement('div');
        trigger.className = 'custom-select-trigger';
        // Đặt văn bản ban đầu từ option đã chọn
        const selectedOption = select.options[select.selectedIndex];
        trigger.textContent = selectedOption ? selectedOption.textContent : select.options[0].textContent;

        // 3. Tạo Container chứa các tùy chọn (dropdown menu)
        const customOptions = document.createElement('div');
        customOptions.className = 'custom-options';

        // 4. Tạo các tùy chọn từ options của select gốc
        Array.from(select.options).forEach(option => {
            const customOption = document.createElement('span');
            customOption.className = 'custom-option';
            customOption.textContent = option.textContent;
            customOption.dataset.value = option.value;

            if (option.selected) {
                customOption.classList.add('selected');
            }

            // Xử lý khi click vào tùy chọn
            customOption.addEventListener('click', function () {
                // Xóa class selected khỏi tất cả options
                customOptions.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
                // Thêm class selected cho option được chọn
                this.classList.add('selected');

                // Cập nhật văn bản hiển thị trên trigger
                trigger.textContent = this.textContent;

                // Cập nhật giá trị của select gốc (để submit form)
                select.value = this.dataset.value;

                // Kích hoạt sự kiện 'change' trên select gốc (để các script khác có thể lắng nghe)
                select.dispatchEvent(new Event('change'));

                // Đóng dropdown sau khi chọn
                wrapper.classList.remove('open');
            });

            customOptions.appendChild(customOption);
        });

        // 5. Lắp ráp cấu trúc và chèn vào DOM
        wrapper.appendChild(trigger);
        wrapper.appendChild(customOptions);
        // Chèn wrapper ngay sau select gốc
        select.parentNode.insertBefore(wrapper, select.nextSibling);

        // 6. Xử lý click vào trigger (mở/đóng dropdown)
        trigger.addEventListener('click', function (e) {
            e.stopPropagation(); // Ngăn event bubble lên document
            
            // Đóng tất cả các select khác đang mở (chỉ mở một select tại một thời điểm)
            document.querySelectorAll('.custom-select').forEach(other => {
                if (other !== wrapper) other.classList.remove('open');
            });
            
            // Toggle trạng thái mở/đóng của select hiện tại
            wrapper.classList.toggle('open');
        });
    });

    // ==========================================
    // XỬ LÝ CLICK RA NGOÀI
    // ==========================================
    // Đóng tất cả dropdown khi click ra ngoài
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.custom-select')) {
            document.querySelectorAll('.custom-select').forEach(select => {
                select.classList.remove('open');
            });
        }
    });
});

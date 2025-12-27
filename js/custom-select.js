document.addEventListener('DOMContentLoaded', function () {
    // Tìm tất cả thẻ select gốc có class 'form-select'
    const nativeSelects = document.querySelectorAll('.form-select');

    nativeSelects.forEach(select => {
        // Ẩn select gốc
        select.style.display = 'none';

        // Đảm bảo style từ CSS không bị xung đột
        // Tạo cấu trúc wrapper

        // 1. Tạo Wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'custom-select-wrapper';
        wrapper.classList.add('custom-select'); // Dùng để toggle trạng thái mở

        // 2. Tạo Trigger (Hiển thị văn bản)
        const trigger = document.createElement('div');
        trigger.className = 'custom-select-trigger';
        // Đặt văn bản ban đầu
        const selectedOption = select.options[select.selectedIndex];
        trigger.textContent = selectedOption ? selectedOption.textContent : select.options[0].textContent;

        // 3. Tạo Container tùy chọn tùy chỉnh
        const customOptions = document.createElement('div');
        customOptions.className = 'custom-options';

        // 4. Thêm các tùy chọn
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
                // Cập nhật class selected
                customOptions.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');

                // Cập nhật văn bản Trigger
                trigger.textContent = this.textContent;

                // Cập nhật giá trị Select gốc
                select.value = this.dataset.value;

                // Kích hoạt sự kiện 'change' trên select gốc (cho các script khác)
                select.dispatchEvent(new Event('change'));

                // Đóng dropdown
                wrapper.classList.remove('open');
            });

            customOptions.appendChild(customOption);
        });

        // 5. Lắp ráp và chèn vào DOM
        wrapper.appendChild(trigger);
        wrapper.appendChild(customOptions);

        // Chèn sau select gốc
        select.parentNode.insertBefore(wrapper, select.nextSibling);

        // 6. Xử lý click Trigger (Toggle)
        trigger.addEventListener('click', function (e) {
            e.stopPropagation(); // Ngăn đóng ngay lập tức
            // Đóng các select đang mở khác
            document.querySelectorAll('.custom-select').forEach(other => {
                if (other !== wrapper) other.classList.remove('open');
            });
            wrapper.classList.toggle('open');
        });
    });

    // Đóng dropdown khi click ra ngoài
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.custom-select')) {
            document.querySelectorAll('.custom-select').forEach(select => {
                select.classList.remove('open');
            });
        }
    });
});

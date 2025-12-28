// Custom select - dropdown tùy chỉnh
// Tạo dropdown thay thế cho <select> mặc định

// Khởi tạo custom select
document.addEventListener('DOMContentLoaded', function () {
    const nativeSelects = document.querySelectorAll('.form-select');

    nativeSelects.forEach(select => {
        // Ẩn select gốc
        select.style.display = 'none';

        // Tạo wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'custom-select-wrapper';
        wrapper.classList.add('custom-select');

        // Tạo trigger
        const trigger = document.createElement('div');
        trigger.className = 'custom-select-trigger';
        const selectedOption = select.options[select.selectedIndex];
        trigger.textContent = selectedOption ? selectedOption.textContent : select.options[0].textContent;

        // Tạo options container
        const customOptions = document.createElement('div');
        customOptions.className = 'custom-options';

        // Tạo các option
        Array.from(select.options).forEach(option => {
            const customOption = document.createElement('span');
            customOption.className = 'custom-option';
            customOption.textContent = option.textContent;
            customOption.dataset.value = option.value;

            if (option.selected)
                customOption.classList.add('selected');

            // Xử lý click vào option
            customOption.addEventListener('click', function () {
                // Xóa class selected
                customOptions.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
                // Thêm class selected
                this.classList.add('selected');

                // Cập nhật trigger
                trigger.textContent = this.textContent;

                // Cập nhật select gốc
                select.value = this.dataset.value;

                // Kích hoạt event change
                select.dispatchEvent(new Event('change'));

                // Đóng dropdown
                wrapper.classList.remove('open');
            });

            customOptions.appendChild(customOption);
        });

        // Lắp ráp
        wrapper.appendChild(trigger);
        wrapper.appendChild(customOptions);
        select.parentNode.insertBefore(wrapper, select.nextSibling);

        // Xử lý click trigger
        trigger.addEventListener('click', function (e) {
            e.stopPropagation();

            // Đóng tất cả select khác
            document.querySelectorAll('.custom-select').forEach(other => {
                if (other !== wrapper)
                    other.classList.remove('open');
            });

            // Toggle select hiện tại
            wrapper.classList.toggle('open');
        });
    });

    // Xử lý click ra ngoài
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.custom-select')) {
            document.querySelectorAll('.custom-select').forEach(select => {
                select.classList.remove('open');
            });
        }
    });
});

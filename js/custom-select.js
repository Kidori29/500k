document.addEventListener('DOMContentLoaded', function () {
    // Find all native selects with class 'form-select'
    const nativeSelects = document.querySelectorAll('.form-select');

    nativeSelects.forEach(select => {
        // Hide native select
        select.style.display = 'none';

        // Ensure styling from css classes is not interfering
        // We will create a wrapper structure

        // 1. Create Wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'custom-select-wrapper';
        wrapper.classList.add('custom-select'); // Used for open state toggling

        // 2. Create Trigger (Display Text)
        const trigger = document.createElement('div');
        trigger.className = 'custom-select-trigger';
        // Set initial text
        const selectedOption = select.options[select.selectedIndex];
        trigger.textContent = selectedOption ? selectedOption.textContent : select.options[0].textContent;

        // 3. Create Custom Options Container
        const customOptions = document.createElement('div');
        customOptions.className = 'custom-options';

        // 4. Populate Options
        Array.from(select.options).forEach(option => {
            const customOption = document.createElement('span');
            customOption.className = 'custom-option';
            customOption.textContent = option.textContent;
            customOption.dataset.value = option.value;

            if (option.selected) {
                customOption.classList.add('selected');
            }

            // Handle Option Click
            customOption.addEventListener('click', function () {
                // Update selected class
                customOptions.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');

                // Update Triggle Text
                trigger.textContent = this.textContent;

                // Update Native Select Value
                select.value = this.dataset.value;

                // Trigger 'change' event on native select (for other scripts listening)
                select.dispatchEvent(new Event('change'));

                // Close dropdown
                wrapper.classList.remove('open');
            });

            customOptions.appendChild(customOption);
        });

        // 5. Assemble and Insert
        wrapper.appendChild(trigger);
        wrapper.appendChild(customOptions);

        // Insert after native select
        select.parentNode.insertBefore(wrapper, select.nextSibling);

        // 6. Handle Trigger Click (Toggle)
        trigger.addEventListener('click', function (e) {
            e.stopPropagation(); // Prevent closing immediately
            // Close other open selects
            document.querySelectorAll('.custom-select').forEach(other => {
                if (other !== wrapper) other.classList.remove('open');
            });
            wrapper.classList.toggle('open');
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.custom-select')) {
            document.querySelectorAll('.custom-select').forEach(select => {
                select.classList.remove('open');
            });
        }
    });
});

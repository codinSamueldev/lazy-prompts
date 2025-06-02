document.addEventListener('DOMContentLoaded', function() {
    // Modal elements
    const modal = document.getElementById('createPromptModal');
    const openBtn = document.getElementById('openCreatePromptBtn');
    const closeBtn = document.querySelector('.close-modal');
    const form = document.getElementById('createPromptForm');
    const submitBtn = form?.querySelector('.submit-btn');
    
    // Feed elements
    const feedContent = document.getElementById('feedContent');

    // Open modal
    openBtn?.addEventListener('click', () => {
        modal.classList.add('show');
    });

    // Close modal
    closeBtn?.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    // Close modal when clicking outside
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    // Handle form submission
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <div class="spinner">
                <div class="bounce1"></div>
                <div class="bounce2"></div>
                <div class="bounce3"></div>
            </div>
            Adding...
        `;
        
        const formData = new FormData(form);
        
        try {
            const response = await fetch('/prompts/create/', {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': formData.get('csrfmiddlewaretoken')
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                // Update the feed content
                document.getElementById('feedContent').innerHTML = data.posts_html;
                
                // Reset form and close modal
                form.reset();
                modal.classList.remove('show');
                
                // Show success message (you can implement this as needed)
                alert(data.message);
            } else {
                // Handle validation errors
                const errorMessages = document.querySelectorAll('.error-message');
                errorMessages.forEach(msg => msg.classList.remove('show'));

                Object.entries(data.errors).forEach(([field, errors]) => {
                    const errorElement = document.querySelector(`[data-field="${field}"]`);
                    if (errorElement) {
                        errorElement.textContent = errors[0];
                        errorElement.classList.add('show');
                    }
                });
                
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.textContent = 'Add Prompt';
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
            
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = 'Add Prompt';
        }
    });
});

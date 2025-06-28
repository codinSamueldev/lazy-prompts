function copyPromptContent(button) {
    try {
        const promptExcerpt = button.parentElement.querySelector('.prompt-excerpt');
        
        if (!promptExcerpt) {
            console.error('Prompt excerpt element not found');
            return;
        }
        
        // Handle Django linebreaks filter output
        let promptContent;
        
        // Check if content has HTML (from linebreaks filter)
        if (promptExcerpt.innerHTML.includes('<p>') || promptExcerpt.innerHTML.includes('<br>')) {
            // Convert HTML to plain text, preserving line breaks
            promptContent = promptExcerpt.innerHTML
                .replace(/<p>/g, '')
                .replace(/<\/p>/g, '\n')
                .replace(/<br\s*\/?>/g, '\n')
                .replace(/&nbsp;/g, ' ')
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .trim()
                .replace(/\n\s*\n/g, '\n\n'); // Clean up multiple newlines
        } else {
            // Use textContent for plain text
            promptContent = promptExcerpt.textContent || promptExcerpt.innerText || '';
            promptContent = promptContent.trim();
        }
        
        console.log('Content to copy:', promptContent); // Debug log
        
        if (!promptContent) {
            console.error('No content to copy');
            return;
        }
        
        if (!navigator.clipboard) {
            copyToClipboardFallback(promptContent, button);
            return;
        }
        
        navigator.clipboard.writeText(promptContent).then(() => {
            console.log('Content copied successfully');
            showCopySuccess(button);
        }).catch(err => {
            console.error('Copy failed:', err);
            copyToClipboardFallback(promptContent, button);
        });
        
    } catch (error) {
        console.error('Copy operation failed:', error);
    }
}

function copyToClipboardFallback(text, button) {
    try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
            showCopySuccess(button);
        }
    } catch (err) {
        console.error('Fallback copy failed:', err);
    }
}

function showCopySuccess(button) {
    const originalIcon = button.innerHTML;
    button.innerHTML = `
        <svg class="copy-icon" width="20" height="20" viewBox="0 0 24 24">
            <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
        </svg>
    `;
    
    setTimeout(() => {
        button.innerHTML = originalIcon;
    }, 2000);
}


// Function to get CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Function to format large numbers (e.g., 1200 -> "1.2k")
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num;
}

// Event listener for like buttons
document.addEventListener('DOMContentLoaded', () => {
    const csrftoken = getCookie('csrftoken');

    // Use event delegation - attach listener to document/body instead of individual buttons
    document.addEventListener('click', async function(event) {
        // Check if the clicked element is a like button or inside a like button
        const likeButton = event.target.closest('.like-button');
        
        if (!likeButton) return; // Not a like button click, ignore
        
        event.preventDefault(); // Prevent any default behavior
        
        const promptId = likeButton.dataset.promptId;
        const isLikedInitially = likeButton.dataset.isLiked === 'true';

        // Check if URLs are available
        if (!window.djangoUrls || !window.djangoUrls.toggleLike) {
            console.error('Django URLs not available');
            alert('Configuration error. Please refresh the page.');
            return;
        }

        const icon = likeButton.querySelector('.icon');
        const likesCountDisplay = likeButton.querySelector('.likes-count-display');

        // Optimistic UI update
        let currentLikes = parseInt(likesCountDisplay.textContent);
        let isLiked = icon.classList.contains('liked');

        if (isLiked) {
            icon.classList.remove('liked');
            likesCountDisplay.textContent = formatNumber(currentLikes - 1);
        } else {
            icon.classList.add('liked');
            likesCountDisplay.textContent = formatNumber(currentLikes + 1);
        }

        try {
            const response = await fetch(window.djangoUrls.toggleLike, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': csrftoken,
                },
                body: `prompt_id=${promptId}`
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                // Revert optimistic update if API call fails
                if (isLiked) {
                    icon.classList.add('liked');
                    likesCountDisplay.textContent = formatNumber(currentLikes);
                } else {
                    icon.classList.remove('liked');
                    likesCountDisplay.textContent = formatNumber(currentLikes);
                }
                
                if (response.status === 401 || response.status === 403) {
                    alert('You must be logged in to like prompts.');
                    if (window.djangoUrls.login) {
                        window.location.href = window.djangoUrls.login;
                    }
                } else {
                    try {
                        const errorData = await response.json();
                        console.error('Error toggling like:', errorData.error || response.statusText);
                        alert('An error occurred. Please try again.');
                    } catch (jsonError) {
                        console.error('Non-JSON error response:', response.statusText);
                        alert('An error occurred. Please try again.');
                    }
                }
                return;
            }

            const data = await response.json();
            
            // Update UI based on actual response
            if (data.is_liked) {
                icon.classList.add('liked');
            } else {
                icon.classList.remove('liked');
            }
            likesCountDisplay.textContent = formatNumber(data.new_like_count);

        } catch (error) {
            console.error('Network error or unexpected issue:', error);
            // Revert optimistic update on network error
            if (isLiked) {
                icon.classList.add('liked');
                likesCountDisplay.textContent = formatNumber(currentLikes);
            } else {
                icon.classList.remove('liked');
                likesCountDisplay.textContent = formatNumber(currentLikes);
            }
            alert('A network error occurred. Please try again.');
        }
    });
});
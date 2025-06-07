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


/*
function copyPromptContent(button) {
    console.log('=== DEBUG INFO ===');
    
    const promptExcerpt = button.parentElement.querySelector('.prompt-excerpt');
    console.log('Found element:', promptExcerpt);
    
    if (promptExcerpt) {
        console.log('innerHTML:', promptExcerpt.innerHTML);
        console.log('textContent:', promptExcerpt.textContent);
        console.log('innerText:', promptExcerpt.innerText);
        console.log('textContent length:', promptExcerpt.textContent.length);
        console.log('textContent after trim:', promptExcerpt.textContent.trim());
        console.log('textContent after trim length:', promptExcerpt.textContent.trim().length);
    }
    
    console.log('=== END DEBUG ===');
}
*/



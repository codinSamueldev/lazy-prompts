document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    let isMenuOpen = false;
    let touchStartX = 0;
    let touchEndX = 0;

    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    body.appendChild(overlay);

    function openMenu() {
        isMenuOpen = true;
        requestAnimationFrame(() => {
            mobileMenuBtn.classList.add('active');
            navMenu.classList.add('active');
            overlay.classList.add('active');
            body.style.overflow = 'hidden';
        });
    }

    function closeMenu() {
        if (!isMenuOpen) return;
        isMenuOpen = false;
        requestAnimationFrame(() => {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
        });
    }

    // Toggle menu on button click
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close menu when clicking overlay
    overlay.addEventListener('click', closeMenu);

    // Handle clicks on the document
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            closeMenu();
        }
    });

    // Prevent menu close when clicking inside
    navMenu.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Close menu when clicking a link
    const menuLinks = navMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Swipe to close functionality
    navMenu.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    navMenu.addEventListener('touchmove', (e) => {
        if (!isMenuOpen) return;
        touchEndX = e.touches[0].clientX;
        const swipeDistance = touchEndX - touchStartX;
        
        if (swipeDistance > 0) {
            e.preventDefault();
            navMenu.style.transform = `translateX(${swipeDistance}px)`;
        }
    });

    navMenu.addEventListener('touchend', () => {
        const swipeDistance = touchEndX - touchStartX;
        navMenu.style.transform = '';
        
        if (swipeDistance > 100) {
            closeMenu();
        }
    });

    // Load More functionality
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', async function() {
            this.classList.add('loading');
            
            try {
                // Simulate loading (replace with actual API call)
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Add new content here
                
            } catch (error) {
                console.error('Error loading more content:', error);
            } finally {
                this.classList.remove('loading');
            }
        });
    }

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    const searchSuggestions = document.querySelector('.search-suggestions');
    const filterBtn = document.querySelector('.search-filter-btn');
    const activeFilters = document.querySelector('.active-filters');
    
    if (searchInput && searchSuggestions) {
        let debounceTimer;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const query = this.value.trim();
                if (query.length >= 2) {
                    // Show loading state
                    searchSuggestions.innerHTML = '<div class="suggestion-loading">Loading...</div>';
                    searchSuggestions.hidden = false;
                    
                    // Fetch suggestions (replace with actual API call)
                    fetchSuggestions(query)
                        .then(suggestions => {
                            displaySuggestions(suggestions);
                        })
                        .catch(error => {
                            console.error('Error fetching suggestions:', error);
                            searchSuggestions.hidden = true;
                        });
                } else {
                    searchSuggestions.hidden = true;
                }
            }, 300);
        });

        // Close suggestions when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
                searchSuggestions.hidden = true;
            }
        });
    }

    if (filterBtn && activeFilters) {
        filterBtn.addEventListener('click', function() {
            // Toggle filter menu (implement your filter UI logic here)
            console.log('Toggle filters');
        });
    }
});

// Mock function for fetching suggestions (replace with actual API call)
async function fetchSuggestions(query) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock suggestions (replace with actual API data)
    return [
        { type: 'prompt', text: 'Example Prompt 1' },
        { type: 'topic', text: 'AI & Machine Learning' },
        { type: 'prompt', text: 'Example Prompt 2' }
    ].filter(item => item.text.toLowerCase().includes(query.toLowerCase()));
}

function displaySuggestions(suggestions) {
    const searchSuggestions = document.querySelector('.search-suggestions');
    
    if (suggestions.length === 0) {
        searchSuggestions.innerHTML = '<div class="no-suggestions">No results found</div>';
        return;
    }

    const html = suggestions.map(suggestion => `
        <div class="suggestion-item ${suggestion.type}">
            <span class="suggestion-type">${suggestion.type}</span>
            <span class="suggestion-text">${suggestion.text}</span>
        </div>
    `).join('');

    searchSuggestions.innerHTML = html;
}

// Function to add a filter chip
function addFilterChip(filterText) {
    const activeFilters = document.querySelector('.active-filters');
    const chip = document.createElement('div');
    chip.className = 'filter-chip';
    chip.innerHTML = `
        ${filterText}
        <button type="button" aria-label="Remove filter">×</button>
    `;

    chip.querySelector('button').addEventListener('click', function() {
        chip.remove();
        if (activeFilters.children.length === 0) {
            activeFilters.hidden = true;
        }
    });

    activeFilters.hidden = false;
    activeFilters.appendChild(chip);
} 
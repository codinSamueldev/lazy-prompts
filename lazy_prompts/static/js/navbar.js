document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    let isMenuOpen = false;

    // Debug logging
    console.log('Navbar JS loaded');
    console.log('Mobile menu button:', mobileMenuBtn);
    console.log('Nav menu:', navMenu);

    if (!mobileMenuBtn || !navMenu) {
        console.error('Required elements not found');
        return;
    }

    // Create overlay element
    let overlay = document.querySelector('.mobile-menu-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'mobile-menu-overlay';
        body.appendChild(overlay);
    }

    function openMenu() {
        console.log('Opening menu');
        isMenuOpen = true;
        mobileMenuBtn.classList.add('active');
        navMenu.classList.add('active');
        overlay.classList.add('active');
        body.style.overflow = 'hidden';
    }

    function closeMenu() {
        if (!isMenuOpen) return;
        console.log('Closing menu');
        isMenuOpen = false;
        mobileMenuBtn.classList.remove('active');
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
        body.style.overflow = '';
    }

    // Toggle menu on button click
    mobileMenuBtn.addEventListener('click', function(e) {
        console.log('Menu button clicked', isMenuOpen);
        e.preventDefault();
        e.stopPropagation();
        
        if (isMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close menu when clicking overlay
    overlay.addEventListener('click', function(e) {
        console.log('Overlay clicked');
        e.preventDefault();
        closeMenu();
    });

    // Handle clicks on the document
    document.addEventListener('click', function(e) {
        if (isMenuOpen && !navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            closeMenu();
        }
    });

    // Prevent menu close when clicking inside
    navMenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Close menu when clicking a link
    const menuLinks = navMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Menu link clicked');
            closeMenu();
        });
    });

    // Handle escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenu();
        }
    });

    // Touch/swipe functionality for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    navMenu.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    navMenu.addEventListener('touchmove', function(e) {
        if (!isMenuOpen) return;
        touchEndX = e.touches[0].clientX;
        const swipeDistance = touchEndX - touchStartX;
        
        // Only allow swiping right (positive distance)
        if (swipeDistance > 0) {
            navMenu.style.transform = `translateX(${Math.min(swipeDistance, 100)}px)`;
        }
    }, { passive: true });

    navMenu.addEventListener('touchend', function() {
        const swipeDistance = touchEndX - touchStartX;
        navMenu.style.transform = '';
        
        // Close menu if swiped right more than 100px
        if (swipeDistance > 100) {
            closeMenu();
        }
        
        touchStartX = 0;
        touchEndX = 0;
    }, { passive: true });

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    const searchSuggestions = document.querySelector('.search-suggestions');
    const filterBtn = document.querySelector('.search-filter-btn');
    
    if (searchInput && searchSuggestions) {
        let debounceTimer;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const query = this.value.trim();
                if (query.length >= 2) {
                    searchSuggestions.innerHTML = '<div class="suggestion-loading">Loading...</div>';
                    searchSuggestions.hidden = false;
                    
                    // Simulate search suggestions
                    setTimeout(() => {
                        const mockSuggestions = [
                            { type: 'Prompt', text: `${query}` },
                            { type: 'Title', text: `${query}` }
                        ];
                        displaySuggestions(mockSuggestions);
                    }, 300);
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

    // Load More functionality
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', async function() {
            this.classList.add('loading');
            
            try {
                // Simulate loading
                await new Promise(resolve => setTimeout(resolve, 1000));
                console.log('Load more content');
            } catch (error) {
                console.error('Error loading more content:', error);
            } finally {
                this.classList.remove('loading');
            }
        });
    }
});

function displaySuggestions(suggestions) {
    const searchSuggestions = document.querySelector('.search-suggestions');
    
    if (!searchSuggestions) return;
    
    if (suggestions.length === 0) {
        searchSuggestions.innerHTML = '<div class="no-suggestions">No results found</div>';
        return;
    }

    const html = suggestions.map(suggestion => `
        <button type="submit" class="suggestion-item ${suggestion.type}">
            <span name="search-${suggestion.type}" class="suggestion-type">${suggestion.type}</span>
            <span name="search-${suggestion.type}-text" class="suggestion-text"> "${suggestion.text}"</span>
        </button>
    `).join('');

    searchSuggestions.innerHTML = html;
}

// Function to add a filter chip
function addFilterChip(filterText) {
    const activeFilters = document.querySelector('.active-filters');
    if (!activeFilters) return;
    
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

// Delegate click event for suggestion buttons
document.addEventListener('click', function(e) {
    const btn = e.target.closest('.suggestion-item');
    if (!btn) return;

    e.preventDefault();

    const form = btn.closest('form');
    const searchInput = form.querySelector('.search-input');
    const type = btn.classList.contains('Title') ? 'search-title' : 'search-prompt';

    // Remove any existing filter input
    form.querySelectorAll('input[name="search-title"], input[name="search-prompt"]').forEach(el => el.remove());

    // Create and append the correct hidden input
    const hidden = document.createElement('input');
    hidden.type = 'hidden';
    hidden.name = type;
    hidden.value = searchInput.value;
    form.appendChild(hidden);

    form.submit();
});

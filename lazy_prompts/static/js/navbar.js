document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');
    
    if (mobileMenuBtn && navList) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            navList.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !navList.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                navList.classList.remove('active');
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
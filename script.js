// CS 111 - Project 4
//FlixTracker - TV Series and Movie Tracker
let mediaCollection = {
    items: []
};
// Tracking for what star rating is selected
let selectedRating = 0;

// Wait for page to fully load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});
// Set up for interactive the features
function initializeApp() {
    setupStarRating();
    setupForm();
    setupFilters();
    displayMedia();
}

// Star rating setup
// Used Copilot to help fix stars as they weren't clickable before
function setupStarRating() {
    const stars = document.querySelectorAll('#rating-input .star');
    
// Click event for each star
    stars.forEach(function(star) {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            selectedRating = rating;
            updateStarDisplay(rating);
            alert('You selected ' + rating + ' stars!'); // Remove this after testing
        });
    });
}
// Take numbers 1-5 and fill in stars
function updateStarDisplay(rating) {
    const stars = document.querySelectorAll('#rating-input .star');
    stars.forEach(function(star, index) {
        if (index < rating) {
            star.classList.add('filled');
            star.textContent = '★';
        } else {
            star.classList.remove('filled');
            star.textContent = '☆';
        }
    });
}

// Form setup
function setupForm() {
    const form = document.getElementById('media-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
// Get inputs for the form
        const title = document.getElementById('title').value;
        const type = document.getElementById('type').value;
        const genre = document.getElementById('genre').value;
        
        if (selectedRating === 0) {
            alert('Please select a rating!');
            return;
        }
// Create medie object w the info
        const newMedia = {
            id: Date.now(),
            title: title,
            type: type,
            genre: genre,
            rating: selectedRating,
            favorite: false
        };
        
        mediaCollection.items.push(newMedia);
        
        form.reset();
        selectedRating = 0;
        updateStarDisplay(0);
        
        displayMedia();
    });
}

// Filter setup
// Connect filter buttons with their given functions
function setupFilters() {
    const typeFilter = document.getElementById('filter-type');
    const genreFilter = document.getElementById('filter-genre');
    const favButton = document.getElementById('show-favorites');
    const resetButton = document.getElementById('reset-filters');
    
    if (typeFilter) {
        typeFilter.addEventListener('change', applyFilters);
    }
    
    if (genreFilter) {
        genreFilter.addEventListener('change', applyFilters);
    }
    
    if (favButton) {
        favButton.addEventListener('click', showFavoritesOnly);
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', resetFilters);
    }
}

// Display media items
function displayMedia(itemsToDisplay) {
    if (!itemsToDisplay) {
        itemsToDisplay = mediaCollection.items;
    }
    
    const mediaList = document.getElementById('media-list');
    if (!mediaList) return;
    
    mediaList.innerHTML = '';
    
    if (itemsToDisplay.length === 0) {
        mediaList.innerHTML = '<p class="empty-message">No media found. Try adjusting your filters or add new media!</p>';
        return;
    }
    
    itemsToDisplay.forEach(function(item) {
        const card = createMediaCard(item);
        mediaList.appendChild(card);
    });
}

// Create media cards for type
function createMediaCard(item) {
    let card = document.createElement('div');
    card.className = 'media-card';
    
    if (item.favorite) {
        card.classList.add('favorite');
    }
    
    let stars = generateStarDisplay(item.rating);
    let typeLabel = item.type === 'movie' ? 'Movie' : 'TV Show';
    let genreLabel = item.genre.charAt(0).toUpperCase() + item.genre.slice(1);
    
    // Build the HTML with title, ratings, badges
    card.innerHTML = '<h3>' + item.title + '</h3>' +
        '<div class="media-info">' +
        '<p>' +
        '<span class="badge ' + item.type + '">' + typeLabel + '</span>' +
        '<span class="badge genre">' + genreLabel + '</span>' +
        '</p>' +
        '<div class="rating-display">' + stars + '</div>' +
        '</div>' +
        '<div class="card-actions">' +
        '<button class="btn-favorite ' + (item.favorite ? 'favorited' : '') + '" onclick="toggleFavorite(' + item.id + ')">' +
        (item.favorite ? '❤️ Favorited' : '🤍 Favorite') +
        '</button>' +
        '<button class="btn-delete" onclick="deleteMedia(' + item.id + ')">🗑️ Delete</button>' +
        '</div>';
    
    return card;
}

// Use rating number to make star display 
function generateStarDisplay(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '★';
        } else {
            stars += '☆';
        }
    }
    return stars;
}

// Favorite toggle selection
function toggleFavorite(id) {
    const item = mediaCollection.items.find(function(media) {
        return media.id === id;
    });
    
    if (item) {
        item.favorite = !item.favorite;
        displayMedia();
    }
}

// Delete movies/shows
function deleteMedia(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        mediaCollection.items = mediaCollection.items.filter(function(media) {
            return media.id !== id;
        });
        displayMedia();
    }
}

// Apply filters for genre/type/favorites
// Used copilot to help with filters
function applyFilters() {
    const typeFilter = document.getElementById('filter-type').value;
    const genreFilter = document.getElementById('filter-genre').value;
    
    const filteredItems = mediaCollection.items.filter(function(item) {
        const matchesType = typeFilter === 'all' || item.type === typeFilter;
        const matchesGenre = genreFilter === 'all' || item.genre === genreFilter;
        return matchesType && matchesGenre;
    });
    
    displayMedia(filteredItems);
}

// Show favorites only button
function showFavoritesOnly() {
    const favorites = mediaCollection.items.filter(function(item) {
        return item.favorite === true;
    });
    displayMedia(favorites);
}

// Reset filters
function resetFilters() {
    document.getElementById('filter-type').value = 'all';
    document.getElementById('filter-genre').value = 'all';
    displayMedia();
}
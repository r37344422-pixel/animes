// Anime Details Page JavaScript - Updated for Jikan v4 API
document.addEventListener('DOMContentLoaded', function() {
    // Step 1: Extract anime ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const animeId = urlParams.get('id');

    if (!animeId) {
        showError('No anime ID provided in URL');
        return;
    }

    // Initialize page and fetch data
    initializePage();
    fetchAnimeDetails(animeId);

    // Back to home button functionality
    const backBtn = document.getElementById('back-to-home');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
});

// Initialize page elements and show loading state
function initializePage() {
    // Don't clear the container - just show the loader overlay
    showLoader();
}

// Show loader overlay
function showLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'flex';
}

// Hide loader overlay
function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';
}

// Fetch anime details from Jikan v4 API
async function fetchAnimeDetails(animeId) {
    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/full`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Check if data exists
        if (!data || !data.data) {
            throw new Error('Invalid API response: missing data');
        }

        displayAnimeDetails(data.data);
    } catch (error) {
        console.error('Error fetching anime details:', error);
        showError('Failed to load anime details. Please try again later.');
    } finally {
        hideLoader();
    }
}

// Display anime details on the page
function displayAnimeDetails(anime) {
    try {
        // Validate anime object
        if (!anime || typeof anime !== 'object') {
            throw new Error('Invalid anime data received');
        }

        // Update title
        const titleElement = document.getElementById('anime-title');
        if (titleElement) {
            titleElement.textContent = anime.title ?? 'Unknown Title';
        }

        // Update poster image
        const posterElement = document.getElementById('anime-poster');
        if (posterElement) {
            posterElement.src = anime.images?.jpg?.image_url ?? '';
            posterElement.alt = `${anime.title ?? 'Anime'} Poster`;
        }

        // Update meta information
        updateMetaInfo(anime);

        // Update genres
        updateGenres(anime.genres ?? []);

        // Update synopsis
        const synopsisElement = document.getElementById('anime-synopsis');
        if (synopsisElement) {
            synopsisElement.textContent = anime.synopsis ?? 'Synopsis not available.';
        }

        // Load trailer
        loadTrailer(anime);

        // Load watch platforms
        loadWatchPlatforms(anime);

        // Update external watch button
        const watchBtn = document.getElementById('watch-external');
        if (watchBtn) {
            watchBtn.addEventListener('click', () => {
                window.open(anime.url ?? '#', '_blank');
            });
        }

        // Update page title
        document.title = `${anime.title ?? 'Unknown Anime'} - Rahul Anime Portal`;

    } catch (error) {
        console.error('Error displaying anime details:', error);
        showError('Oops! Something went wrong — Error displaying anime information.');
    }
}

// Update meta information (Type, Episodes, Score, Status, Year, Studios, Rating)
function updateMetaInfo(anime) {
    const metaMappings = {
        'anime-type': anime.type ?? 'N/A',
        'anime-episodes': anime.episodes ?? 'N/A',
        'anime-rating': anime.rating ?? 'N/A',
        'anime-score': anime.score ? `⭐ ${anime.score}` : 'N/A',
        'anime-year': anime.year ?? anime.aired?.prop?.from?.year ?? 'Unknown',
        'anime-status': anime.status ?? 'N/A',
        'anime-studio': anime.studios?.length > 0 ? anime.studios[0].name : 'N/A'
    };

    Object.entries(metaMappings).forEach(([elementId, value]) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    });
}

// Update genres list
function updateGenres(genres) {
    const genresContainer = document.getElementById('anime-genres');
    if (genresContainer) {
        genresContainer.innerHTML = '';
        if (genres.length > 0) {
            genres.forEach(genre => {
                const genreSpan = document.createElement('span');
                genreSpan.textContent = genre.name ?? 'Unknown Genre';
                genresContainer.appendChild(genreSpan);
            });
        } else {
            genresContainer.innerHTML = '<span>No genres available</span>';
        }
    }
}

// Load trailer section
function loadTrailer(anime) {
    const trailerBox = document.getElementById("trailerBox");
    if (!trailerBox) return;

    const trailer = anime.trailer;

    if (trailer && trailer.embed_url) {
        // Embed YouTube iframe if trailer exists
        trailerBox.innerHTML = `
            <iframe src="${trailer.embed_url}"
                    title="Anime Trailer"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen>
            </iframe>`;
    } else {
        // Show placeholder if no trailer
        trailerBox.innerHTML = `
            <div class="no-trailer">
                <img src="https://via.placeholder.com/100x100/333/fff?text=No+Trailer" alt="No Trailer Available">
                <p>Trailer not available</p>
            </div>`;
    }
}

// Load watch platforms section
function loadWatchPlatforms(anime) {
    const platformsContainer = document.querySelector('.platforms-list');
    if (!platformsContainer) return;

    const streaming = anime.streaming ?? [];

    if (streaming.length > 0) {
        platformsContainer.innerHTML = '';
        streaming.slice(0, 6).forEach(platform => {
            const platformBtn = document.createElement('a');
            platformBtn.className = 'platform-btn';
            platformBtn.href = platform.url ?? '#';
            platformBtn.target = '_blank';

            // Determine platform class based on name
            let platformClass = 'generic';
            const name = platform.name?.toLowerCase() ?? '';
            if (name.includes('crunchyroll')) platformClass = 'crunchyroll';
            else if (name.includes('netflix')) platformClass = 'netflix';
            else if (name.includes('hulu')) platformClass = 'hulu';
            else if (name.includes('funimation')) platformClass = 'funimation';
            else if (name.includes('hidive')) platformClass = 'hidive';

            platformBtn.classList.add(platformClass);

            platformBtn.innerHTML = `
                <img src="https://via.placeholder.com/50x50/333/fff?text=${encodeURIComponent(platform.name ?? 'Platform')}" alt="${platform.name ?? 'Platform'}" class="platform-icon">
                ${platform.name ?? 'Unknown Platform'}
            `;
            platformsContainer.appendChild(platformBtn);
        });
    } else {
        // Keep default platforms if no streaming data
        platformsContainer.innerHTML = `
            <a href="#" class="platform-btn crunchyroll" target="_blank">
                <img src="https://via.placeholder.com/50x50/FF6B35/FFFFFF?text=CR" alt="Crunchyroll" class="platform-icon">
                Crunchyroll
            </a>
            <a href="#" class="platform-btn netflix" target="_blank">
                <img src="https://via.placeholder.com/50x50/E50914/FFFFFF?text=N" alt="Netflix" class="platform-icon">
                Netflix
            </a>
            <a href="#" class="platform-btn hulu" target="_blank">
                <img src="https://via.placeholder.com/50x50/1CE783/FFFFFF?text=H" alt="Hulu" class="platform-icon">
                Hulu
            </a>
        `;
    }
}

// Show error message with back to home button
function showError(message) {
    hideLoader();

    const container = document.querySelector('.anime-details-container');
    if (container) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <h3>${message}</h3>
            <button onclick="window.location.href='index.html'" style="margin-top: 15px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Back to Home
            </button>
        `;
        container.innerHTML = '';
        container.appendChild(errorDiv);
    }
}

// Handle page visibility for performance
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, pause any animations if needed
    } else {
        // Page is visible again
    }
});

// Error handling for images
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.src = 'https://via.placeholder.com/300x450/333/fff?text=Image+Not+Available';
    }
}, true);

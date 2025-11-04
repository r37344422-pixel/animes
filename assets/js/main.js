// Carousel functionality
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        // Auto-play carousel
        setInterval(nextSlide, 5000);
    }

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('nav ul');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('show');
            });
        });
    }

    // Back to top button
    const backToTopBtn = document.querySelector('.back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Show loader
    function showLoader() {
        const loader = document.getElementById('loader');
        if (loader) loader.style.display = 'flex';
    }

    // Hide loader
    function hideLoader() {
        const loader = document.getElementById('loader');
        if (loader) loader.style.display = 'none';
    }

    // Fetch trending anime (currently airing)
    async function fetchTrendingAnime() {
        showLoader();
        try {
            const response = await fetch('https://api.jikan.moe/v4/seasons/now?limit=8');
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error fetching trending anime:', error);
            return [];
        } finally {
            hideLoader();
        }
    }

    // Fetch upcoming anime
    async function fetchUpcomingAnime() {
        showLoader();
        try {
            const response = await fetch('https://api.jikan.moe/v4/seasons/upcoming?limit=8');
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error fetching upcoming anime:', error);
            return [];
        } finally {
            hideLoader();
        }
    }

    // Fetch top rated anime
    async function fetchTopRatedAnime() {
        showLoader();
        try {
            const response = await fetch('https://api.jikan.moe/v4/top/anime?limit=10');
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error fetching top rated anime:', error);
            return [];
        } finally {
            hideLoader();
        }
    }

    // Populate carousel with trending anime
    async function populateCarousel() {
        const trendingAnime = await fetchTrendingAnime();
        const slides = document.querySelectorAll('.slide');
        trendingAnime.slice(0, 3).forEach((anime, index) => {
            if (slides[index]) {
                const img = slides[index].querySelector('img');
                const title = slides[index].querySelector('h3');
                const desc = slides[index].querySelector('p');
                if (img) img.src = anime.images.jpg.large_image_url;
                if (title) title.textContent = anime.title;
                if (desc) desc.textContent = anime.synopsis ? anime.synopsis.substring(0, 100) + '...' : 'No description available.';
            }
        });
    }

    // Populate latest updates grid with upcoming anime
    async function populateLatestUpdates() {
        const upcomingAnime = await fetchUpcomingAnime();
        const grid = document.querySelector('.latest-updates .grid');
        if (grid) {
            grid.innerHTML = '';
            upcomingAnime.forEach(anime => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}">
                    <h3>${anime.title}</h3>
                    <p>${anime.year || 'TBA'}</p>
                    <button>Watch Now</button>
                `;
                // Add click listener to redirect to anime details page
                const watchBtn = card.querySelector('button');
                if (watchBtn) {
                    watchBtn.addEventListener('click', () => {
                        window.location.href = `animes.html?id=${anime.mal_id}`;
                    });
                }
                grid.appendChild(card);
            });
        }
    }

    // Populate top rated list
    async function populateTopRated() {
        const topRatedAnime = await fetchTopRatedAnime();
        const topRatedList = document.querySelector('.top-rated ul');
        if (topRatedList) {
            topRatedList.innerHTML = '';
            topRatedAnime.forEach((anime, index) => {
                const li = document.createElement('li');
                li.innerHTML = `<span class="rank">${index + 1}.</span> ${anime.title}`;
                topRatedList.appendChild(li);
            });
        }
    }

    // Load anime data for anime.html
    const showsGrid = document.getElementById('shows-grid');
    if (showsGrid) {
        fetchTrendingAnime().then(trendingAnime => {
            showsGrid.innerHTML = ''; // Clear existing static content
            trendingAnime.forEach(anime => {
                const showCard = document.createElement('div');
                showCard.className = 'show-card';

                const shortSynopsis = anime.synopsis ? (anime.synopsis.length > 150 ? anime.synopsis.substring(0, 150) + '...' : anime.synopsis) : 'No description available.';
                showCard.innerHTML = `
                    <img src="${anime.images.jpg.large_image_url}" alt="${anime.title} Poster">
                    <h3>${anime.title} (${anime.year || 'N/A'})</h3>
                    <p>${anime.genres.map(g => g.name).join(', ')}</p>
                    <p>${anime.score || 'N/A'}</p>
                    <p>${shortSynopsis}</p>
                    <button>Watch</button>
                    <button>More Info</button>
                `;

                // Add click listeners to redirect to anime details page
                const buttons = showCard.querySelectorAll('button');
                buttons.forEach(button => {
                    button.addEventListener('click', () => {
                        window.location.href = `animes.html?id=${anime.mal_id}`;
                    });
                });

                showsGrid.appendChild(showCard);
            });
        });
    }

    // Load movies data for movies.html
    const moviesGrid = document.getElementById('movies-grid');
    if (moviesGrid) {
        fetchTopRatedAnime().then(topRatedAnime => {
            topRatedAnime.forEach(anime => {
                const movieCard = document.createElement('div');
                movieCard.className = 'movie-card';

                const shortSynopsis = anime.synopsis ? (anime.synopsis.length > 150 ? anime.synopsis.substring(0, 150) + '...' : anime.synopsis) : 'No description available.';
                movieCard.innerHTML = `
                    <img src="${anime.images.jpg.large_image_url}" alt="${anime.title} Poster" onerror="this.src='https://via.placeholder.com/300x450/333/fff?text=${encodeURIComponent(anime.title)}'">
                    <div class="movie-info">
                        <h3>${anime.title} (${anime.year || 'N/A'})</h3>
                        <p class="genre">${anime.genres.map(g => g.name).join(', ')}</p>
                        <p class="year">⭐ ${anime.score || 'N/A'}</p>
                        <p class="synopsis">${shortSynopsis}</p>
                        <div class="watch-buttons">
                            <button class="watch-btn">Watch</button>
                            <button class="watch-btn">More Info</button>
                        </div>
                    </div>
                `;

                // Add click listeners to redirect to anime details page
                const buttons = movieCard.querySelectorAll('button');
                buttons.forEach(button => {
                    button.addEventListener('click', () => {
                        window.location.href = `animes.html?id=${anime.mal_id}`;
                    });
                });

                moviesGrid.appendChild(movieCard);
            });
        });
    }

    // Initialize dynamic content for index.html
    populateCarousel();
    populateLatestUpdates();
    populateTopRated();

    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const clearBtn = document.getElementById('clear-btn');
    const searchResultsSection = document.getElementById('search-results');
    const searchResultsGrid = searchResultsSection.querySelector('.grid');

    // Fetch anime by search query
    async function searchAnime(query) {
        showLoader();
        try {
            const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=10`);
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error searching anime:', error);
            return [];
        } finally {
            hideLoader();
        }
    }

    // Display search results
    function displaySearchResults(results) {
        searchResultsGrid.innerHTML = '';

        if (results.length === 0) {
            searchResultsGrid.innerHTML = '<p>No anime found for your search.</p>';
        } else {
            results.forEach(anime => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}">
                    <h3>${anime.title}</h3>
                    <p>⭐ ${anime.score || 'N/A'}</p>
                    <p>Episodes: ${anime.episodes || 'N/A'}</p>
                    <button>Watch Now</button>
                `;
                // Add click listener to redirect to anime details page
                const watchBtn = card.querySelector('button');
                if (watchBtn) {
                    watchBtn.addEventListener('click', () => {
                        window.location.href = `animes.html?id=${anime.mal_id}`;
                    });
                }
                searchResultsGrid.appendChild(card);
            });
        }

        searchResultsSection.style.display = 'block';
        clearBtn.style.display = 'inline-block';
    }

    // Clear search results
    function clearSearchResults() {
        searchResultsGrid.innerHTML = '';
        searchResultsSection.style.display = 'none';
        searchInput.value = '';
        clearBtn.style.display = 'none';
    }

    // Search button event listener
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const query = searchInput.value.trim();
            if (query) {
                searchAnime(query).then(displaySearchResults);
            }
        });
    }

    // Clear button event listener
    if (clearBtn) {
        clearBtn.addEventListener('click', clearSearchResults);
    }

    // Enter key support for search
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Simple form validation
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !subject || !message) {
                formMessage.innerHTML = '<p class="error">Please fill in all fields.</p>';
                formMessage.style.display = 'block';
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                formMessage.innerHTML = '<p class="error">Please enter a valid email address.</p>';
                formMessage.style.display = 'block';
                return;
            }

            // Simulate form submission (no backend)
            formMessage.innerHTML = '<p class="success">Message Sent!</p>';
            formMessage.style.display = 'block';

            // Reset form
            contactForm.reset();

            // Hide message after 5 seconds
            setTimeout(function() {
                formMessage.style.display = 'none';
            }, 5000);
        });
    }
});

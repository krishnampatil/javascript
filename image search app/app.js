
// ─── API CONFIG ────────────────────────────────────────────────────────────
const ACCESS_KEY = "zx9cdyiEjm3jIQlbIUvijX4NofvegT8yZOlTZsckmSk";
const API_BASE = "https://api.unsplash.com/search/photos";
const PER_PAGE = 12;

// ─── STATE ────────────────────────────────────────────────────────────────
let currentQuery = "";
let currentPage = 1;
let totalPages = 0;
let isFetching = false;

// ─── DOM REFERENCES ───────────────────────────────────────────────────────
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const gallery = document.getElementById("gallery");
const loadMoreSection = document.getElementById("load-more-section");
const loadMoreBtn = document.getElementById("load-more-btn");
const loadingEl = document.getElementById("loading");
const errorBanner = document.getElementById("error-banner");
const emptyState = document.getElementById("empty-state");

// ─── EVENT LISTENERS ──────────────────────────────────────────────────────
searchBtn.addEventListener("click", startNewSearch);
searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") startNewSearch();
});
loadMoreBtn.addEventListener("click", loadMore);

// ─── FUNCTIONS ────────────────────────────────────────────────────────────

function startNewSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    currentQuery = query;
    currentPage = 1;
    totalPages = 0;

    gallery.innerHTML = "";
    hideError();
    emptyState.style.display = "none";
    loadMoreSection.style.display = "none";

    fetchImages();
}

function loadMore() {
    currentPage++;
    fetchImages();
}

async function fetchImages() {
    if (isFetching) return;
    isFetching = true;
    showLoading(true);
    hideError();

    const url = `${API_BASE}?query=${encodeURIComponent(currentQuery)}&page=${currentPage}&per_page=${PER_PAGE}&client_id=${ACCESS_KEY}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        totalPages = data.total_pages;

        if (data.results.length === 0 && currentPage === 1) {
            emptyState.style.display = "block";
        } else {
            renderImages(data.results);
        }

        loadMoreSection.style.display = currentPage < totalPages ? "block" : "none";

    } catch (err) {
        showError(err.message || "Something went wrong. Please try again.");
    } finally {
        showLoading(false);
        isFetching = false;
    }
}

function renderImages(photos) {
    photos.forEach(photo => {
        const item = document.createElement("div");
        item.className = "gallery-item";

        const img = document.createElement("img");
        img.src = photo.urls.small;
        img.alt = photo.alt_description || "photo";
        img.loading = "lazy";

        const caption = document.createElement("div");
        caption.className = "caption";
        caption.textContent = `📷 ${photo.user.name}`;

        item.appendChild(img);
        item.appendChild(caption);
        gallery.appendChild(item);
    });
}

function showLoading(visible) {
    loadingEl.style.display = visible ? "block" : "none";
}

function showError(message) {
    errorBanner.textContent = `⚠ ${message}`;
    errorBanner.style.display = "block";
}

function hideError() {
    errorBanner.style.display = "none";
    errorBanner.textContent = "";
}

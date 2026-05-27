// API: https://dummyjson.com/quotes/random — free, no key needed

// State
var currentQuote = null;
var favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

// DOM elements
var quoteText   = document.getElementById("quoteText");
var quoteAuthor = document.getElementById("quoteAuthor");
var loading     = document.getElementById("loading");
var newQuoteBtn = document.getElementById("newQuoteBtn");
var copyBtn     = document.getElementById("copyBtn");
var saveBtn     = document.getElementById("saveBtn");
var toast       = document.getElementById("toast");
var favList     = document.getElementById("favoritesList");
var clearBtn    = document.getElementById("clearBtn");

// Fetch a random quote from API
function fetchQuote() {
  loading.style.display = "block";
  quoteText.style.display = "none";
  quoteAuthor.style.display = "none";
  newQuoteBtn.disabled = true;

  fetch("https://dummyjson.com/quotes/random")
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      currentQuote = { text: data.quote, author: data.author };
      quoteText.textContent   = '"' + data.quote + '"';
      quoteAuthor.textContent = '— ' + data.author;

      loading.style.display   = "none";
      quoteText.style.display = "block";
      quoteAuthor.style.display = "block";
      newQuoteBtn.disabled = false;

      updateSaveButton();
    })
    .catch(function(error) {
      loading.textContent = "Failed to load quote. Check your connection.";
      newQuoteBtn.disabled = false;
      console.error("API error:", error);
    });
}

// New Quote button
newQuoteBtn.addEventListener("click", function() {
  fetchQuote();
  toast.textContent = "";
});

// Copy to clipboard
copyBtn.addEventListener("click", function() {
  if (!currentQuote) return;
  var text = '"' + currentQuote.text + '" — ' + currentQuote.author;
  navigator.clipboard.writeText(text);
  showToast("Copied!");
});

// Save / unsave
saveBtn.addEventListener("click", function() {
  if (!currentQuote) return;

  var alreadySaved = favorites.some(function(f) {
    return f.text === currentQuote.text;
  });

  if (alreadySaved) {
    favorites = favorites.filter(function(f) {
      return f.text !== currentQuote.text;
    });
    showToast("Removed from saved.");
  } else {
    favorites.push(currentQuote);
    showToast("Saved!");
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateSaveButton();
  renderFavorites();
});

// Update save button text
function updateSaveButton() {
  if (!currentQuote) return;
  var saved = favorites.some(function(f) {
    return f.text === currentQuote.text;
  });
  saveBtn.textContent = saved ? "Saved ✓" : "Save ♥";
  if (saved) {
    saveBtn.classList.add("saved");
  } else {
    saveBtn.classList.remove("saved");
  }
}

// Toast message
function showToast(msg) {
  toast.textContent = msg;
  setTimeout(function() { toast.textContent = ""; }, 2000);
}

// Render favorites list
function renderFavorites() {
  favList.innerHTML = "";

  if (favorites.length === 0) {
    favList.innerHTML = '<li class="empty">No saved quotes yet.</li>';
    return;
  }

  favorites.forEach(function(fav, i) {
    var li = document.createElement("li");
    li.className = "fav-item";
    li.innerHTML =
      '<div>' +
        '<p>"' + fav.text + '"</p>' +
        '<span>— ' + fav.author + '</span>' +
      '</div>' +
      '<button class="remove-btn" data-index="' + i + '">✕</button>';
    favList.appendChild(li);
  });
}

// Remove a favorite
favList.addEventListener("click", function(e) {
  if (e.target.classList.contains("remove-btn")) {
    var i = parseInt(e.target.dataset.index);
    favorites.splice(i, 1);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFavorites();
    updateSaveButton();
  }
});

// Clear all
clearBtn.addEventListener("click", function() {
  favorites = [];
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderFavorites();
  updateSaveButton();
  showToast("Cleared all.");
});

// Start — load first quote on page open
fetchQuote();
renderFavorites();

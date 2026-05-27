// =============================================
// script.js — Password Generator Logic
// =============================================

// --- Character Sets ---
const CHARS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  num:   '0123456789',
  sym:   '!@#$%^&*()-_=+[]{}|;:,.<>?'
};

// Key used to store passwords in localStorage
const STORAGE_KEY = 'pw_vault_v1';

// --- App State ---
let currentPassword = '';   // Currently generated password
let vault = loadVault();    // All saved passwords loaded from localStorage

// =============================================
// DOM Element References
// =============================================
const slider         = document.getElementById('length-slider');
const lengthInput    = document.getElementById('length-input');
const lengthDisplay  = document.getElementById('length-display');
const pwOutput       = document.getElementById('password-output');
const genError       = document.getElementById('gen-error');
const saveError      = document.getElementById('save-error');
const strengthFill   = document.getElementById('strength-fill');
const strengthLabel  = document.getElementById('strength-label');
const labelInput     = document.getElementById('label-input');
const searchInput    = document.getElementById('search-input');
const savedList      = document.getElementById('saved-list');
const countBadge     = document.getElementById('count-badge');

const optUpper = document.getElementById('opt-upper');
const optLower = document.getElementById('opt-lower');
const optNum   = document.getElementById('opt-num');
const optSym   = document.getElementById('opt-sym');

// =============================================
// Length Slider & Number Input Sync
// =============================================

// When slider moves, update number input and display
slider.addEventListener('input', function () {
  lengthDisplay.textContent = slider.value;
  lengthInput.value = slider.value;
});

// When user types in number input, clamp and sync slider
lengthInput.addEventListener('input', function () {
  let v = parseInt(lengthInput.value);
  if (isNaN(v)) return;
  v = Math.max(4, Math.min(50, v));   // Keep within 4–50
  slider.value = v;
  lengthDisplay.textContent = v;
  lengthInput.value = v;
});

// =============================================
// Character Type Tags (visual indicator)
// =============================================

function updateTags() {
  document.getElementById('tag-upper').classList.toggle('active', optUpper.checked);
  document.getElementById('tag-lower').classList.toggle('active', optLower.checked);
  document.getElementById('tag-num').classList.toggle('active', optNum.checked);
  document.getElementById('tag-sym').classList.toggle('active', optSym.checked);
}

// Update tags whenever a checkbox changes
[optUpper, optLower, optNum, optSym].forEach(function (el) {
  el.addEventListener('change', updateTags);
});

// =============================================
// Get & Validate Password Length
// =============================================

function getLength() {
  const v = parseInt(lengthInput.value);
  if (isNaN(v) || v < 4 || v > 50) return null;
  return v;
}

// =============================================
// Generate Password
// =============================================

function generatePassword() {
  genError.textContent = '';  // Clear previous error

  // Validate length
  const len = getLength();
  if (len === null) {
    genError.textContent = '✗ Length must be between 4 and 50.';
    return;
  }

  // Build character pool based on selected options
  const pool = [];
  const guaranteed = [];   // At least one char from each selected type

  if (optUpper.checked) {
    pool.push(...CHARS.upper);
    guaranteed.push(CHARS.upper[Math.floor(Math.random() * CHARS.upper.length)]);
  }
  if (optLower.checked) {
    pool.push(...CHARS.lower);
    guaranteed.push(CHARS.lower[Math.floor(Math.random() * CHARS.lower.length)]);
  }
  if (optNum.checked) {
    pool.push(...CHARS.num);
    guaranteed.push(CHARS.num[Math.floor(Math.random() * CHARS.num.length)]);
  }
  if (optSym.checked) {
    pool.push(...CHARS.sym);
    guaranteed.push(CHARS.sym[Math.floor(Math.random() * CHARS.sym.length)]);
  }

  // Must have at least one type selected
  if (pool.length === 0) {
    genError.textContent = '✗ Select at least one character type.';
    return;
  }

  // Start with guaranteed chars, then fill rest randomly from pool
  let pw = [...guaranteed];
  while (pw.length < len) {
    pw.push(pool[Math.floor(Math.random() * pool.length)]);
  }

  // Shuffle the array (Fisher-Yates algorithm)
  for (let i = pw.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    let temp = pw[i];
    pw[i] = pw[j];
    pw[j] = temp;
  }

  currentPassword = pw.join('');

  // Show generated password on screen
  pwOutput.textContent = currentPassword;
  pwOutput.classList.remove('placeholder');

  // Update strength indicator
  updateStrength(currentPassword);
}

// =============================================
// Password Strength Checker
// =============================================

function updateStrength(pw) {
  let score = 0;

  // Score based on length
  if (pw.length >= 8)  score++;
  if (pw.length >= 14) score++;
  if (pw.length >= 20) score++;

  // Score based on character variety
  if (/[A-Z]/.test(pw))        score++;   // Has uppercase
  if (/[a-z]/.test(pw))        score++;   // Has lowercase
  if (/[0-9]/.test(pw))        score++;   // Has number
  if (/[^A-Za-z0-9]/.test(pw)) score += 2; // Has special character (worth more)

  // Decide strength level based on score
  let level, color, width;

  if (score <= 3) {
    level = 'Weak';
    color = 'var(--red)';
    width = '25%';
  } else if (score <= 5) {
    level = 'Medium';
    color = 'var(--yellow)';
    width = '60%';
  } else {
    level = 'Strong';
    color = 'var(--green)';
    width = '100%';
  }

  // Update the strength bar UI
  strengthLabel.textContent = level;
  strengthLabel.style.color = color;
  strengthFill.style.width = width;
  strengthFill.style.background = color;
  strengthFill.style.boxShadow = '0 0 8px ' + color;
}

// =============================================
// Button Event Listeners — Generate & Refresh
// =============================================

document.getElementById('generate-btn').addEventListener('click', generatePassword);

document.getElementById('refresh-btn').addEventListener('click', function () {
  if (currentPassword) {
    generatePassword();  // Only regenerate if a password already exists
  }
});

// =============================================
// Copy to Clipboard
// =============================================

document.getElementById('copy-btn').addEventListener('click', function () {
  if (!currentPassword) {
    showToast('Nothing to copy!', 'red');
    return;
  }
  navigator.clipboard.writeText(currentPassword).then(function () {
    showToast('✓ Copied to clipboard!');
  });
});

// =============================================
// Save Password to Vault
// =============================================

document.getElementById('save-btn').addEventListener('click', function () {
  saveError.textContent = '';  // Clear previous error

  // Must have a generated password first
  if (!currentPassword) {
    saveError.textContent = '✗ Generate a password first.';
    return;
  }

  // Check for duplicate password
  const isDuplicate = vault.some(function (entry) {
    return entry.password === currentPassword;
  });

  if (isDuplicate) {
    saveError.textContent = '✗ This password is already saved.';
    return;
  }

  // Create new vault entry
  const entry = {
    id: Date.now(),
    password: currentPassword,
    label: labelInput.value.trim(),
    createdAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
  };

  vault.unshift(entry);   // Add to beginning of array
  saveVault();            // Persist to localStorage
  renderVault();          // Refresh the vault UI
  labelInput.value = '';  // Clear label field
  showToast('✓ Saved to vault!');
});

// =============================================
// LocalStorage — Load & Save
// =============================================

function loadVault() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    return [];   // Return empty array if JSON is invalid
  }
}

function saveVault() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vault));
}

// =============================================
// Render Saved Passwords List
// =============================================

function renderVault(filter) {
  filter = filter || '';
  const q = filter.toLowerCase();

  // Filter vault by search query (matches password text or label)
  const filtered = vault.filter(function (e) {
    return e.password.toLowerCase().includes(q) || e.label.toLowerCase().includes(q);
  });

  // Update count badge
  countBadge.textContent = vault.length;

  // Show empty state if nothing found
  if (filtered.length === 0) {
    savedList.innerHTML = '<div class="empty-state">' +
      (vault.length === 0 ? 'No passwords saved yet' : 'No results found') +
      '</div>';
    return;
  }

  // Build HTML for each saved password entry
  savedList.innerHTML = filtered.map(function (e) {
    const labelHTML = e.label
      ? '<div class="saved-label">' + escHtml(e.label) + '</div>'
      : '';

    return (
      '<div class="saved-item" data-id="' + e.id + '">' +
        '<div class="saved-item-body">' +
          labelHTML +
          '<div class="saved-pw">' + escHtml(e.password) + '</div>' +
          '<div class="saved-meta">&#x1F551; ' + e.createdAt + '</div>' +
        '</div>' +
        '<div class="saved-actions">' +
          '<button class="del-btn copy-saved" data-pw="' + escHtml(e.password) + '" title="Copy">&#x2398;</button>' +
          '<button class="del-btn delete-saved" data-id="' + e.id + '" title="Delete">&#x2715;</button>' +
        '</div>' +
      '</div>'
    );
  }).join('');

  // Attach copy events to each vault item's copy button
  savedList.querySelectorAll('.copy-saved').forEach(function (btn) {
    btn.addEventListener('click', function () {
      navigator.clipboard.writeText(btn.dataset.pw).then(function () {
        showToast('✓ Copied!');
      });
    });
  });

  // Attach delete events to each vault item's delete button
  savedList.querySelectorAll('.delete-saved').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const idToDelete = parseInt(btn.dataset.id);
      vault = vault.filter(function (e) {
        return e.id !== idToDelete;
      });
      saveVault();
      renderVault(searchInput.value);
    });
  });
}

// =============================================
// Search / Filter Vault
// =============================================

searchInput.addEventListener('input', function () {
  renderVault(searchInput.value);
});

document.getElementById('clear-search-btn').addEventListener('click', function () {
  searchInput.value = '';
  renderVault();
});

// =============================================
// Toast Notification
// =============================================

function showToast(msg, type) {
  type = type || 'green';
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.background = (type === 'red') ? 'var(--red)' : 'var(--green)';
  t.style.color       = (type === 'red') ? '#fff' : '#000';
  t.classList.add('show');
  setTimeout(function () {
    t.classList.remove('show');
  }, 2200);
}

// =============================================
// Helper — Escape HTML special characters
// (prevents XSS when inserting text into innerHTML)
// =============================================

function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// =============================================
// Initialise App on Page Load
// =============================================

updateTags();       // Set initial tag highlights
renderVault();      // Load saved passwords from localStorage
generatePassword(); // Show a password right away

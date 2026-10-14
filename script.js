// =====================================================
// SMART STYLIST — LUXE FASHION-TECH APPLICATION SCRIPT
// =====================================================

// ================= GLOBAL STATE =================
let wardrobeItems = [];
let savedOutfits = [];
let userPreferences = {
    vibe: "Trendy & Aesthetic",
    campus: "University Campus",
    palette: "Soft Pastels & Blush"
};

let selectedCategory = "";
let selectedOccasion = "College";
let selectedStylePref = "Trendy";
let selectedColorPref = "Any";
let currentWardrobeFilter = "All";

// Try-on Studio State
let studioSlots = {
    Accessory: null,
    Top: null,
    Bottom: null,
    Shoes: null
};
let activeStudioTray = "Top";

// Current Generated Recommendation
let currentRecommendation = null;

// Local Storage Keys
const STORAGE_KEYS = {
    WARDROBE: "smart_stylist_wardrobe_v2",
    SAVED: "smart_stylist_saved_outfits_v2",
    PREFS: "smart_stylist_prefs_v2"
};

// ================= SVG ASSET GENERATORS (OFFLINE RELIABLE VISUALS) =================
// Generates clean, elegant vector illustrations for demo clothing pieces
function generateClothingSVG(type, colorHex = "#b85c7a", secondaryHex = "#ffffff") {
    let svgBody = "";

    switch(type) {
        case "shirt":
            svgBody = `
                <path d="M70,55 L95,65 L115,85 L105,100 L90,88 L90,165 L50,165 L50,88 L35,100 L25,85 L45,65 Z" fill="${colorHex}" stroke="#2a2024" stroke-width="2"/>
                <polygon points="70,55 58,75 70,80 82,75" fill="${secondaryHex}" stroke="#2a2024" stroke-width="1.5"/>
                <line x1="70" y1="80" x2="70" y2="165" stroke="#2a2024" stroke-width="1.5" stroke-dasharray="3,3"/>
            `;
            break;
        case "tee":
            svgBody = `
                <path d="M50,60 Q70,72 90,60 L115,78 L105,98 L92,86 L92,165 L48,165 L48,86 L35,98 L25,78 Z" fill="${colorHex}" stroke="#2a2024" stroke-width="2"/>
                <circle cx="70" cy="110" r="14" fill="${secondaryHex}" opacity="0.8"/>
                <text x="70" y="114" font-size="8" font-family="sans-serif" text-anchor="middle" fill="#2a2024" font-weight="bold">CHIC</text>
            `;
            break;
        case "jeans":
            svgBody = `
                <path d="M46,60 L94,60 L98,165 L76,165 L70,95 L64,165 L42,165 Z" fill="${colorHex}" stroke="#2a2024" stroke-width="2"/>
                <line x1="46" y1="72" x2="94" y2="72" stroke="#2a2024" stroke-width="1.5"/>
                <line x1="70" y1="60" x2="70" y2="95" stroke="#2a2024" stroke-width="1.5"/>
                <path d="M50,78 Q58,85 64,78" fill="none" stroke="${secondaryHex}" stroke-width="1.5"/>
                <path d="M76,78 Q82,85 90,78" fill="none" stroke="${secondaryHex}" stroke-width="1.5"/>
            `;
            break;
        case "trousers":
            svgBody = `
                <path d="M48,58 L92,58 L99,165 L75,165 L70,95 L65,165 L41,165 Z" fill="${colorHex}" stroke="#2a2024" stroke-width="2"/>
                <line x1="70" y1="58" x2="70" y2="95" stroke="#2a2024" stroke-width="1.5"/>
                <line x1="56" y1="85" x2="56" y2="160" stroke="${secondaryHex}" stroke-width="1" opacity="0.6"/>
                <line x1="84" y1="85" x2="84" y2="160" stroke="${secondaryHex}" stroke-width="1" opacity="0.6"/>
            `;
            break;
        case "dress":
            svgBody = `
                <path d="M58,55 L82,55 L90,90 L108,165 L32,165 L50,90 Z" fill="${colorHex}" stroke="#2a2024" stroke-width="2"/>
                <path d="M58,55 Q70,70 82,55" fill="none" stroke="#2a2024" stroke-width="1.5"/>
                <circle cx="60" cy="115" r="4" fill="${secondaryHex}"/>
                <circle cx="80" cy="125" r="4" fill="${secondaryHex}"/>
                <circle cx="50" cy="145" r="4" fill="${secondaryHex}"/>
                <circle cx="72" cy="150" r="4" fill="${secondaryHex}"/>
                <circle cx="92" cy="140" r="4" fill="${secondaryHex}"/>
            `;
            break;
        case "sneakers":
            svgBody = `
                <path d="M30,120 Q50,110 70,110 Q95,110 108,125 L110,140 L30,140 Z" fill="${colorHex}" stroke="#2a2024" stroke-width="2"/>
                <path d="M28,138 L112,138 L112,148 L28,148 Z" fill="${secondaryHex}" stroke="#2a2024" stroke-width="1.5"/>
                <line x1="60" y1="112" x2="68" y2="124" stroke="#2a2024" stroke-width="1.5"/>
                <line x1="70" y1="112" x2="78" y2="124" stroke="#2a2024" stroke-width="1.5"/>
            `;
            break;
        case "heels":
            svgBody = `
                <path d="M35,120 Q60,122 80,105 L105,120 L102,135 Q75,128 50,135 L40,152 L35,152 Z" fill="${colorHex}" stroke="#2a2024" stroke-width="2"/>
                <line x1="40" y1="135" x2="38" y2="152" stroke="#2a2024" stroke-width="3"/>
                <circle cx="85" cy="112" r="3" fill="${secondaryHex}"/>
            `;
            break;
        case "bag":
            svgBody = `
                <path d="M40,85 L100,85 L95,145 L45,145 Z" fill="${colorHex}" stroke="#2a2024" stroke-width="2"/>
                <path d="M55,85 C55,60 85,60 85,85" fill="none" stroke="#2a2024" stroke-width="2.5"/>
                <circle cx="70" cy="98" r="4" fill="${secondaryHex}"/>
                <line x1="70" y1="102" x2="70" y2="114" stroke="${secondaryHex}" stroke-width="2"/>
            `;
            break;
        case "kurti":
            svgBody = `
                <path d="M55,50 L85,50 L110,75 L98,88 L88,78 L88,168 L52,168 L52,78 L42,88 L30,75 Z" fill="${colorHex}" stroke="#2a2024" stroke-width="2"/>
                <path d="M60,50 Q70,72 80,50" fill="none" stroke="${secondaryHex}" stroke-width="2"/>
                <line x1="70" y1="72" x2="70" y2="110" stroke="${secondaryHex}" stroke-width="2"/>
                <line x1="52" y1="130" x2="52" y2="168" stroke="#2a2024" stroke-width="2"/>
                <line x1="88" y1="130" x2="88" y2="168" stroke="#2a2024" stroke-width="2"/>
            `;
            break;
        default:
            svgBody = `<rect x="35" y="55" width="70" height="90" rx="8" fill="${colorHex}" stroke="#2a2024" stroke-width="2"/>`;
    }

    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 180" width="100%" height="100%"><rect width="140" height="180" fill="#fcf9fa"/>${svgBody}</svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);
}

// Curated starter closet for college students and presentations
const SAMPLE_WARDROBE = [
    {
        id: 101,
        name: "Crisp Oxford Cotton Shirt",
        category: "Top",
        color: "White",
        occasion: "College",
        image: generateClothingSVG("shirt", "#ffffff", "#b85c7a"),
        isSample: true
    },
    {
        id: 102,
        name: "College Graphic Oversized Tee",
        category: "Top",
        color: "Pink",
        occasion: "Casual",
        image: generateClothingSVG("tee", "#f8d7e3", "#b85c7a"),
        isSample: true
    },
    {
        id: 103,
        name: "Chic Embroidered Kurti",
        category: "Top",
        color: "Green",
        occasion: "Traditional",
        image: generateClothingSVG("kurti", "#4a7c64", "#f7d794"),
        isSample: true
    },
    {
        id: 104,
        name: "High-Rise Straight Denim",
        category: "Bottom",
        color: "Blue",
        occasion: "College",
        image: generateClothingSVG("jeans", "#4a6fa5", "#ffffff"),
        isSample: true
    },
    {
        id: 105,
        name: "Tailored Wide-Leg Trousers",
        category: "Bottom",
        color: "Beige",
        occasion: "Formal",
        image: generateClothingSVG("trousers", "#e5d4c0", "#8c7258"),
        isSample: true
    },
    {
        id: 106,
        name: "Floral Slip Midi Dress",
        category: "Dress",
        color: "Pink",
        occasion: "Party",
        image: generateClothingSVG("dress", "#d6688b", "#ffffff"),
        isSample: true
    },
    {
        id: 107,
        name: "Clean Minimalist Sneakers",
        category: "Shoes",
        color: "White",
        occasion: "Casual",
        image: generateClothingSVG("sneakers", "#f5f5f5", "#b85c7a"),
        isSample: true
    },
    {
        id: 108,
        name: "Classic Strap Block Heels",
        category: "Shoes",
        color: "Black",
        occasion: "Party",
        image: generateClothingSVG("heels", "#2b2226", "#d9a5b5"),
        isSample: true
    },
    {
        id: 109,
        name: "Campus Canvas Tote Bag",
        category: "Accessory",
        color: "Beige",
        occasion: "College",
        image: generateClothingSVG("bag", "#eee3d5", "#b85c7a"),
        isSample: true
    },
    {
        id: 110,
        name: "Structured Rose Crossbody",
        category: "Accessory",
        color: "Pink",
        occasion: "Party",
        image: generateClothingSVG("bag", "#b85c7a", "#ffffff"),
        isSample: true
    }
];

// Sample demo products for Smart Shopping
const DEMO_PRODUCTS = [
    {
        id: "p1",
        category: "Essential",
        name: "Classic Beige Linen Overshirt",
        price: "₹1,499",
        usdPrice: "$22",
        why: "Adds versatile layering to 8+ casual and college outfits.",
        image: generateClothingSVG("shirt", "#eadecc", "#b85c7a"),
        tag: "College Staple"
    },
    {
        id: "p2",
        category: "Trending",
        name: "Vintage Wash Relaxed Cargo",
        price: "₹1,899",
        usdPrice: "$26",
        why: "High-comfort campus trend paired with graphic tees or fitted tops.",
        image: generateClothingSVG("trousers", "#7a8274", "#ffffff"),
        tag: "Trending on Campus"
    },
    {
        id: "p3",
        category: "Accessory",
        name: "Minimalist Rose Gold Watch",
        price: "₹1,250",
        usdPrice: "$18",
        why: "Elevates any casual look to clean, intentional elegance.",
        image: generateClothingSVG("bag", "#e0b3be", "#ffffff"),
        tag: "Timeless"
    },
    {
        id: "p4",
        category: "Essential",
        name: "Chunky Sole White Street Sneakers",
        price: "₹2,199",
        usdPrice: "$30",
        why: "Maximum durability for all-day campus walking with high style points.",
        image: generateClothingSVG("sneakers", "#ffffff", "#2b2226"),
        tag: "Must Have"
    },
    {
        id: "p5",
        category: "Trending",
        name: "Pleated Satin Slip Skirt",
        price: "₹1,350",
        usdPrice: "$19",
        why: "Effortlessly transitions from college presentation to weekend brunch.",
        image: generateClothingSVG("dress", "#d89fad", "#ffffff"),
        tag: "Chic"
    },
    {
        id: "p6",
        category: "Accessory",
        name: "Layered Dainty Pearl Necklace",
        price: "₹699",
        usdPrice: "$10",
        why: "The ultimate aesthetic accessory for college and traditional fusion.",
        image: generateClothingSVG("bag", "#faf7f2", "#c99355"),
        tag: "Aesthetic"
    }
];

// ================= INITIALIZATION =================
document.addEventListener("DOMContentLoaded", function() {
    loadData();
    setupDropZone();
    displayWardrobe();
    updateStatsAndBadges();
    renderShoppingGrid("All");
    updateGapAnalysis();
    renderStudioCanvas();
    renderStudioPickerTray();
    renderSavedOutfits();

    // Default Section
    showSection("home");
});

// ================= DATA PERSISTENCE =================
function loadData() {
    try {
        const storedWardrobe = localStorage.getItem(STORAGE_KEYS.WARDROBE) || localStorage.getItem("smart_stylist_wardrobe");
        if (storedWardrobe) {
            wardrobeItems = JSON.parse(storedWardrobe);
        } else {
            // First time visitor: seed with starter wardrobe so user experiences the value right away!
            wardrobeItems = [...SAMPLE_WARDROBE];
            saveData(false);
        }

        const storedSaved = localStorage.getItem(STORAGE_KEYS.SAVED);
        if (storedSaved) {
            savedOutfits = JSON.parse(storedSaved);
        }

        const storedPrefs = localStorage.getItem(STORAGE_KEYS.PREFS);
        if (storedPrefs) {
            userPreferences = JSON.parse(storedPrefs);
            applyUserPreferencesToUI();
        }
    } catch (e) {
        console.warn("Could not load from localStorage:", e);
        wardrobeItems = [...SAMPLE_WARDROBE];
    }
}

function saveData(notify = true) {
    try {
        localStorage.setItem(STORAGE_KEYS.WARDROBE, JSON.stringify(wardrobeItems));
        localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(savedOutfits));
        localStorage.setItem(STORAGE_KEYS.PREFS, JSON.stringify(userPreferences));
    } catch (e) {
        console.error("Storage error:", e);
        if (e.name === "QuotaExceededError" || e.code === 22) {
            showToast("Browser storage limit reached! Please delete a few items or use compressed photos.", "warning");
        }
    }
}

function applyUserPreferencesToUI() {
    const vibeEl = document.getElementById("prefVibe");
    const campusEl = document.getElementById("prefCampus");
    const paletteEl = document.getElementById("prefPalette");

    if (vibeEl && userPreferences.vibe) vibeEl.value = userPreferences.vibe;
    if (campusEl && userPreferences.campus) campusEl.value = userPreferences.campus;
    if (paletteEl && userPreferences.palette) paletteEl.value = userPreferences.palette;
}

function saveUserPreferences() {
    const vibeEl = document.getElementById("prefVibe");
    const campusEl = document.getElementById("prefCampus");
    const paletteEl = document.getElementById("prefPalette");

    if (vibeEl) userPreferences.vibe = vibeEl.value;
    if (campusEl) userPreferences.campus = campusEl.value;
    if (paletteEl) userPreferences.palette = paletteEl.value;

    saveData(false);
    showToast("Style preferences updated! ✨", "success");
}

function loadSampleWardrobe(showNotification = true) {
    wardrobeItems = [...SAMPLE_WARDROBE];
    saveData(false);
    displayWardrobe();
    updateStatsAndBadges();
    updateGapAnalysis();
    renderStudioPickerTray();
    if (showNotification) {
        showToast("Curated starter closet loaded with 10 stylish items! ✨", "success");
    }
}

function confirmClearWardrobe() {
    if (wardrobeItems.length === 0) {
        showToast("Your wardrobe is already empty.", "info");
        return;
    }
    if (confirm("Are you sure you want to clear your wardrobe? You can always reload the sample closet.")) {
        wardrobeItems = [];
        saveData(false);
        displayWardrobe();
        updateStatsAndBadges();
        updateGapAnalysis();
        renderStudioPickerTray();
        showToast("Wardrobe cleared.", "info");
    }
}

function confirmResetAllData() {
    if (confirm("This will erase all wardrobe items, saved outfits, and personal preferences from this browser. Proceed?")) {
        localStorage.removeItem(STORAGE_KEYS.WARDROBE);
        localStorage.removeItem(STORAGE_KEYS.SAVED);
        localStorage.removeItem(STORAGE_KEYS.PREFS);
        localStorage.removeItem("smart_stylist_wardrobe");

        wardrobeItems = [];
        savedOutfits = [];
        userPreferences = { vibe: "Trendy & Aesthetic", campus: "University Campus", palette: "Soft Pastels & Blush" };

        displayWardrobe();
        updateStatsAndBadges();
        updateGapAnalysis();
        renderStudioCanvas();
        renderStudioPickerTray();
        renderSavedOutfits();
        applyUserPreferencesToUI();

        showToast("All local prototype data has been reset.", "info");
    }
}

// ================= TOAST NOTIFICATION UTILITY =================
function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    let icon = "✨";
    if (type === "success") icon = "💖";
    if (type === "warning") icon = "⚠️";
    if (type === "error") icon = "❌";

    toast.innerHTML = `<span>${icon}</span> <span>${sanitizeHTML(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(15px) scale(0.95)";
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// Simple HTML sanitizer to prevent XSS
function sanitizeHTML(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ================= PAGE NAVIGATION =================
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll(".section");
    sections.forEach(sec => sec.classList.remove("active"));

    // Activate selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add("active");
    }

    // Update nav button active states
    const navButtons = document.querySelectorAll(".nav-btn");
    navButtons.forEach(btn => {
        if (btn.getAttribute("data-section") === sectionId) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    // Close mobile nav menu if open
    const mainNav = document.getElementById("mainNav");
    if (mainNav) mainNav.classList.remove("mobile-open");

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleMobileNav() {
    const mainNav = document.getElementById("mainNav");
    if (mainNav) {
        mainNav.classList.toggle("mobile-open");
    }
}

// ================= DRAG & DROP AND IMAGE COMPRESSION =================
function setupDropZone() {
    const dropZone = document.getElementById("dropZone");
    if (!dropZone) return;

    ["dragenter", "dragover"].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.add("dragover");
        }, false);
    });

    ["dragleave", "drop"].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove("dragover");
        }, false);
    });

    dropZone.addEventListener("drop", (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files && files.length > 0) {
            handleUploadedFile(files[0]);
        }
    });
}

function previewClothing(event) {
    const file = event.target.files[0];
    if (file) {
        handleUploadedFile(file);
    }
}

// Compresses image using HTML5 Canvas to fit nicely into localStorage (< 40KB)
function handleUploadedFile(file) {
    if (!file.type.startsWith("image/")) {
        showToast("Please upload a valid image file (PNG, JPG, WEBP).", "warning");
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        showToast("Image exceeds 10MB limit. Please choose a smaller photo.", "warning");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            // Resize image to max 420x420 while preserving aspect ratio
            const canvas = document.createElement("canvas");
            let width = img.width;
            let height = img.height;
            const maxDim = 420;

            if (width > height) {
                if (width > maxDim) {
                    height = Math.round((height * maxDim) / width);
                    width = maxDim;
                }
            } else {
                if (height > maxDim) {
                    width = Math.round((width * maxDim) / height);
                    height = maxDim;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            // Export as JPEG at 0.78 quality
            const compressedBase64 = canvas.toDataURL("image/jpeg", 0.78);

            const preview = document.getElementById("imagePreview");
            if (preview) {
                preview.innerHTML = `<img src="${compressedBase64}" alt="Uploaded preview">`;
                preview.dataset.image = compressedBase64;
            }
            showToast("Photo uploaded and optimized for your closet! ✨", "info");
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// ================= WARDROBE CATEGORY SELECTION =================
function selectCategory(category) {
    selectedCategory = category;

    const catInput = document.getElementById("selectedCategoryVal");
    if (catInput) catInput.value = category;

    const categoryText = document.getElementById("selectedCategory");
    if (categoryText) {
        categoryText.textContent = `Selected Category: ${category} ✨`;
    }

    const buttons = document.querySelectorAll("#categoryButtonsContainer .cat-btn");
    buttons.forEach(btn => {
        if (btn.getAttribute("data-cat") === category) {
            btn.classList.add("selected");
        } else {
            btn.classList.remove("selected");
        }
    });
}

// ================= ADD ITEM TO WARDROBE =================
function addToWardrobe() {
    const preview = document.getElementById("imagePreview");
    const image = preview ? preview.dataset.image : "";

    if (!image) {
        showToast("Please upload or drag an image of your clothing item first.", "warning");
        return;
    }

    if (!selectedCategory) {
        showToast("Please select a category (Top, Bottom, Dress, Shoes, or Accessory).", "warning");
        return;
    }

    const nameInput = document.getElementById("itemNameInput");
    const colorInput = document.getElementById("itemColorInput");
    const occasionInput = document.getElementById("itemOccasionInput");

    const itemName = (nameInput && nameInput.value.trim()) 
        ? nameInput.value.trim() 
        : `${colorInput.value} ${selectedCategory}`;

    const item = {
        id: Date.now(),
        name: itemName,
        category: selectedCategory,
        color: colorInput ? colorInput.value : "Multi",
        occasion: occasionInput ? occasionInput.value : "All",
        image: image,
        isSample: false
    };

    wardrobeItems.unshift(item);
    saveData(true);

    // Reset upload form
    preview.innerHTML = "";
    preview.dataset.image = "";
    const fileInput = document.getElementById("clothingImage");
    if (fileInput) fileInput.value = "";
    if (nameInput) nameInput.value = "";

    selectedCategory = "";
    const catInput = document.getElementById("selectedCategoryVal");
    if (catInput) catInput.value = "";

    const categoryText = document.getElementById("selectedCategory");
    if (categoryText) categoryText.textContent = "No category selected. Please choose a category above.";

    const catButtons = document.querySelectorAll("#categoryButtonsContainer .cat-btn");
    catButtons.forEach(btn => btn.classList.remove("selected"));

    // Refresh UI
    displayWardrobe();
    updateStatsAndBadges();
    updateGapAnalysis();
    renderStudioPickerTray();

    showToast(`"${item.name}" added to your closet! ✨`, "success");
}

// ================= DISPLAY & FILTER WARDROBE =================
function filterWardrobe(category, btnElement) {
    currentWardrobeFilter = category;

    const filterPills = document.querySelectorAll(".wardrobe-filters .filter-pill");
    filterPills.forEach(pill => pill.classList.remove("active"));
    if (btnElement) btnElement.classList.add("active");

    displayWardrobe();
}

function displayWardrobe() {
    const grid = document.getElementById("wardrobeGrid");
    if (!grid) return;

    // Filter items
    const filtered = (currentWardrobeFilter === "All") 
        ? wardrobeItems 
        : wardrobeItems.filter(item => item.category.toLowerCase() === currentWardrobeFilter.toLowerCase());

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="empty-wardrobe">
                <span>👗</span>
                <h3>${currentWardrobeFilter === 'All' ? 'Your wardrobe is currently empty' : 'No ' + currentWardrobeFilter + ' items found'}</h3>
                <p>
                    ${currentWardrobeFilter === 'All' 
                        ? 'Upload a photo above or load our curated starter closet to explore outfit recommendations!' 
                        : 'Upload some ' + currentWardrobeFilter.toLowerCase() + ' pieces to see them here.'}
                </p>
                ${currentWardrobeFilter === 'All' ? `
                    <button class="secondary-btn" style="margin-top: 15px;" onclick="loadSampleWardrobe(true)">
                        ✨ Load Starter Wardrobe
                    </button>
                ` : ''}
            </div>
        `;
        return;
    }

    grid.innerHTML = "";
    filtered.forEach(item => {
        const card = document.createElement("div");
        card.className = "wardrobe-item";

        // Dot color helper
        const colorHex = getColorHex(item.color);

        card.innerHTML = `
            <div class="wardrobe-image">
                <img src="${item.image}" alt="${sanitizeHTML(item.name)}" loading="lazy">
                <span class="wardrobe-badge-category">${item.category}</span>
                <span class="wardrobe-color-dot" style="background-color: ${colorHex};" title="Colour: ${item.color}"></span>
            </div>
            <div class="wardrobe-info">
                <div class="wardrobe-name" title="${sanitizeHTML(item.name)}">${sanitizeHTML(item.name)}</div>
                <div class="wardrobe-sub">${item.color} • ${item.occasion || 'Versatile'}</div>
                <div class="wardrobe-item-actions">
                    <button class="btn-tryon-item" onclick="sendItemToStudio(${item.id})">🪞 Try On</button>
                    <button class="btn-delete-item" onclick="deleteItem(${item.id})">Remove</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function deleteItem(id) {
    const itemToDelete = wardrobeItems.find(item => item.id === id);
    const itemName = itemToDelete ? itemToDelete.name : "Item";

    wardrobeItems = wardrobeItems.filter(item => item.id !== id);
    saveData(false);

    displayWardrobe();
    updateStatsAndBadges();
    updateGapAnalysis();
    renderStudioPickerTray();

    showToast(`Removed "${itemName}" from wardrobe.`, "info");
}

function getColorHex(colorName) {
    const map = {
        "White": "#ffffff",
        "Black": "#1a1a1a",
        "Blue": "#3b82f6",
        "Pink": "#ec4899",
        "Beige": "#e5d4c0",
        "Green": "#10b981",
        "Red": "#ef4444",
        "Brown": "#8b5cf6",
        "Grey": "#9ca3af",
        "Yellow": "#f59e0b",
        "Other": "#b85c7a"
    };
    return map[colorName] || "#b85c7a";
}

// ================= STATS & BADGES UPDATES =================
function updateStatsAndBadges() {
    const totalCount = wardrobeItems.length;

    // Badge counts
    const countAll = document.getElementById("countAll");
    const countTop = document.getElementById("countTop");
    const countBottom = document.getElementById("countBottom");
    const countDress = document.getElementById("countDress");
    const countShoes = document.getElementById("countShoes");
    const countAccessory = document.getElementById("countAccessory");

    if (countAll) countAll.textContent = totalCount;
    if (countTop) countTop.textContent = wardrobeItems.filter(i => i.category === "Top").length;
    if (countBottom) countBottom.textContent = wardrobeItems.filter(i => i.category === "Bottom").length;
    if (countDress) countDress.textContent = wardrobeItems.filter(i => i.category === "Dress").length;
    if (countShoes) countShoes.textContent = wardrobeItems.filter(i => i.category === "Shoes").length;
    if (countAccessory) countAccessory.textContent = wardrobeItems.filter(i => i.category === "Accessory").length;

    const wardrobeBadge = document.getElementById("wardrobeCountBadge");
    if (wardrobeBadge) wardrobeBadge.textContent = `${totalCount} ${totalCount === 1 ? 'Item' : 'Items'}`;

    const heroWardrobeCount = document.getElementById("heroWardrobeCount");
    if (heroWardrobeCount) heroWardrobeCount.textContent = totalCount;

    const heroSavedCount = document.getElementById("heroSavedCount");
    if (heroSavedCount) heroSavedCount.textContent = savedOutfits.length;

    const profileCount = document.getElementById("itemCount");
    if (profileCount) profileCount.textContent = totalCount;

    const profileSaved = document.getElementById("savedCount");
    if (profileSaved) profileSaved.textContent = savedOutfits.length;

    const savedOutfitsBadge = document.getElementById("savedOutfitsCountBadge");
    if (savedOutfitsBadge) savedOutfitsBadge.textContent = `${savedOutfits.length} ${savedOutfits.length === 1 ? 'Look' : 'Looks'}`;

    // Calculate dynamic closet versatility score
    const healthScoreEl = document.getElementById("healthScore");
    if (healthScoreEl) {
        let score = 40;
        const hasTops = wardrobeItems.some(i => i.category === "Top");
        const hasBottoms = wardrobeItems.some(i => i.category === "Bottom");
        const hasShoes = wardrobeItems.some(i => i.category === "Shoes");
        const hasAccessories = wardrobeItems.some(i => i.category === "Accessory");

        if (hasTops) score += 15;
        if (hasBottoms) score += 15;
        if (hasShoes) score += 15;
        if (hasAccessories) score += 15;
        healthScoreEl.textContent = `${Math.min(score, 98)}%`;
    }
}

// ================= SMART STYLING ENGINE =================
function selectOccasion(occasion) {
    selectedOccasion = occasion;

    const occasionText = document.getElementById("selectedOccasion");
    if (occasionText) {
        occasionText.textContent = `Selected Occasion: ${occasion}`;
    }

    const buttons = document.querySelectorAll(".occasion-grid .occasion");
    buttons.forEach(btn => {
        if (btn.getAttribute("data-occ") === occasion) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
}

function selectStylePref(style, btnElement) {
    selectedStylePref = style;
    const pills = document.querySelectorAll("#stylePreferencePills .pref-pill");
    pills.forEach(pill => pill.classList.remove("active"));
    if (btnElement) btnElement.classList.add("active");
}

function selectColorPref(color, btnElement) {
    selectedColorPref = color;
    const pills = document.querySelectorAll("#colorPreferencePills .pref-pill");
    pills.forEach(pill => pill.classList.remove("active"));
    if (btnElement) btnElement.classList.add("active");
}

function generateOutfit() {
    if (!selectedOccasion) {
        showToast("Please select an occasion first! ✨", "warning");
        return;
    }

    // 1. Separate wardrobe items by category
    const tops = wardrobeItems.filter(i => i.category === "Top");
    const bottoms = wardrobeItems.filter(i => i.category === "Bottom");
    const dresses = wardrobeItems.filter(i => i.category === "Dress");
    const shoes = wardrobeItems.filter(i => i.category === "Shoes");
    const accessories = wardrobeItems.filter(i => i.category === "Accessory");

    let chosenTop = null;
    let chosenBottom = null;
    let chosenShoes = null;
    let isDressOutfit = false;

    let missingComponents = [];

    // Prioritize dresses for Party / Traditional if available
    if ((selectedOccasion === "Party" || selectedOccasion === "Traditional") && dresses.length > 0 && Math.random() > 0.5) {
        chosenTop = dresses[Math.floor(Math.random() * dresses.length)];
        isDressOutfit = true;
    } else {
        // Pick Top from wardrobe
        if (tops.length > 0) {
            // Match occasion if possible
            const matchingTops = tops.filter(t => t.occasion === selectedOccasion || t.occasion === "All");
            chosenTop = (matchingTops.length > 0) 
                ? matchingTops[Math.floor(Math.random() * matchingTops.length)]
                : tops[Math.floor(Math.random() * tops.length)];
        } else {
            // Suggest unowned item
            chosenTop = getSuggestedItem("Top", selectedOccasion, selectedStylePref);
            missingComponents.push("Top");
        }

        // Pick Bottom from wardrobe
        if (bottoms.length > 0) {
            const matchingBottoms = bottoms.filter(b => b.occasion === selectedOccasion || b.occasion === "All");
            chosenBottom = (matchingBottoms.length > 0)
                ? matchingBottoms[Math.floor(Math.random() * matchingBottoms.length)]
                : bottoms[Math.floor(Math.random() * bottoms.length)];
        } else {
            // Suggest unowned item
            chosenBottom = getSuggestedItem("Bottom", selectedOccasion, selectedStylePref);
            missingComponents.push("Bottom");
        }
    }

    // Pick Shoes
    if (shoes.length > 0) {
        const matchingShoes = shoes.filter(s => s.occasion === selectedOccasion || s.occasion === "All");
        chosenShoes = (matchingShoes.length > 0)
            ? matchingShoes[Math.floor(Math.random() * matchingShoes.length)]
            : shoes[Math.floor(Math.random() * shoes.length)];
    } else {
        chosenShoes = getSuggestedItem("Shoes", selectedOccasion, selectedStylePref);
        missingComponents.push("Shoes");
    }

    // Complementary Accessories
    const accessorySuggestions = getComplementaryAccessories(selectedOccasion, selectedStylePref, accessories);

    // Styling Rationale / Message
    const styleExplanation = getStylistRationale(selectedOccasion, selectedStylePref, chosenTop, chosenBottom, chosenShoes);

    // Cache current recommendation for saving or sending to studio
    currentRecommendation = {
        id: Date.now(),
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        occasion: selectedOccasion,
        style: selectedStylePref,
        top: chosenTop,
        bottom: chosenBottom,
        isDress: isDressOutfit,
        shoes: chosenShoes,
        accessories: accessorySuggestions,
        note: styleExplanation,
        hasMissing: missingComponents.length > 0
    };

    // Render Recommendation Card
    renderRecommendationCard(currentRecommendation);
}

function getSuggestedItem(category, occasion, style) {
    const templates = {
        Top: {
            College: { name: "Oversized Cotton Button-Down", color: "White", image: generateClothingSVG("shirt", "#ffffff", "#b85c7a") },
            Casual: { name: "Relaxed Boxy Graphic Tee", color: "Pink", image: generateClothingSVG("tee", "#fceded", "#b85c7a") },
            Party: { name: "Silky Cowl Neck Camisole", color: "Black", image: generateClothingSVG("shirt", "#282023", "#ffffff") },
            Traditional: { name: "Embroidered Straight Kurti", color: "Green", image: generateClothingSVG("kurti", "#3b6b55", "#f7d794") },
            Formal: { name: "Structured Tailored Blazer & Blouse", color: "Beige", image: generateClothingSVG("shirt", "#dfd3c3", "#282023") }
        },
        Bottom: {
            College: { name: "High-Waist Classic Denim", color: "Blue", image: generateClothingSVG("jeans", "#416788", "#ffffff") },
            Casual: { name: "Wide-Leg Linen Pants", color: "Beige", image: generateClothingSVG("trousers", "#ded4c8", "#b85c7a") },
            Party: { name: "Pleated Liquid Satin Skirt", color: "Black", image: generateClothingSVG("trousers", "#282023", "#ffffff") },
            Traditional: { name: "Flared Silk Palazzo", color: "Cream", image: generateClothingSVG("trousers", "#f8f5ee", "#b85c7a") },
            Formal: { name: "Pleated Ankle-Length Slacks", color: "Black", image: generateClothingSVG("trousers", "#282023", "#dfd3c3") }
        },
        Shoes: {
            College: { name: "Chunky Retro Sneakers", color: "White", image: generateClothingSVG("sneakers", "#ffffff", "#b85c7a") },
            Casual: { name: "Casual Slip-on Mules", color: "Beige", image: generateClothingSVG("sneakers", "#e8ded2", "#282023") },
            Party: { name: "Strappy Ankle-Tie Stilettos", color: "Pink", image: generateClothingSVG("heels", "#b85c7a", "#ffffff") },
            Traditional: { name: "Hand-Embroidered Zari Juttis", color: "Gold", image: generateClothingSVG("heels", "#c99355", "#ffffff") },
            Formal: { name: "Pointed-Toe Leather Loafers", color: "Black", image: generateClothingSVG("heels", "#1a1a1a", "#ffffff") }
        }
    };

    const itemData = (templates[category] && templates[category][occasion]) 
        ? templates[category][occasion] 
        : { name: `Essential ${category}`, color: "Neutral", image: generateClothingSVG("shirt", "#ffffff", "#b85c7a") };

    return {
        id: "suggested_" + Date.now() + Math.random(),
        name: itemData.name,
        category: category,
        color: itemData.color,
        occasion: occasion,
        image: itemData.image,
        isSuggested: true
    };
}

function getComplementaryAccessories(occasion, style, ownedAccessories) {
    const defaultAccs = {
        College: [
            { icon: "👜", title: "Canvas Tote", note: "Holds campus laptop & essentials" },
            { icon: "⌚", title: "Minimalist Watch", note: "Clean rose-gold bezel" },
            { icon: "🕶️", title: "Oval Sunnies", note: "Effortless quad-walk vibes" }
        ],
        Casual: [
            { icon: "🎒", title: "Mini Backpack", note: "Hands-free coffee run" },
            { icon: "🧢", title: "Corduroy Cap", note: "Relaxed off-duty styling" },
            { icon: "💍", title: "Gold Ring Stack", note: "Subtle everyday shine" }
        ],
        Party: [
            { icon: "👛", title: "Sparkle Clutch", note: "Holds phone, gloss & cards" },
            { icon: "✨", title: "Statement Hoops", note: "Dramatizes evening lighting" },
            { icon: "🧣", title: "Silky Skinny Scarf", note: "Y2K evening accent" }
        ],
        Traditional: [
            { icon: "👝", title: "Embroidered Potli", note: "Traditional motif accent" },
            { icon: "🪞", title: "Jhumka Earrings", note: "Classic silver or gold filigree" },
            { icon: "💫", title: "Stacked Bangles", note: "Festive campus celebration" }
        ],
        Formal: [
            { icon: "💼", title: "Structured Brief Tote", note: "Polished presentation finish" },
            { icon: "⌚", title: "Classic Leather Watch", note: "Clean executive detailing" },
            { icon: "📿", title: "Solitaire Pendant", note: "Refined minimalist neckline" }
        ]
    };

    let list = defaultAccs[occasion] || defaultAccs.College;

    // If user has accessories in their closet, prioritize mentioning one!
    if (ownedAccessories && ownedAccessories.length > 0) {
        const owned = ownedAccessories[0];
        list = [
            { icon: "👜", title: owned.name, note: "From Your Wardrobe Collection ✨" },
            ...list.slice(0, 2)
        ];
    }

    return list;
}

function getStylistRationale(occasion, style, top, bottom, shoes) {
    const rationales = {
        College: `We paired ${top.name} with ${bottom ? bottom.name : 'a matching piece'} for an effortless balance of comfort and polish. It stays comfortable across long lectures and looks photo-ready for campus hangouts.`,
        Casual: `This laid-back ensemble blends relaxed silhouettes with clean lines. The ${top.name} keeps things breathable, while ${shoes.name} ensure you're ready for unexpected day adventures.`,
        Party: `A high-impact evening combination! The ${top.name} creates an alluring silhouette with confident proportions. Finish with high-shine jewelry to catch the venue lights.`,
        Traditional: `Rich cultural elegance reimagined for young adults. The intricate details of ${top.name} pair gracefully with comfortable foot styling for festive campus days.`,
        Formal: `Sharp, commanding, and tailored. This look balances modern collegiate energy with career-fair professionalism, giving you confidence during presentations and interviews.`
    };

    return rationales[occasion] || "A well-balanced outfit harmonizing proportions and seasonal tones.";
}

function renderRecommendationCard(rec) {
    const recContainer = document.getElementById("recommendation");
    if (!recContainer) return;

    // Update Badge
    const badge = document.getElementById("recOccasionBadge");
    if (badge) badge.textContent = `${rec.occasion} • ${rec.style} Aesthetic`;

    // Render Top
    const topCard = document.getElementById("recTopCard");
    const topImgWrap = document.getElementById("recTopImgWrap");
    const topName = document.getElementById("recommendedTop");
    const topSource = document.getElementById("recTopSource");
    const topRole = topCard.querySelector(".rec-item-role");

    if (topRole) topRole.textContent = rec.isDress ? "DRESS" : "TOP";
    if (topName) topName.textContent = rec.top.name;
    if (topImgWrap) topImgWrap.innerHTML = `<img src="${rec.top.image}" alt="${sanitizeHTML(rec.top.name)}">`;
    if (topSource) {
        topSource.textContent = rec.top.isSuggested ? "Suggested Addition" : "Wardrobe Match";
        topSource.className = `rec-source-tag ${rec.top.isSuggested ? 'suggested' : 'wardrobe'}`;
    }

    // Render Bottom
    const bottomCard = document.getElementById("recBottomCard");
    const bottomImgWrap = document.getElementById("recBottomImgWrap");
    const bottomName = document.getElementById("recommendedBottom");
    const bottomSource = document.getElementById("recBottomSource");

    if (rec.isDress) {
        if (bottomCard) bottomCard.style.display = "none";
    } else {
        if (bottomCard) bottomCard.style.display = "flex";
        if (bottomName) bottomName.textContent = rec.bottom.name;
        if (bottomImgWrap) bottomImgWrap.innerHTML = `<img src="${rec.bottom.image}" alt="${sanitizeHTML(rec.bottom.name)}">`;
        if (bottomSource) {
            bottomSource.textContent = rec.bottom.isSuggested ? "Suggested Addition" : "Wardrobe Match";
            bottomSource.className = `rec-source-tag ${rec.bottom.isSuggested ? 'suggested' : 'wardrobe'}`;
        }
    }

    // Render Shoes
    const shoesImgWrap = document.getElementById("recShoesImgWrap");
    const shoesName = document.getElementById("recommendedShoes");
    const shoesSource = document.getElementById("recShoesSource");

    if (shoesName) shoesName.textContent = rec.shoes.name;
    if (shoesImgWrap) shoesImgWrap.innerHTML = `<img src="${rec.shoes.image}" alt="${sanitizeHTML(rec.shoes.name)}">`;
    if (shoesSource) {
        shoesSource.textContent = rec.shoes.isSuggested ? "Suggested Addition" : "Wardrobe Match";
        shoesSource.className = `rec-source-tag ${rec.shoes.isSuggested ? 'suggested' : 'wardrobe'}`;
    }

    // Render Accessories
    const accGrid = document.getElementById("recAccessoriesGrid");
    if (accGrid) {
        accGrid.innerHTML = "";
        rec.accessories.forEach(acc => {
            const accCard = document.createElement("div");
            accCard.className = "acc-card";
            accCard.innerHTML = `
                <span class="acc-icon">${acc.icon}</span>
                <div class="acc-details">
                    <h5>${sanitizeHTML(acc.title)}</h5>
                    <p>${sanitizeHTML(acc.note)}</p>
                </div>
            `;
            accGrid.appendChild(accCard);
        });
    }

    // Stylist Message
    const styleMessage = document.getElementById("styleMessage");
    if (styleMessage) styleMessage.textContent = rec.note;

    // Missing Items Notice
    const missingNotice = document.getElementById("missingItemsNotice");
    if (missingNotice) {
        if (rec.hasMissing) {
            missingNotice.classList.remove("hidden");
        } else {
            missingNotice.classList.add("hidden");
        }
    }

    // Unhide recommendation card
    recContainer.classList.remove("hidden");

    // Smooth scroll into view
    setTimeout(() => {
        recContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
}

// Preset outfit recreation from Home Hero Card
function openPresetOutfit(occasion, style) {
    showSection("style");
    selectOccasion(occasion);

    const stylePill = Array.from(document.querySelectorAll("#stylePreferencePills .pref-pill"))
        .find(p => p.textContent.includes(style));
    if (stylePill) selectStylePref(style, stylePill);

    generateOutfit();
}

// ================= SAVING OUTFITS =================
function saveCurrentOutfit() {
    if (!currentRecommendation) {
        showToast("Please generate an outfit combination first! ✨", "warning");
        return;
    }

    // Check duplicate
    const exists = savedOutfits.some(o => 
        o.occasion === currentRecommendation.occasion && 
        o.top.name === currentRecommendation.top.name &&
        (o.bottom ? o.bottom.name : '') === (currentRecommendation.bottom ? currentRecommendation.bottom.name : '')
    );

    if (exists) {
        showToast("This exact outfit is already saved in your profile favourites! 💖", "info");
        return;
    }

    savedOutfits.unshift(currentRecommendation);
    saveData(true);
    updateStatsAndBadges();
    renderSavedOutfits();

    showToast("Outfit saved to your favourites! View in Profile 👤", "success");
}

function sendToTryOnStudio() {
    if (!currentRecommendation) return;

    studioSlots.Top = currentRecommendation.top;
    studioSlots.Bottom = currentRecommendation.bottom || null;
    studioSlots.Shoes = currentRecommendation.shoes;

    // If there is an accessory in wardrobe, populate it
    const ownedAcc = wardrobeItems.find(i => i.category === "Accessory");
    if (ownedAcc) {
        studioSlots.Accessory = ownedAcc;
    }

    renderStudioCanvas();
    showSection("tryon");
    showToast("Outfit loaded into 2D Styling Canvas! 🪞", "info");
}

// ================= OUTFIT STUDIO / VIRTUAL TRY-ON =================
function renderStudioCanvas() {
    renderSlotUI("Accessory", "slotAccessory", "slotAccessoryContent");
    renderSlotUI("Top", "slotTop", "slotTopContent");
    renderSlotUI("Bottom", "slotBottom", "slotBottomContent");
    renderSlotUI("Shoes", "slotShoes", "slotShoesContent");
}

function renderSlotUI(slotType, slotId, contentId) {
    const slotCard = document.getElementById(slotId);
    const contentEl = document.getElementById(contentId);
    const item = studioSlots[slotType];

    if (!slotCard || !contentEl) return;

    if (item) {
        slotCard.classList.add("filled");
        contentEl.innerHTML = `
            <div class="slot-item-preview">
                <img src="${item.image}" alt="${sanitizeHTML(item.name)}" class="slot-item-thumb">
                <div class="slot-item-details">
                    <h5>${sanitizeHTML(item.name)}</h5>
                    <p>${item.color || 'Accent'} • ${item.category}</p>
                </div>
            </div>
        `;
    } else {
        slotCard.classList.remove("filled");
        let icon = "👕";
        if (slotType === "Accessory") icon = "👜";
        if (slotType === "Bottom") icon = "👖";
        if (slotType === "Shoes") icon = "👟";

        contentEl.innerHTML = `
            <span class="slot-placeholder-icon">${icon}</span>
            <span class="slot-placeholder-text">+ Select ${slotType}</span>
        `;
    }
}

function clearStudioSlot(slotType, event) {
    if (event) event.stopPropagation();
    studioSlots[slotType] = null;
    renderStudioCanvas();
    showToast(`${slotType} removed from canvas.`, "info");
}

function resetStudioCanvas() {
    studioSlots = { Accessory: null, Top: null, Bottom: null, Shoes: null };
    renderStudioCanvas();
    showToast("Styling canvas cleared.", "info");
}

function autoAssembleStudioLook() {
    const tops = wardrobeItems.filter(i => i.category === "Top");
    const bottoms = wardrobeItems.filter(i => i.category === "Bottom");
    const dresses = wardrobeItems.filter(i => i.category === "Dress");
    const shoes = wardrobeItems.filter(i => i.category === "Shoes");
    const accs = wardrobeItems.filter(i => i.category === "Accessory");

    if (tops.length === 0 && bottoms.length === 0 && shoes.length === 0) {
        showToast("Your wardrobe is empty! Load the sample closet to try auto-style.", "warning");
        return;
    }

    if (dresses.length > 0 && Math.random() > 0.5) {
        studioSlots.Top = dresses[Math.floor(Math.random() * dresses.length)];
        studioSlots.Bottom = null;
    } else {
        studioSlots.Top = tops.length > 0 ? tops[Math.floor(Math.random() * tops.length)] : null;
        studioSlots.Bottom = bottoms.length > 0 ? bottoms[Math.floor(Math.random() * bottoms.length)] : null;
    }

    studioSlots.Shoes = shoes.length > 0 ? shoes[Math.floor(Math.random() * shoes.length)] : null;
    studioSlots.Accessory = accs.length > 0 ? accs[Math.floor(Math.random() * accs.length)] : null;

    renderStudioCanvas();
    showToast("Auto-styled a random combination from your closet! ✨", "success");
}

function saveStudioLook() {
    if (!studioSlots.Top && !studioSlots.Bottom && !studioSlots.Shoes) {
        showToast("Select at least a top or bottom to save this look! 🪞", "warning");
        return;
    }

    const savedLook = {
        id: Date.now(),
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        occasion: "Studio Creation",
        style: "Custom Studio Mix",
        top: studioSlots.Top || { name: "Open Neckline", image: generateClothingSVG("shirt") },
        bottom: studioSlots.Bottom || { name: "Matching Bottom", image: generateClothingSVG("jeans") },
        isDress: false,
        shoes: studioSlots.Shoes || { name: "Casual Shoes", image: generateClothingSVG("sneakers") },
        accessories: studioSlots.Accessory ? [{ icon: "👜", title: studioSlots.Accessory.name, note: "Curated Accessory" }] : [],
        note: "Crafted on the Smart Stylist interactive 2D canvas."
    };

    savedOutfits.unshift(savedLook);
    saveData(true);
    updateStatsAndBadges();
    renderSavedOutfits();

    showToast("Look saved to your profile favourites! 💖", "success");
}

function openStudioTray(slotType) {
    let targetTray = slotType;
    if (slotType === "Bottom") targetTray = "Bottom";
    switchStudioTray(targetTray);
}

function switchStudioTray(category, btnElement) {
    activeStudioTray = category;

    const tabs = document.querySelectorAll(".picker-tabs .picker-tab");
    tabs.forEach(tab => {
        if (tab.getAttribute("data-tray") === category) {
            tab.classList.add("active");
        } else {
            tab.classList.remove("active");
        }
    });

    renderStudioPickerTray();
}

function renderStudioPickerTray() {
    const grid = document.getElementById("pickerItemsGrid");
    if (!grid) return;

    const items = wardrobeItems.filter(i => i.category.toLowerCase() === activeStudioTray.toLowerCase());

    if (items.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; padding: 30px; text-align: center; color: var(--text-muted);">
                <p>No ${activeStudioTray} items in wardrobe yet.</p>
                <button class="secondary-btn" style="margin-top: 10px;" onclick="showSection('wardrobe')">
                    + Upload ${activeStudioTray}
                </button>
            </div>
        `;
        return;
    }

    grid.innerHTML = "";
    items.forEach(item => {
        const itemCard = document.createElement("div");
        itemCard.className = "picker-item-card";
        itemCard.innerHTML = `
            <img src="${item.image}" alt="${sanitizeHTML(item.name)}" class="picker-item-thumb">
            <span class="picker-item-title">${sanitizeHTML(item.name)}</span>
            <span class="picker-item-sub">${item.color} • ${item.occasion || 'Versatile'}</span>
        `;
        itemCard.onclick = () => {
            selectItemForStudio(item);
        };
        grid.appendChild(itemCard);
    });
}

function selectItemForStudio(item) {
    if (item.category === "Top") {
        studioSlots.Top = item;
    } else if (item.category === "Bottom") {
        studioSlots.Bottom = item;
    } else if (item.category === "Dress") {
        studioSlots.Top = item;
        studioSlots.Bottom = null;
    } else if (item.category === "Shoes") {
        studioSlots.Shoes = item;
    } else if (item.category === "Accessory") {
        studioSlots.Accessory = item;
    }

    renderStudioCanvas();
    showToast(`Placed "${item.name}" on styling board. ✨`, "info");
}

function sendItemToStudio(itemId) {
    const item = wardrobeItems.find(i => i.id === itemId);
    if (!item) return;

    selectItemForStudio(item);
    showSection("tryon");
}

// ================= SMART SHOPPING & GAP ANALYSIS =================
function updateGapAnalysis() {
    const gapMsg = document.getElementById("gapAnalysisMessage");
    if (!gapMsg) return;

    const hasTops = wardrobeItems.some(i => i.category === "Top");
    const hasBottoms = wardrobeItems.some(i => i.category === "Bottom");
    const hasFormal = wardrobeItems.some(i => i.occasion === "Formal");
    const hasTraditional = wardrobeItems.some(i => i.occasion === "Traditional");
    const hasShoes = wardrobeItems.some(i => i.category === "Shoes");

    if (wardrobeItems.length === 0) {
        gapMsg.textContent = "Your digital closet is empty! Start with basic essentials: a crisp white shirt, clean sneakers, and classic blue denim.";
    } else if (!hasFormal) {
        gapMsg.textContent = "High-Impact Gap Detected: You have no formal wear. Adding a structured beige linen blazer or tailored trousers will unlock 6+ presentation looks!";
    } else if (!hasTraditional) {
        gapMsg.textContent = "Campus Event Gap: No traditional wear logged. An embroidered kurti or silk palazzo will complete your college festival wardrobe.";
    } else if (!hasShoes) {
        gapMsg.textContent = "Footwear Gap: Add a pair of minimalist white sneakers to ground both casual and college outfits.";
    } else {
        gapMsg.textContent = "Your closet foundation is solid! Consider complementary accessories (watches, layered jewelry) to multiply styling variety.";
    }
}

function filterShoppingCategory(cat, btnElement) {
    const pills = document.querySelectorAll(".shopping-filter-bar .shop-filter-pill");
    pills.forEach(p => p.classList.remove("active"));
    if (btnElement) btnElement.classList.add("active");

    renderShoppingGrid(cat);
}

function renderShoppingGrid(category) {
    const grid = document.getElementById("shoppingGrid");
    if (!grid) return;

    const filtered = (category === "All") 
        ? DEMO_PRODUCTS 
        : DEMO_PRODUCTS.filter(p => p.category.toLowerCase() === category.toLowerCase());

    grid.innerHTML = "";
    filtered.forEach(prod => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <div class="product-img-wrap">
                <img src="${prod.image}" alt="${sanitizeHTML(prod.name)}">
                <span class="product-demo-tag">DEMO PRODUCT</span>
            </div>
            <div class="product-info">
                <span class="product-category-lbl">${prod.tag}</span>
                <h4 class="product-title">${sanitizeHTML(prod.name)}</h4>
                <p class="product-why-note">${sanitizeHTML(prod.why)}</p>
                <div class="product-price-row">
                    <span class="product-price">${prod.price} <span>(${prod.usdPrice})</span></span>
                </div>
                <div class="product-actions">
                    <button class="btn-try-studio" onclick="tryProductInStudio('${prod.id}')">🪞 Try in Studio</button>
                    <button class="secondary-btn" onclick="showProductDemoNotice('${sanitizeHTML(prod.name)}')">🛍️ View Specs</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function tryProductInStudio(prodId) {
    const prod = DEMO_PRODUCTS.find(p => p.id === prodId);
    if (!prod) return;

    let cat = "Top";
    if (prod.name.includes("Pants") || prod.name.includes("Cargo") || prod.name.includes("Skirt")) cat = "Bottom";
    if (prod.name.includes("Sneakers")) cat = "Shoes";
    if (prod.name.includes("Watch") || prod.name.includes("Necklace") || prod.name.includes("Bag")) cat = "Accessory";

    const demoItem = {
        id: "demo_" + prod.id,
        name: prod.name,
        category: cat,
        color: "Demo",
        image: prod.image,
        isSample: true
    };

    selectItemForStudio(demoItem);
    showSection("tryon");
    showToast(`Loaded "${prod.name}" into your Try-On Studio! 🪞`, "info");
}

function showProductDemoNotice(productName) {
    showToast(`"${productName}" is a prototype showcase piece with ready e-commerce API hooks.`, "info");
}

// ================= SAVED OUTFITS & PROFILE =================
function renderSavedOutfits() {
    const grid = document.getElementById("savedOutfitsGrid");
    if (!grid) return;

    if (savedOutfits.length === 0) {
        grid.innerHTML = `
            <div class="empty-saved-outfits">
                <span>💖</span>
                <h4>No saved outfits yet</h4>
                <p>Generate outfit recommendations in "Style Me" or build combinations in "Virtual Try-On" and click "Save to Favourites"!</p>
                <button class="main-btn" style="margin-top: 15px;" onclick="showSection('style')">
                    ✨ Style An Outfit Now
                </button>
            </div>
        `;
        return;
    }

    grid.innerHTML = "";
    savedOutfits.forEach(outfit => {
        const card = document.createElement("div");
        card.className = "saved-outfit-card";

        // Thumbs preview
        let thumbsHTML = "";
        if (outfit.top && outfit.top.image) {
            thumbsHTML += `<img src="${outfit.top.image}" alt="${sanitizeHTML(outfit.top.name)}" class="saved-item-thumb" title="Top: ${sanitizeHTML(outfit.top.name)}">`;
        }
        if (outfit.bottom && outfit.bottom.image) {
            thumbsHTML += `<img src="${outfit.bottom.image}" alt="${sanitizeHTML(outfit.bottom.name)}" class="saved-item-thumb" title="Bottom: ${sanitizeHTML(outfit.bottom.name)}">`;
        }
        if (outfit.shoes && outfit.shoes.image) {
            thumbsHTML += `<img src="${outfit.shoes.image}" alt="${sanitizeHTML(outfit.shoes.name)}" class="saved-item-thumb" title="Shoes: ${sanitizeHTML(outfit.shoes.name)}">`;
        }

        const itemsSummary = [
            outfit.top ? outfit.top.name : null,
            outfit.bottom ? outfit.bottom.name : null,
            outfit.shoes ? outfit.shoes.name : null
        ].filter(Boolean).join(" + ");

        card.innerHTML = `
            <div class="saved-card-top">
                <span class="saved-occ-tag">${outfit.occasion || 'Custom Look'}</span>
                <span class="saved-date">${outfit.date || 'Saved'}</span>
            </div>
            <div class="saved-items-preview">
                ${thumbsHTML}
            </div>
            <p class="saved-items-text"><strong>Pieces:</strong> ${sanitizeHTML(itemsSummary)}</p>
            <div class="saved-card-actions">
                <button class="btn-wear-look" onclick="wearSavedLook(${outfit.id})">🪞 Open in Studio</button>
                <button class="btn-delete-look" onclick="deleteSavedOutfit(${outfit.id})">Remove</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function wearSavedLook(outfitId) {
    const outfit = savedOutfits.find(o => o.id === outfitId);
    if (!outfit) return;

    studioSlots.Top = outfit.top || null;
    studioSlots.Bottom = outfit.bottom || null;
    studioSlots.Shoes = outfit.shoes || null;
    studioSlots.Accessory = (outfit.accessories && outfit.accessories.length > 0)
        ? { name: outfit.accessories[0].title, image: generateClothingSVG("bag") }
        : null;

    renderStudioCanvas();
    showSection("tryon");
    showToast("Saved look loaded onto styling canvas! ✨", "success");
}

function deleteSavedOutfit(id) {
    savedOutfits = savedOutfits.filter(o => o.id !== id);
    saveData(false);
    updateStatsAndBadges();
    renderSavedOutfits();
    showToast("Removed look from saved outfits.", "info");
}
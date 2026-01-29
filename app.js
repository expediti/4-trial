// Configuration
const JSON_PATH = "videos.json"; // Single source of truth
const CATEGORIES = ["All", "Instagram Viral", "Indian Leaked", "Telegram Viral"];
const PER_PAGE = 16;

// State
let allVideos = [];
let currentCategory = "All";
let currentPage = 1;

// ---------- FETCH DATA ----------
async function initApp() {
    try {
        const res = await fetch(JSON_PATH);
        if (!res.ok) throw new Error("Failed to load videos.json");
        allVideos = await res.json();
        
        // Initialize UI
        initHeader();
        initSearch();
        renderGrid();
    } catch (e) {
        console.error(e);
        document.getElementById("videoGrid").innerHTML = "<p style='text-align:center; padding:20px;'>Error loading videos. Please check videos.json</p>";
    }
}

// ---------- CATEGORY LOGIC ----------
function filterVideos(category) {
    if (category === "All") return allVideos;
    
    // Filter based on simple keyword matching since JSON tags vary
    const keyword = category.split(" ")[0].toLowerCase(); // e.g., "instagram", "indian", "telegram"
    return allVideos.filter(v => 
        (v.title && v.title.toLowerCase().includes(keyword)) ||
        (v.tags && v.tags.some(t => t.toLowerCase().includes(keyword)))
    );
}

function setCategory(name) {
    currentCategory = name;
    currentPage = 1;
    renderGrid();
    updateCategoryUI();
}

function updateCategoryUI() {
    document.querySelectorAll('.cat-btn').forEach(b => {
        if (b.innerText === currentCategory) b.classList.add('active');
        else b.classList.remove('active');
    });
}

// ---------- RENDER GRID ----------
function renderGrid(videosToRender = null) {
    const grid = document.getElementById("videoGrid");
    const pageInfo = document.getElementById("pageInfo");
    const prev = document.getElementById("prev");
    const next = document.getElementById("next");

    if (!grid) return;

    // Determine list to show
    const list = videosToRender || filterVideos(currentCategory);

    // Pagination Calculation
    const totalPages = Math.ceil(list.length / PER_PAGE) || 1;
    if (currentPage > totalPages) currentPage = 1;
    
    const start = (currentPage - 1) * PER_PAGE;
    const end = start + PER_PAGE;
    const pageVideos = list.slice(start, end);

    grid.innerHTML = "";

    pageVideos.forEach(v => {
        const d = document.createElement("div");
        d.className = "card";
        d.innerHTML = `
            <div class="card-thumb-container">
                <img src="${v.thumbnailUrl}" class="card-thumb" loading="lazy" alt="Video">
                <span class="duration-badge">${v.duration || '00:00'}</span>
            </div>
            <div class="card-info">
                <div class="card-title">${v.title}</div>
                <div class="card-meta">
                    <span>${v.views ? v.views.toLocaleString() : '0'} views</span>
                </div>
            </div>
        `;
        d.onclick = () => window.location.href = `watch.html?id=${v.id}`;
        grid.appendChild(d);
    });

    // Update Pagination Controls
    if (pageInfo) pageInfo.innerText = `${currentPage} / ${totalPages}`;
    if (prev) {
        prev.disabled = currentPage === 1;
        prev.onclick = () => { currentPage--; renderGrid(videosToRender); window.scrollTo(0,0); };
    }
    if (next) {
        next.disabled = currentPage === totalPages;
        next.onclick = () => { currentPage++; renderGrid(videosToRender); window.scrollTo(0,0); };
    }
}

// ---------- HEADER INIT ----------
function initHeader() {
    const nav = document.getElementById("categoryTabs");
    if (!nav) return;
    nav.innerHTML = "";

    CATEGORIES.forEach(name => {
        const b = document.createElement("button");
        b.className = "cat-btn";
        if (name === "All") b.classList.add("active");
        b.innerText = name;
        b.onclick = () => setCategory(name);
        nav.appendChild(b);
    });
}

// ---------- SEARCH ----------
function initSearch() {
    const s = document.getElementById("searchInput");
    if (!s) return;

    s.oninput = (e) => {
        const q = e.target.value.toLowerCase();
        if (!q) {
            renderGrid(); // Reset to current category if empty
            return;
        }
        
        const results = allVideos.filter(v => 
            v.title.toLowerCase().includes(q)
        );
        currentPage = 1;
        renderGrid(results);
    };
}

// Start
document.addEventListener("DOMContentLoaded", initApp);

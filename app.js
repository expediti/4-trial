// --- CONFIGURATION ---
const SOURCES = {
    "Instagram Viral": "data/fuckmaza.json",
    "Indian Leaked": "data/bhojpuri.json",
    "Telegram Viral": "data/lol49.json"
};

const PER_PAGE = 16;

// --- STATE ---
let cache = {};
let currentCategory = "All"; 
let currentVideos = [];
let currentPage = 1;

// ---------- FETCHING LOGIC ----------
async function loadDataForCategory(category) {
    const grid = document.getElementById("videoGrid");
    grid.innerHTML = `<div style="text-align:center; padding:20px; color:white;">Loading videos...</div>`;

    try {
        let videosToShow = [];

        // CASE 1: "All" - Fetch EVERYTHING from all 3 files
        if (category === "All") {
            const promises = Object.values(SOURCES).map(async (url) => {
                try {
                    const res = await fetch(url);
                    if (!res.ok) return []; // Skip broken files
                    return await res.json();
                } catch (err) {
                    console.error(`Skipping ${url}:`, err);
                    return [];
                }
            });

            const results = await Promise.all(promises);
            // Merge all files into one big list
            videosToShow = results.flat();
        
        // CASE 2: Specific Category - Fetch ONE file
        } else {
            const url = SOURCES[category];
            if (!cache[url]) {
                const res = await fetch(url);
                if (!res.ok) throw new Error(`File not found: ${url}`);
                cache[url] = await res.json();
            }
            videosToShow = cache[url];
        }

        // --- SHUFFLE LOGIC (The Rotation) ---
        // This makes them random every time you load
        videosToShow = videosToShow.sort(() => Math.random() - 0.5);

        // CHECK IF EMPTY
        if (!videosToShow || videosToShow.length === 0) {
            grid.innerHTML = `<div style="text-align:center; padding:40px; color:#ff4444;">No videos found.</div>`;
            return;
        }

        currentVideos = videosToShow;
        currentPage = 1;
        renderGrid();

    } catch (e) {
        console.error(e);
        grid.innerHTML = `<div style="text-align:center; padding:20px; color:red;">Error loading videos.</div>`;
    }
}

// ---------- CATEGORY BUTTONS UI ----------
function updateCategoryUI(selectedName) {
    const buttons = document.querySelectorAll('.cat-btn');
    buttons.forEach(b => {
        if (b.innerText === selectedName) {
            b.classList.add('active');
        } else {
            b.classList.remove('active');
        }
    });
}

// ---------- RENDER GRID ----------
function renderGrid(customList = null) {
    const grid = document.getElementById("videoGrid");
    const pageInfo = document.getElementById("pageInfo");
    const prev = document.getElementById("prev");
    const next = document.getElementById("next");

    if (!grid) return;

    let list = customList || currentVideos;

    // Pagination
    const totalPages = Math.ceil(list.length / PER_PAGE) || 1;
    if (currentPage > totalPages) currentPage = 1;
    if (currentPage < 1) currentPage = 1;

    const start = (currentPage - 1) * PER_PAGE;
    const end = start + PER_PAGE;
    const pageVideos = list.slice(start, end);

    grid.innerHTML = "";

    pageVideos.forEach(v => {
        // Random Views
        const randomViews = Math.floor(Math.random() * 900 + 100) + 'k';

        const d = document.createElement("div");
        d.className = "card";
        d.innerHTML = `
            <div class="card-thumb-container">
                <img 
                    src="${v.thumbnailUrl}" 
                    class="card-thumb" 
                    loading="lazy"
                    onerror="this.onerror=null; this.src='https://placehold.co/600x400/151525/FFF?text=No+Preview';"
                >
                <span class="duration-badge">${v.duration || '00:00'}</span>
            </div>
            <div class="card-info">
                <div class="card-title">${v.title}</div>
                <div class="card-meta">
                    <span>${randomViews} views</span>
                </div>
            </div>
        `;
        d.onclick = () => window.location.href = `watch.html?id=${v.id}`;
        grid.appendChild(d);
    });

    // Update Controls
    if (pageInfo) pageInfo.innerText = `${currentPage} / ${totalPages}`;
    
    if (prev) {
        prev.disabled = currentPage === 1;
        prev.onclick = () => { currentPage--; renderGrid(customList); window.scrollTo(0,0); };
    }
    if (next) {
        next.disabled = currentPage === totalPages;
        next.onclick = () => { currentPage++; renderGrid(customList); window.scrollTo(0,0); };
    }
}

// ---------- INIT HEADER ----------
function initHeader() {
    const nav = document.getElementById("categoryTabs");
    if (!nav) return;
    nav.innerHTML = "";

    // "All" Button
    const allBtn = document.createElement("button");
    allBtn.className = "cat-btn active";
    allBtn.innerText = "All";
    allBtn.onclick = () => {
        currentCategory = "All";
        updateCategoryUI("All");
        loadDataForCategory("All");
    };
    nav.appendChild(allBtn);

    // Other Buttons
    Object.keys(SOURCES).forEach(name => {
        const b = document.createElement("button");
        b.className = "cat-btn";
        b.innerText = name;
        b.onclick = () => {
            currentCategory = name;
            updateCategoryUI(name);
            loadDataForCategory(name);
        };
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
            renderGrid();
            return;
        }
        const results = currentVideos.filter(v => (v.title && v.title.toLowerCase().includes(q)));
        currentPage = 1;
        renderGrid(results);
    };
}

// ---------- START ----------
document.addEventListener("DOMContentLoaded", () => {
    initHeader();
    initSearch();
    loadDataForCategory("All");
});

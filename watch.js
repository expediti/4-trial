// LIST OF YOUR DATA FILES (Inside data folder)
const DATA_FILES = [
    "data/fuckmaza.json",
    "data/bhojpuri.json",
    "data/lol49.json"
];

// Get ID from URL
const params = new URLSearchParams(window.location.search);
const currentId = params.get("id");

async function initWatch() {
    if (!currentId) { window.location.href = "index.html"; return; }

    // SEO Canonical
    let link = document.querySelector("link[rel='canonical']");
    if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
    }
    link.href = window.location.origin + "/watch.html?id=" + currentId;

    try {
        let foundVideo = null;
        let allVideos = [];

        // 1. Loop through all files to find the video
        for (const url of DATA_FILES) {
            try {
                const res = await fetch(url);
                const data = await res.json();
                
                // Add to main list for suggestions later
                allVideos = allVideos.concat(data);

                // Check if this file has our video
                const match = data.find(v => v.id === currentId);
                if (match) {
                    foundVideo = match;
                }
            } catch (err) {
                console.warn(`Could not load ${url}`, err);
            }
        }

        // 2. If video found, render it
        if (foundVideo) {
            // UI & SEO
            document.title = foundVideo.title + " - XSHIVER";
            document.getElementById("title").innerText = foundVideo.title;
            document.getElementById("description").innerText = foundVideo.description || `Watch ${foundVideo.title} on XSHIVER.`;

            // Tags
            const tagBox = document.getElementById("tags");
            tagBox.innerHTML = "";
            if (foundVideo.tags) {
                foundVideo.tags.forEach(t => {
                    const s = document.createElement("span");
                    s.className = "tag-pill";
                    s.innerText = `#${t}`;
                    tagBox.appendChild(s);
                });
            }

            // --- FLUID PLAYER SETUP (FIXED) ---
            const playerVideoTag = document.getElementById("mainPlayer");
            
            // Set Source
            playerVideoTag.innerHTML = `<source src="${foundVideo.embedUrl}" type="video/mp4" />`;
            
            // Initialize Player
            // NOTICE: I removed the 'logo' section so it won't cover your video!
            fluidPlayer("mainPlayer", {
                layoutControls: {
                    fillToContainer: true,
                    posterImage: foundVideo.thumbnailUrl || '', 
                    autoPlay: false, 
                    playButtonShowing: true,
                    playPauseAnimation: true
                },
                vastOptions: {
                    adList: [
                        {
                            roll: 'preRoll', 
                            vastTag: 'https://s.magsrv.com/v1/vast.php?idzone=5843716' // YOUR AD TAG
                        }
                    ]
                }
            });

            // 3. Render Suggestions
            renderRelated(foundVideo, allVideos);

        } else {
            document.getElementById("title").innerText = "Video not found in any database.";
        }

    } catch (e) {
        console.error("Error loading videos:", e);
        document.getElementById("title").innerText = "Error loading content.";
    }
}

function renderRelated(current, all) {
    const grid = document.getElementById("related");
    if (!grid) return;
    grid.innerHTML = "";

    // Filter, Shuffle, and Slice
    const list = all
        .filter(v => v.id !== current.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 10);

    list.forEach(item => {
        let thumb = item.thumbnailUrl;
        if (thumb.includes("data:image"))
            thumb = "https://placehold.co/600x400/1a1a24/FFF?text=No+Preview";

        const card = document.createElement("div");
        card.className = "card";
        card.onclick = () => (window.location.href = `watch.html?id=${item.id}`);

        card.innerHTML = `
            <div class="card-thumb-container">
                <img src="${thumb}" class="card-thumb" onerror="this.src='https://placehold.co/600x400/1a1a24/FFF?text=No+Image'">
                <span class="duration-badge">${item.duration || "00:00"}</span>
            </div>
            <div class="card-info">
                <div class="card-title">${item.title}</div>
                <div class="card-meta">
                    <span>${item.views || '1k'} views</span>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", initWatch);

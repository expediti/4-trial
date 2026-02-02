const VIDEO_FILE = "data.json";

// Get Video ID from URL
const params = new URLSearchParams(window.location.search);
const currentId = params.get("id");

async function initWatch() {
    // Basic checks
    if (!currentId) { window.location.href = "index.html"; return; }
    
    // Set Canonical URL for SEO
    let link = document.querySelector("link[rel='canonical']");
    if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
    }
    link.href = window.location.origin + "/watch.html?id=" + currentId;

    try {
        const res = await fetch(VIDEO_FILE);
        const allVideos = await res.json();

        // 1. FIND CURRENT VIDEO
        const video = allVideos.find(v => v.id === currentId);

        if (video) {
            // -------- SEO & UI ----------
            document.title = video.title + " - XSHIVER";
            
            // Meta Description
            let descTag = document.querySelector('meta[name="description"]');
            if (!descTag) {
                descTag = document.createElement('meta');
                descTag.name = "description";
                document.head.appendChild(descTag);
            }
            descTag.content = `${video.title} on XSHIVER. Watch HD streaming online.`;

            // UI Updates
            document.getElementById("title").innerText = video.title;
            document.getElementById("description").innerText = video.description || `Watch ${video.title} on XSHIVER.`;

            // Tags
            const tagBox = document.getElementById("tags");
            tagBox.innerHTML = "";
            if (video.tags) {
                video.tags.forEach(t => {
                    const s = document.createElement("span");
                    s.className = "tag-pill";
                    s.innerText = `#${t}`;
                    tagBox.appendChild(s);
                });
            }

            // -------- FLUID PLAYER SETUP (WITH AD) ----------
            const playerVideoTag = document.getElementById("mainPlayer");
            
            // 1. Set source attributes directly
            playerVideoTag.innerHTML = `<source src="${video.embedUrl}" type="video/mp4" />`;
            
            // 2. Initialize Fluid Player
            // We verify the element exists first to avoid errors
            if (playerVideoTag) {
                fluidPlayer("mainPlayer", {
                    layoutControls: {
                        fillToContainer: true,
                        posterImage: video.thumbnailUrl || '', // Video Thumbnail
                        autoPlay: false, 
                        playButtonShowing: true,
                        playPauseAnimation: true,
                        logo: {
                            imageUrl: 'logo.svg', 
                            position: 'top right',
                            clickUrl: 'index.html',
                            opacity: 0.8
                        }
                    },
                    vastOptions: {
                        adList: [
                            {
                                roll: 'preRoll', // Play Ad before video
                                vastTag: 'https://s.magsrv.com/v1/vast.php?idzone=5843716' // YOUR AD TAG
                            }
                        ]
                    }
                });
            }

        } else {
            document.getElementById("title").innerText = "Video not found.";
        }

        // 2. LOAD SUGGESTIONS
        const suggestions = allVideos
            .filter(v => v.id !== currentId)
            .sort(() => 0.5 - Math.random())
            .slice(0, 12);

        renderSuggestions(suggestions);

    } catch (e) {
        console.error("Error loading video:", e);
    }
}

// ---------------- SUGGESTIONS ----------------
function renderSuggestions(list) {
    const grid = document.getElementById("related");
    if (!grid) return;
    
    grid.innerHTML = "";

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

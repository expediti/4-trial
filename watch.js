const id = new URLSearchParams(location.search).get("id");

async function initWatch() {
    if (!id) {
        document.getElementById("title").innerText = "Video Not Found";
        return;
    }

    const SOURCES = [
        "data/fuckmaza.json",
        "data/bhojpuri.json",
        "data/lol49.json"
    ];

    let foundVideo = null;
    let allVideos = [];

    // 1. Fetch all data
    for (const url of SOURCES) {
        try {
            const res = await fetch(url);
            const data = await res.json();
            allVideos = [...allVideos, ...data];
            
            const v = data.find(x => x.id === id);
            if (v) foundVideo = v;
        } catch (e) { console.error(e); }
    }

    // 2. Render Page
    if (foundVideo) {
        // Player
        const player = document.getElementById("player");
        player.src = foundVideo.embedUrl;
        player.poster = foundVideo.thumbnailUrl;
        
        // Info
        document.getElementById("title").innerText = foundVideo.title;
        document.getElementById("description").innerText = foundVideo.description || "";
        
        // Tags
        const tagBox = document.getElementById("tags");
        tagBox.innerHTML = "";
        if(foundVideo.tags) {
            foundVideo.tags.forEach(t => {
                const s = document.createElement("span");
                s.className = "tag-pill";
                s.innerText = `#${t}`;
                tagBox.appendChild(s);
            });
        }

        // 3. Render Suggestions
        renderRelated(foundVideo, allVideos);

    } else {
        document.getElementById("title").innerText = "Video ID not found in database.";
    }
}

function renderRelated(current, all) {
    const list = document.getElementById("related");
    list.innerHTML = "";

    // Shuffle and pick 10
    const suggestions = all
        .filter(v => v.id !== current.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 10);

    suggestions.forEach(v => {
        const d = document.createElement("div");
        d.className = "card";
        
        // Matches new CSS structure to prevent layout breaks
        d.innerHTML = `
            <div class="card-thumb-container">
                <img src="${v.thumbnailUrl}" class="card-thumb" loading="lazy">
                <span class="duration-badge">${v.duration || '00:00'}</span>
            </div>
            <div class="card-info">
                <div class="card-title">${v.title}</div>
                <div class="card-meta">
                    <span>${v.views ? v.views + ' views' : 'New'}</span>
                </div>
            </div>
        `;
        
        d.onclick = () => window.location.href = `watch.html?id=${v.id}`;
        list.appendChild(d);
    });
}

document.addEventListener("DOMContentLoaded", initWatch);

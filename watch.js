const id = new URLSearchParams(location.search).get("id");
const JSON_PATH = "videos.json";

async function initWatch() {
    if (!id) {
        document.getElementById("title").innerText = "Video Not Found";
        return;
    }

    try {
        const res = await fetch(JSON_PATH);
        const allVideos = await res.json();
        
        const foundVideo = allVideos.find(v => v.id === id);

        if (foundVideo) {
            const player = document.getElementById("player");
            player.src = foundVideo.embedUrl;
            player.poster = foundVideo.thumbnailUrl;

            document.getElementById("title").innerText = foundVideo.title;
            document.getElementById("description").innerText = foundVideo.description || "";

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

            renderRelated(foundVideo, allVideos);
        } else {
            document.getElementById("title").innerText = "Video ID not found in database.";
        }
    } catch (e) {
        console.error(e);
        document.getElementById("title").innerText = "Error loading video data.";
    }
}

function renderRelated(current, all) {
    const list = document.getElementById("related");
    list.innerHTML = "";

    const suggestions = all
        .filter(v => v.id !== current.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 10);

    suggestions.forEach(v => {
        // GENERATE RANDOM VIEW COUNT
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
        list.appendChild(d);
    });
}

document.addEventListener("DOMContentLoaded", initWatch);

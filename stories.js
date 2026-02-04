// --- CONFIGURATION: AUDIO DATA ---
// NOTE: Ensure your folders on GitHub are named exactly 'audio1', 'audio2' etc.
const audioStories = [
    {
        id: "1",
        title: "Class 11 hot Sex story - Part 1",
        desc: "sexy gf bf and another girl",
        // path: foldername/filename
        src: "audio1/audio1.mp3", 
        image: "audio1/audio1.jpg", 
        duration: "1:40"
    },
    {
        id: "2",
        title: "More Coming Soon",
        desc: "Coming Soon",
        src: "audio ka link ya path upar wale me se", // Placeholder until you upload audio2
        image: "same image ka bhi",
        duration: "08:15"
    }
];

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. DETECT PAGE ---
    const listContainer = document.getElementById('audioList');
    const playerContainer = document.getElementById('playerSection');

    // --- 2. IF ON LIST PAGE (audio.html) ---
    if (listContainer) {
        listContainer.innerHTML = "";
        audioStories.forEach(story => {
            const card = document.createElement('div');
            card.className = "audio-card";
            card.onclick = () => window.location.href = `listen.html?id=${story.id}`;
            
            // Handle image error
            const imgUrl = story.image.includes('http') ? story.image : story.image; 
            
            card.innerHTML = `
                <img src="${imgUrl}" class="audio-thumb" onerror="this.src='https://placehold.co/100x100/333/FFF?text=Audio'">
                <div class="audio-info">
                    <div class="audio-title">${story.title}</div>
                    <div class="audio-desc">${story.desc}</div>
                    <div style="font-size:0.7rem; color:var(--accent); margin-top:5px;">▶ Play Now • ${story.duration}</div>
                </div>
                <div style="font-size:1.5rem; color:var(--text-secondary);">›</div>
            `;
            listContainer.appendChild(card);
        });
    }

    // --- 3. IF ON PLAYER PAGE (listen.html) ---
    if (playerContainer) {
        const params = new URLSearchParams(window.location.search);
        const currentId = params.get("id");
        
        const story = audioStories.find(s => s.id === currentId);

        if (story) {
            // Render Player
            playerContainer.innerHTML = `
                <div class="player-cover-box">
                    <img src="${story.image}" class="player-cover-img" onerror="this.src='https://placehold.co/600x600/151525/FFF?text=No+Cover'">
                </div>
                <div class="player-controls-box">
                    <div class="player-title">${story.title}</div>
                    <div class="player-subtitle">${story.desc}</div>
                    
                    <audio controls autoplay controlsList="nodownload">
                        <source src="${story.src}" type="audio/mpeg">
                        Your browser does not support the audio element.
                    </audio>
                </div>
            `;
            document.title = "Playing: " + story.title;

            // Render Suggestions
            const grid = document.getElementById('suggestionGrid');
            const suggestions = audioStories.filter(s => s.id !== currentId);
            
            grid.innerHTML = "";
            suggestions.forEach(s => {
                const item = document.createElement('div');
                item.className = "audio-grid-item";
                item.onclick = () => window.location.href = `listen.html?id=${s.id}`;
                item.innerHTML = `
                    <img src="${s.image}" class="audio-grid-img" onerror="this.src='https://placehold.co/300x200/222/FFF?text=Audio'">
                    <div class="audio-grid-title">${s.title}</div>
                `;
                grid.appendChild(item);
            });

        } else {
            playerContainer.innerHTML = `<div style="text-align:center; padding:50px;"><h2>Audio Not Found</h2><a href="audio.html" style="color:var(--accent);">Go Back</a></div>`;
        }
    }
});

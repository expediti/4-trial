// ========================================================
//              ADD YOUR LINKS BELOW
// ========================================================

const proVideos = [
    
    // --- ITEM 1 ---
    {
        image: "pro1.jpg",                  // Name of your image file
        title: "Subhashree Sahu Leaked 10+ videos",   // Title shown to user
        link: "https://www.diskwala.com/app/697dacbd39857e10c605332b"   // Your Affiliate Link
    },

    // --- ITEM 2 ---
    {
        image: "pro3.jpg",
        title: "Milf girl leaked full",
        link: "https://www.diskwala.com/app/697daa3039857e10c60523fc"
    },

    // --- ITEM 3 ---
    {
        image: "pro2.jpg",
        title: "Mother sucking small dick",
        link: "https://www.diskwala.com/app/697daa2f39857e10c60523d4"
    },

    // --- ITEM 4 (Copy this block to add more!) ---
    {
        image: "pro4.jpg",
        title: "coming soon....",
        link: "PASTE_DISK_WALA_LINK_HERE"
    }

];

// ========================================================
//          DO NOT TOUCH THE CODE BELOW
// ========================================================

const grid = document.getElementById("proGrid");

if (grid) {
    grid.innerHTML = "";
    
    proVideos.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";
        
        // This makes the whole card clickable
        card.onclick = () => window.open(item.link, '_blank');

        card.innerHTML = `
            <div class="card-thumb-container">
                <img 
                    src="${item.image}" 
                    class="card-thumb" 
                    loading="lazy"
                    onerror="this.onerror=null; this.src='https://placehold.co/600x400/151525/FFF?text=No+Image';"
                >
                <span class="duration-badge">PRO</span>
            </div>
            <div class="card-info">
                <div class="card-title">${item.title}</div>
                <button class="disk-btn">Get Now</button>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

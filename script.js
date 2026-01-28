fetch("videos.json")
  .then(res => res.json())
  .then(data => {
    const grid = document.getElementById("video-grid");

    data.forEach(video => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${video.thumbnail}" />
        <div class="card-body">
          <div class="card-title">${video.title}</div>
        </div>
      `;

      card.onclick = () => {
        window.location.href = `watch.html?id=${video.id}`;
      };

      grid.appendChild(card);
    });
  });

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch("videos.json")
  .then(res => res.json())
  .then(data => {
    const video = data.find(v => v.id == id);

    if (!video) return;

    document.getElementById("videoPlayer").src = video.video;
    document.getElementById("videoTitle").innerText = video.title;
  });

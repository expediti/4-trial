// Category filtering
document.querySelectorAll('.category').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.category').forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');
        const category = e.target.getAttribute('data-category');
        // Call your existing video loading function with the category filter
        loadVideos(category);
    });
});

// Pagination
document.querySelectorAll('.page-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.page-link').forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');
        const page = e.target.getAttribute('href').replace('/page', '');
        // Call your existing video loading function with the page number
        loadVideos(null, page);
    });
});

// Example function (replace with your actual video loading logic)
function loadVideos(category = 'all', page = 1) {
    // Your existing video fetching logic here
    console.log(`Loading ${category} videos for page ${page}`);
}

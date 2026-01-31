const fs = require("fs");
const videos = require("./videos.json");

const base = "https://xshiver.site";

let xml =
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

<url>
  <loc>${base}/</loc>
  <priority>1.0</priority>
  <changefreq>hourly</changefreq>
</url>
`;

videos.forEach(v => {
  xml += `
<url>
  <loc>${base}/watch.html?id=${v.id}</loc>
  <priority>0.9</priority>
  <changefreq>weekly</changefreq>
</url>`;
});

xml += "\n</urlset>";

fs.writeFileSync("sitemap.xml", xml);
console.log("Sitemap updated");

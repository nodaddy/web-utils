/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://nexonware.com", // Your website URL
  generateRobotsTxt: true, // Creates robots.txt
  sitemapSize: 5000, // Max URLs per sitemap file
  exclude: ["/admin", "/secret"], // Exclude these pages
  generateIndexSitemap: false, // Set to true if you have multiple sitemaps
};

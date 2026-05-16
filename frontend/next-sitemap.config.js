/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://cinepulse.ai',
  generateRobotsTxt: true, // (optional)
  sitemapSize: 7000,
  exclude: ['/admin', '/admin/*'],
}

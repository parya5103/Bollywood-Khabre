const puppeteer = require('puppeteer');
const Parser = require('rss-parser');
const parser = new Parser();

async function scrapePinkvilla() {
    console.log("Scraping Pinkvilla...");
    try {
        const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.goto('https://www.pinkvilla.com/entertainment', { waitUntil: 'domcontentloaded', timeout: 30000 });

        const articles = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.article-card, .list-item')).slice(0, 5).map(card => {
                const titleEl = card.querySelector('h2, h3');
                const linkEl = card.querySelector('a');
                const imgEl = card.querySelector('img');
                return {
                    title: titleEl ? titleEl.innerText : null,
                    link: linkEl ? linkEl.href : null,
                    imageUrl: imgEl ? imgEl.src : null,
                    category: 'Bollywood'
                };
            }).filter(a => a.title && a.link);
        });

        await browser.close();
        return articles;
    } catch (error) {
        console.error("Error scraping Pinkvilla:", error.message);
        return [];
    }
}

async function scrapeRSS(url, category) {
     console.log(`Scraping RSS: ${url}`);
     try {
         const feed = await parser.parseURL(url);
         return feed.items.slice(0, 5).map(item => ({
             title: item.title,
             link: item.link,
             description: item.contentSnippet || item.content,
             pubDate: item.pubDate,
             imageUrl: item.enclosure?.url || '',
             category: category
         }));
     } catch (error) {
         console.error(`Error scraping RSS ${url}:`, error.message);
         return [];
     }
}

module.exports = { scrapePinkvilla, scrapeRSS };

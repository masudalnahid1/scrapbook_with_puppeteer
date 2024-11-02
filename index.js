import puppeteer from "puppeteer";

async function run() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null // Use null for default viewport
    });
    const page = await browser.newPage();

    // Navigate to the quotes website
    await page.goto('https://quotes.toscrape.com', { waitUntil: "domcontentloaded" });

    // Function to scroll the page
    const scrollToBottom = async (scrollCount) => {
        for (let i = 0; i < scrollCount; i++) {
            await page.evaluate(() => {
                window.scrollBy(0, window.innerHeight); // Scroll by the viewport height
            });
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for content to load
        }
    };

    // Scroll down the page to load more quotes
    await scrollToBottom(3); // Adjust the scroll count if needed

    // Wait for quotes to load
    // await page.waitForSelector('div.quote', { timeout: 60000 }); // Wait for quotes to load

    // Extract quotes
    const quotes = await page.evaluate(() => {

        // Get all quotes
        const quotes = document.querySelectorAll('div.quote');

        // Extract quote text and author
        return Array.from(quotes).map(quote => {
            const text = quote.querySelector('.text').innerText;
            const author = quote.querySelector('.author').innerText;
            return { text, author };
        });

    });

    // Log the extracted quotes
    console.log('Quotes:', quotes);
    
    // Close the browser
    await browser.close();
}

// Run the function and catch any errors
run().catch(error => {
    console.error('Error:', error);
});

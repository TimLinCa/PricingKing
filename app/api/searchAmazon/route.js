
import { NextResponse } from 'next/server'
const puppeteer = require("puppeteer-core");
export const dynamic = "force-dynamic";
const chromium = require("@sparticuz/chromium");

const localExecutablePath =
    process.platform === "win32"
        ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
        : process.platform === "linux"
            ? "/usr/bin/google-chrome"
            : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const remoteExecutablePath =
    "https://github.com/Sparticuz/chromium/releases/download/v123.0.1/chromium-v123.0.1-pack.tar";

const isDev = process.env.NODE_ENV === "development";

export async function POST(req) {
    let browser = null;
    try {
        browser = await puppeteer.launch({
            args: isDev ? [] : chromium.args,
            defaultViewport: { width: 1920, height: 1080 },
            executablePath: isDev
                ? localExecutablePath
                : await chromium.executablePath(remoteExecutablePath),
            headless: chromium.headless,
        });
        let sortByOption = 'features';
        let targetResult = 10;
        let rating = null;
        let minReviews = null;
        const resBody = await req.json();
        const productName = resBody['productName'];
        if (resBody['sortByOption'] != null) {
            sortByOption = resBody['sortByOption'];
        }
        if (resBody['itemsNumber'] != null) {
            targetResult = resBody['itemsNumber'];
        }

        if (resBody['rating'] != null) {
            rating = resBody['rating'];
        }

        if (resBody['reviews'] != null) {
            minReviews = resBody['reviews'];
            minReviews = parseInt(minReviews);
        }


        let results = [];
        let gotResults = -1;
        let firstPage = true;

        let page = null;
        let sortURL = null;
        console.log(sortByOption);
        if (sortByOption == 'priceLowToHigh') {
            sortURL = '&s=price-asc-rank';
        }
        else if (sortByOption == 'priceHighToLow') {
            sortURL = '&s=price-desc-rank';
        }
        let url = `https://www.amazon.ca/s?k=${productName}`;
        if (sortURL != null) {
            url = url + sortURL;
        }
        page = await browser.newPage();

        await page.goto(url);
        await waitTillAmazonHTMLRendered(page);

        while (gotResults <= targetResult) {
            if (!firstPage) {
                await waitTillAmazonHTMLRendered(page);
            }
            firstPage = false;
            const searchResults = await page.$$("div.s-result-item[data-component-type='s-search-result']");

            for (let i = 0; i < searchResults.length; i++) {
                const title = await searchResults[i].$eval("h2 span.a-color-base", (n) => n.innerText);
                const link = await searchResults[i].$eval("h2 a.a-link-normal", (n) => n.href);
                const imgPath = await searchResults[i].$eval("img.s-image", (n) => n.src);

                let starts = null;
                const starsElement = await searchResults[i].$("span.a-icon-alt");
                if (rating != null && starsElement == null) continue;

                if (starsElement != null) {
                    let startsStr = await starsElement.evaluate((n) => n.innerText);
                    startsStr = startsStr.split(" ");
                    starts = parseFloat(startsStr[0]).toFixed(1);
                    if (starts < rating) continue;
                }

                let reviews = null;
                const reviewsElement = await searchResults[i].$("span.a-size-base");
                if (minReviews != null && reviewsElement == null) continue;
                if (reviewsElement != null) {
                    reviews = await reviewsElement.evaluate((n) => n.innerText);
                    reviews = reviews.replace(",", "");
                    reviews = parseInt(reviews);
                    if (isNaN(reviews) || reviews < minReviews) continue;
                }

                let price = null;
                const priceElement = await searchResults[i].$("span.a-price[data-a-color='base'] span.a-offscreen");

                if (priceElement != null) {
                    price = await priceElement.evaluate((n) => n.innerText);
                    price = price.replace("$", "");
                }

                gotResults++;

                if (gotResults == targetResult) {
                    break;
                }

                results.push({ title, imgPath, starts, price, link, reviews, "website": "Amazon" });
            }

            if (gotResults == targetResult) {
                break;
            }
            else {
                const disabledNext = await page.$(".s-pagination-next[aria-disabled='true']");
                if (disabledNext != null) {
                    break;
                }
                else {
                    if (await page.$(".s-pagination-next") != null) {
                        await page.waitForSelector(".s-pagination-next");
                        await page.click(".s-pagination-next");
                    }
                    else {
                        break;
                    }
                }
            }
        }

        await browser.close();

        return NextResponse.json(results, { status: 200 });

    }
    catch (err) {
        console.log(err);
        return NextResponse.json({ error: err }, { status: 500 });
    }

}

export async function GET(req) {
    return NextResponse.json(
        {
            "status": "success",
            "message": "POST request was successful"
        }
    );
}

const waitTillAmazonHTMLRendered = async (page, timeout = 5000) => {
    const checkDurationMsecs = 500;
    const maxChecks = timeout / checkDurationMsecs;
    let lastHTMLSize = 0;
    let checkCounts = 1;
    let countStableSizeIterations = 0;
    const minStableSizeIterations = 2;
    await page.waitForSelector(".s-result-list");

    while (checkCounts++ <= maxChecks) {
        let resultListElement = await page.$(".s-result-list");
        let currentHTMLSize = await resultListElement.evaluate((n) => n.innerHTML.length);

        // let bodyHTMLSize = await page.evaluate(() => document.body.innerHTML.length);

        console.log('last: ', lastHTMLSize, ' <> curr: ', currentHTMLSize);

        if (lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize)
            countStableSizeIterations++;
        else
            countStableSizeIterations = 0; //reset the counter

        if (countStableSizeIterations >= minStableSizeIterations) {

            break;
        }

        lastHTMLSize = currentHTMLSize;
        await new Promise(resolve => setTimeout(resolve, checkDurationMsecs));

    }
};


const puppeteer = require("puppeteer");
const random_useragent = require('random-useragent');

import { NextResponse } from 'next/server'

export async function POST(req) {
    console.log(process.env.NEXT_PUBLIC_CRAWLBASE_APIKEY);
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
    let gotResults = 0;
    let firstPage = true;
    let pageNumber = 1;
    let page = null;
    let sortURL = null;
    console.log(sortByOption);
    if (sortByOption == 'priceLowToHigh') {
        sortURL = '&sort=price_low';
    }
    else if (sortByOption == 'priceHighToLow') {
        sortURL = '&sort=price_high';
    }
    let url = `https://www.bestbuy.ca/en-ca/search?${productName}`;
    // let url = `https://www.walmart.ca/en/search?q=${productName}`;

    // if (sortURL != null) {
    //     url = url + sortURL;
    // }
    url = encodeURIComponent(url);
    const API_KEY = process.env.NEXT_PUBLIC_CRAWLBASE_APIKEY;
    const crawlbaseUrl = `https://api.crawlbase.com/scraper?token=${API_KEY}&url=${url}`;
    console.log(crawlbaseUrl);
    const res = await fetch(crawlbaseUrl);
    console.log(res);
    const data = await res.json();
    console.log(data);
    // console.log(url);
    // const response = await api.get(url);
    // console.log(response.body);
    // const $ = cheerio.load(response.body)
    // console.log($);
    // await page.setUserAgent(random_useragent.getRandom());
    // console.log(url)
    // await page.goto(url, { 'timeout': 10000, 'waitUntil': 'load' });
    // await waitTillHTMLRendered(page);

    // while (gotResults < targetResult) {
    //     console.log("Page number: ", pageNumber);
    //     if (!firstPage) {
    //         await waitTillHTMLRendered(page);
    //     }
    //     firstPage = false;

    //     const searchResults = await page.$$("div.pb3-m");
    //     console.log('start searchResults');
    //     console.log(searchResults.length);
    //     for (let i = 0; i < searchResults.length; i++) {
    //         const title = await searchResults[i].$eval("span[data-automation-id='product-title']", (n) => n.innerText);
    //         const link = await searchResults[i].$eval("a.hide-sibling-opacity", (n) => n.href);
    //         const imgPath = await searchResults[i].$eval("img[data-testid='productTileImage']", (n) => n.src);

    //         let starts = null;
    //         let reviews = null;

    //         const reviewsElement = await searchResults[i].$("div.flex.items-center.mt2");
    //         if (rating != null && reviewsElement == null) continue;

    //         if (reviewsElement != null) {
    //             const ratingString = await reviewsElement.$eval("span.w_q67L", (n) => n.innerText);
    //             let starts = (ratingString.split(" out of 5 stars")[0]).toFixed(1);
    //             let reviews = (ratingString.split(" out of 5 stars")[1]).split(" ")[0];
    //             reviews = reviews.replace(",", "");
    //             reviews = parseInt(reviews);
    //             if (isNaN(reviews) || reviews < minReviews) continue;
    //             if (starts < rating) continue;
    //         }


    //         let price = null;
    //         const priceElement = await searchResults[i].$("span[data-automation-id='product-price']");

    //         if (priceElement != null) {
    //             price = await priceElement.evaluate((n) => n.innerText);
    //             price = price.replace("$", "");
    //         }

    //         gotResults++;

    //         if (gotResults == targetResult) {
    //             break;
    //         }

    //         results.push({ title, imgPath, starts, price, link, reviews, "website": "Amazon" });
    //     }

    //     if (gotResults == targetResult) {
    //         break;
    //     }
    //     else {
    //         if (await page.$("a[data-testid='NextPage']") != null) {
    //             pageNumber = pageNumber + 1;
    //             const pageUrl = `&page=${pageNumber}`
    //             await page.goto(url + pageUrl, { 'timeout': 10000, 'waitUntil': 'load' });
    //         }
    //         else {
    //             break;
    //         }
    //     }
    // }

    // await browser.close();
    return NextResponse.json(
        {
            "status": "success",
            "message": "POST request was successful"
        }
    );

}

export async function GET(req, res) {
    res.json(
        {
            "status": "success",
            "message": "POST request was successful"
        }
    );
}

const waitTillHTMLRendered = async (page, timeout = 10000) => {
    const checkDurationMsecs = 1000;
    const maxChecks = timeout / checkDurationMsecs;
    let lastHTMLSize = 0;
    let checkCounts = 1;
    let countStableSizeIterations = 0;
    const minStableSizeIterations = 3;

    while (checkCounts++ <= maxChecks) {
        let html = await page.content();
        let currentHTMLSize = html.length;

        let bodyHTMLSize = await page.evaluate(() => document.body.innerHTML.length);

        console.log('last: ', lastHTMLSize, ' <> curr: ', currentHTMLSize, " body html size: ", bodyHTMLSize);

        if (lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize) {
            countStableSizeIterations++;
        }
        else {
            countStableSizeIterations = 0; //reset the counter
        }

        if (countStableSizeIterations >= minStableSizeIterations) {
            console.log("Page rendered fully..");
            break;
        }

        lastHTMLSize = currentHTMLSize;
        await new Promise(resolve => setTimeout(resolve, checkDurationMsecs));
    }
};

const waitTillWalmartHTMLRendered = async (page, timeout = 5000) => {
    const checkDurationMsecs = 500;
    const maxChecks = timeout / checkDurationMsecs;
    let lastHTMLSize = 0;
    let checkCounts = 1;
    let countStableSizeIterations = 0;
    const minStableSizeIterations = 2;
    await page.waitForSelector("div.w-100.ph2[data-testid='item-stack']");

    while (checkCounts++ <= maxChecks) {
        let resultListElement = await page.$("div.w-100.ph2[data-testid='item-stack']");
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


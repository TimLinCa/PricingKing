// const { CrawlingAPI } = require('crawlbase');
const cheerio = require('cheerio');
// const crawlingAPI = new CrawlingAPI(process.env.NEXT_PUBLIC_CRAWLBASE_APIKEY);

import axios from 'axios';
import { NextResponse } from 'next/server'

export async function POST(req) {
    try {
        let sortByOption = 'features';

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
        let sortURL = null;
        console.log(sortByOption);
        if (sortByOption == 'priceLowToHigh') {
            sortURL = '&sort=price_low';
        }
        else if (sortByOption == 'priceHighToLow') {
            sortURL = '&sort=price_high';
        }
        let url = `https://www.walmart.ca/en/search?q=${productName}&sort=price_low`;

        const API_KEY = process.env.NEXT_PUBLIC_CRAWLBASE_APIKEY;
        const crawlbaseUrl = `https://api.crawlbase.com/scraper?token=${API_KEY}&url=${url}`;
        const options = {
            country: 'CA'
        };
        console.log(crawlbaseUrl);
        const res = await axios.get(crawlbaseUrl, options);

        console.log(res.data.body.products);
        for (let product of res.data.body.products) {
            if (minReviews != null && product['reviewsCount'] < minReviews) {
                continue;
            }
            if (rating != null && product['ratings'] < rating) {
                continue;
            }

            results.push({
                title: product['title'],
                imgPath: product['image'],
                starts: product['ratings'],
                price: product['price'].currentPrice.replace("$", ""),
                link: product['link'],
                reviews: product['reviewsCount'],
                "website": "Walmart"
            });
        }
        return NextResponse.json(results, { status: 200 });
    }
    catch (err) {
        console.log(err);
        return NextResponse.json({ error: err }, { status: 500 });
    }

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


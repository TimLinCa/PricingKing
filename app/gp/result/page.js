"use client";
import { CircularProgress } from "@nextui-org/react";
import ProductList from "../../components/productList";
import axios from "axios";
import useSWR from 'swr';
const cheerio = require('cheerio');
const ScraperApiKey = process.env.NEXT_PUBLIC_SCRAPER_APIKEY;

export default function SearchPage({ searchParams }) {
    console.log(searchParams);
    const wb = searchParams['wb'];
    const productName = searchParams['q'];
    const isRating = searchParams['ir'];
    const isReviews = searchParams['ire'];
    const rating = searchParams['r'];
    const reviews = searchParams['res'];
    const sortByOption = searchParams['sort'];

    const { data: productList, error, isLoading } = useSWR({
        wb: wb,
        productName: productName,
        isRating: isRating,
        rating: rating,
        isReviews: isReviews,
        reviews: reviews,
        sortByOption: sortByOption
    },
        productListFetcher, { revalidateOnFocus: false });

    console.log(error);
    console.log(productList);

    return (
        <div className=" m-8">
            {

                isLoading ? <CircularProgress label="Searching..."></CircularProgress> :
                    error ? <div>Something went wrong, Please try again.</div> :
                        <ProductList productList={productList} />
            }
        </div>
    );
}


const productListFetcher = async (params) => {
    const { wb, productName, isRating, rating, isReviews, reviews, sortByOption } = params;
    const browserAPI = "/api/openBrowser";
    const AmazonAPI = "/api/searchAmazon";
    const WalmartAPI = "/api/searchWalmart";
    console.log(sortByOption);
    const apiKey = process.env.ScraperApiKey;


    const request = {
        "productName": productName,
        "sortByOption": sortByOption,
    }

    if (isRating === 'true') {
        request.rating = rating;
    }

    if (isReviews === 'true') {
        request.reviews = reviews;
    }

    //website, productName, sortByOption, minRating, minReviews, targetResult

    let AmazonProductList = null;
    let WalmartProductList = null;
    if (wb.includes('Amazon')) {

        // const amazon_res = await axios.post(AmazonAPI, request);

        // AmazonProductList = amazon_res.data;

        AmazonProductList = await SearchAmazon(productName, sortByOption);
    }

    if (wb.includes('Walmart')) {

        WalmartProductList = await SearchWalmart(productName, sortByOption);
    }

    //concat two lists
    let productList = [];
    if (AmazonProductList && WalmartProductList) {
        productList = AmazonProductList.concat(WalmartProductList);
    }
    else if (AmazonProductList) {
        productList = AmazonProductList;
    }
    else if (WalmartProductList) {
        productList = WalmartProductList;
    }
    return productList;
}

const parseProductReview = (inputString) => {
    const ratingRegex = /(\d+\.\d+)/;
    const reviewCountRegex = /(\d+) reviews/;

    const ratingMatch = inputString.match(ratingRegex);
    const reviewCountMatch = inputString.match(reviewCountRegex);

    const rating = ratingMatch?.length > 0 ? parseFloat(ratingMatch[0]) : null;
    const reviewCount = reviewCountMatch?.length > 1 ? parseInt(reviewCountMatch[1]) : null;

    return { rating, reviewCount };
};

const SearchWalmart = async (productName, sortByOption) => {
    let sortURL = '&sort=best_seller';
    let WalMartUrl = `https://www.walmart.ca/en/search?q=${productName}`;
    if (sortByOption == 'priceLowToHigh') {
        sortURL = '&sort=price_low';
    }
    else if (sortByOption == 'priceHighToLow') {
        sortURL = '&sort=price_high';
    }

    if (sortURL != null) {
        WalMartUrl = WalMartUrl + sortURL;
    }

    console.log('start scraping');
    // let ScraperApi = `https://api.scraperapi.com/?api_key=${ScraperApiKey}&url=${WalMartUrl}&autoparse=true`;
    const response = await axios.post('/api/searchWalmart', { productName: productName, sortByOption: sortByOption });


    // const amazon_res = await axios.post(ScraperApi);
    console.log(response.data);

    const results = [];
    // console.log(amazon_res.data);
    // for (let product of walMart_res.data.items) {
    //     results.push({
    //         title: product['name'],
    //         imgPath: product['image'],
    //         starts: product['rating'].averageRating,
    //         price: product['price'],
    //         link: product['url'],
    //         reviews: product['rating'].numberOfReviews,
    //         "website": "Walmart"
    //     });
    // }

    return results;
}

const SearchAmazon = async (productName, sortByOption) => {
    let AmazonUrl = `https://www.amazon.ca/s?k=${productName}`;
    let sortURL = null;
    if (sortByOption == 'priceLowToHigh') {
        sortURL = '&s=price-asc-rank';
    }
    else if (sortByOption == 'priceHighToLow') {
        sortURL = '&s=price-desc-rank';
    }
    if (sortURL != null) {
        AmazonUrl = AmazonUrl + sortURL;
    }

    let ScraperApi = `https://api.scraperapi.com/?api_key=${ScraperApiKey}&url=${AmazonUrl}&autoparse=true`;

    const amazon_res = await axios.post(ScraperApi);
    const results = [];
    console.log(amazon_res.data.results);
    for (let product of amazon_res.data.results) {
        results.push({
            title: product['name'],
            imgPath: product['image'],
            starts: product['stars'],
            price: product['price_string'],
            link: product['url'],
            reviews: product['total_reviews'],
            "website": "Amazon"
        });
    }

    return results;
}
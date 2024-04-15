"use client";
import { CircularProgress } from "@nextui-org/react";
import ProductList from "../../../components/productList";
import axios from "axios";
import useSWR from 'swr';
const cheerio = require('cheerio');
const ScraperApiKey = process.env.NEXT_PUBLIC_SCRAPER_APIKEY;
const isDev = process.env.NODE_ENV === "development";
export default function SearchPage({ searchParams }) {

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

    console.log(sortByOption);

    let rating_req = null;
    let reviews_req = null;
    if (isRating === 'true') {
        rating_req = rating;
    }

    if (isReviews === 'true') {
        reviews_req = reviews;
    }

    //website, productName, sortByOption, minRating, minReviews, targetResult
    let AmazonProductList = null;
    let WalmartProductList = null;
    let amazonPromise = null;
    let walmartPromise = null;
    if (wb.includes('Amazon')) {
        amazonPromise = SearchAmazon(productName, sortByOption, rating_req, reviews_req);
    }

    if (wb.includes('Walmart')) {
        walmartPromise = SearchWalmart(productName, sortByOption, rating_req, reviews_req);
    }


    if (amazonPromise) {
        AmazonProductList = await amazonPromise;
    }
    if (walmartPromise) {
        WalmartProductList = await walmartPromise;
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
    productList.sort((a, b) => a.price - b.price);
    return productList;
}

const SearchWalmart = async (productName, sortByOption, rating, reviews) => {

    const request = {
        "productName": productName,
        "sortByOption": sortByOption,
    }

    if (rating != null) {
        request.rating = rating;
    }
    if (reviews != null) {
        request.reviews = reviews;
    }


    const response = await axios.post('/api/searchWalmart', request);

    const results = response.data;

    return results;
}

const SearchAmazon = async (productName, sortByOption, rating, reviews) => {
    let results = [];
    console.log('searching Amazon')
    console.log(isDev);
    if (isDev) {
        const AmazonAPI = "/api/searchAmazon";
        const request = {
            "productName": productName,
            "sortByOption": sortByOption,
        }

        if (rating != null) {
            request.rating = rating;
        }
        if (reviews != null) {
            request.reviews = reviews;
        }

        const amazon_res = await axios.post(AmazonAPI, request);
        results = amazon_res.data;
    }
    else {
        console.log('start scraping Vercel')
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
        console.log("ScraperApi", ScraperApi);
        const amazon_res = await axios.post(ScraperApi);
        console.log(amazon_res.data);
        for (let product of amazon_res.data.results) {
            results.push({
                title: product['name'],
                imgPath: product['image'],
                starts: product['stars'],
                price: product['price'],
                link: product['url'],
                reviews: product['total_reviews'],
                "website": "Amazon"
            });
        }
    }

    return results;
}
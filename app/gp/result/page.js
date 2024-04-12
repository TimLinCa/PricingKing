"use client";
import { CircularProgress } from "@nextui-org/react";
import ProductList from "../../components/productList";
import axios from "axios";
import useSWR from 'swr';

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

    const AmazonAPI = "/api/searchAmazon";
    const WalmartAPI = "/api/searchWalmart";
    console.log(sortByOption);
    const request = {
        "productName": productName,
        "sortByOption": sortByOption,
    }


    console.log(isReviews);
    console.log(isRating);
    if (isRating === 'true') {
        request.rating = rating;
    }

    if (isReviews === 'true') {
        request.reviews = reviews;
    }

    //website, productName, sortByOption, minRating, minReviews, targetResult

    console.log(request);
    let AmazonProductList = null;
    let WalmartProductList = null;
    if (wb.includes('Amazon')) {
        console.log('Run');
        const amazon_res = await axios.post(AmazonAPI, request);
        console.log(amazon_res.data);
        AmazonProductList = amazon_res.data;
    }

    // if (wb.includes('Walmart')) {
    //     const walmart_res = await axios.post(WalmartAPI, request);
    //     WalmartProductList = walmart_res.data;
    // }

    //concat two lists
    let productList = null;
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

"use client";

import React from 'react';
import ProductCard from './productCard';
import { Divider } from "@nextui-org/react";
import useSWR from 'swr';
import axios from "axios";
import { CircularProgress } from "@nextui-org/react";

export default function ProductList(props) {

    const { wb, productName, isRating, rating, isReviews, reviews, sortByOption } = props;

    const { data, error, isLoading } = useSWR({ wb: wb, productName: productName, isRating: isRating, rating: rating, isReviews: isReviews, reviews: reviews, sortByOption: sortByOption }, productListFetcher, { revalidateOnFocus: false });
    console.log(data);
    return (
        <div>
            <div className='mx-2'>
                {
                    isLoading ? <CircularProgress label="Searching..."></CircularProgress> :
                        error ? <div>Something went wrong, Please try again.</div> :
                            data.map((product, index) => {
                                return (
                                    [
                                        <div key={index}>
                                            <ProductCard product={product}></ProductCard>
                                            <Divider className='mx-2' />
                                        </div>
                                    ]
                                )
                            })
                }
            </div >
        </div>
    );
}

const productListFetcher = async (params) => {
    console.log(params);
    console.log('start fetching');
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

    console.log(request);
    let AmazonProductList = null;
    let WalmartProductList = null;
    if (wb.includes('Amazon')) {
        const amazon_res = await axios.post(AmazonAPI, request);
        AmazonProductList = amazon_res.data;
    }

    if (wb.includes('Walmart')) {
        const walmart_res = await axios.post(WalmartAPI, request);
        WalmartProductList = walmart_res.data;
    }

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
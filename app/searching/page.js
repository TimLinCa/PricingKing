'use client';

import { useSearchParams } from "next/navigation";
import { CircularProgress } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useAppContext } from "../context";

const SearchingPage = () => {
    const { setProductList } = useAppContext();

    const productName = useRef("");
    const isRating = useRef(false);
    const rating = useRef(4);
    const isReviews = useRef(false);
    const reviews = useRef(null);
    const searchParams = useSearchParams();

    productName.current = searchParams.get('q');
    isRating.current = searchParams.get('ir');
    rating.current = searchParams.get('r');
    isReviews.current = searchParams.get('ire');
    reviews.current = searchParams.get('res');

    const router = useRouter();
    useEffect(() => {
        const searchAmazon = async (productName) => {
            const request =
            {
                "productName": productName,
            }
            isRating == true ? request.push("rating", rating) : null;
            isReviews == true ? request.push("reviews", reviews) : null;
            console.log(request);
            const productList = await axios.post("/api/searchAmazon", request);
            setProductList(productList.data);
            router.push(`/gp/result?q=${productName}`);
        }

        console.log('start useEffect');
        if (productName !== "") {
            searchAmazon(productName.current, isRating.current, rating.current, isReviews.current, reviews.current);
        }

    }, [router, setProductList]);

    return (
        <div className="m-8">
            <CircularProgress label="Searching..." />
        </div>
    );
}

export default SearchingPage;
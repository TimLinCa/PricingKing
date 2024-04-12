import ProductList from "../../components/productList";

import { SearchProduct } from "../../lib/searchProduct";

const getProductListData = async (wb, productName, isRating, rating, isReviews, reviews, sortByOption, targetResult) => {

    let minRating = null;
    let minReviews = null;
    if (isRating) {
        minRating = rating;
    }
    if (isReviews) {
        minReviews = reviews;
    }
    //website, productName, sortByOption, minRating, minReviews, targetResult
    const productList = await SearchProduct(wb, productName, sortByOption, minRating, minReviews, targetResult);

    return productList;
}

export default async function SearchPage({ params, searchParams }) {
    const wb = searchParams['wb'];
    const productName = searchParams['q'];
    const isRating = searchParams['ir'];
    const isReviews = searchParams['ire'];
    const rating = searchParams['r'];
    const reviews = searchParams['res'];
    const sortByOption = searchParams['sort'];


    const productList = await getProductListData(wb, productName, isRating, rating, isReviews, reviews, sortByOption, 10);

    return (

        <div className=" m-8">
            {
                <ProductList productList={productList}></ProductList>
            }
        </div>
    );
}

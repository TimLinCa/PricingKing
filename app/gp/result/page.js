import ProductList from "../../components/productList";

export default function SearchPage({ params, searchParams }) {
    const wb = searchParams['wb'];
    const productName = searchParams['q'];
    const isRating = searchParams['ir'];
    const isReviews = searchParams['ire'];
    const rating = searchParams['r'];
    const reviews = searchParams['res'];
    const sortByOption = searchParams['sort'];

    return (

        <div className=" m-8">
            {
                <ProductList
                    wb={wb}
                    productName={productName}
                    isRating={isRating}
                    isReviews={isReviews}
                    rating={rating}
                    reviews={reviews}
                    sortByOption={sortByOption} />
            }
        </div>

    );
}

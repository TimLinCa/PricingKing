"use client"
import { useUserAuth } from "../../../_utils/auth-context";
import { useSearchParams } from 'next/navigation'
import { AiOutlinePlus } from "react-icons/ai";
import { Divider, Button } from "@nextui-org/react";
import { addSearchingBookmark, getSearchingBookMarks, deleteSearchingBookmark } from "../../../_sevices/product-searching-services";
import BookMark from "./bookMark"
import { useEffect, useState } from "react";

export default function Sidebar() {
    const pathname = useSearchParams();
    const [refresher, setRefresher] = useState(false);
    const [bookMarks, setBookMarks] = useState([]);
    const { user, gitHubSignIn, firebaseSignOut } = useUserAuth();
    async function signIn() {
        await gitHubSignIn();
    }
    const handleAddBookMark = () => {
        const productName = pathname.get('q');
        if (productName == null || productName == '') return;
        const websites = pathname.get('wb');
        const isRating = pathname.get('ir');
        const ratings = pathname.get('r');
        const isReviews = pathname.get('ir');
        const reviews = pathname.get('res');
        const sortBY = pathname.get('sort');
        addSearchingBookmark(user.uid, { productName: productName, websites: websites, isRating: isRating, ratings: ratings, isReviews: isReviews, reviews: reviews, sortBy: sortBY });
        setRefresher(!refresher);
    }

    const handleDeleteBookMark = (id) => {
        deleteSearchingBookmark(user.uid, id);
        setRefresher(!refresher);
    }

    const handleSignOut = () => {
        firebaseSignOut();
    }

    useEffect(() => {
        const loadItems = async () => {
            if (!user || user.uid == undefined) return;
            const fetchItems = await getSearchingBookMarks(user.uid);
            setBookMarks(fetchItems);
        };
        loadItems();
    }, [user, refresher]);

    const getBookMarks = () => {
        return (
            <div className="overflow-y-auto w-full h-full ">
                <div className="sticky flex flex-row top-0 z-50 p-2 bg-secondary-100">
                    <div className="mr-[15%]"></div>
                    <div className="text-lg flex w-full justify-center items-center mr-[5%]">Bookmarks</div>
                    <div className=" flex justify-end mr-[4%]">
                        <div>
                            <Button onClick={handleAddBookMark} isIconOnly={true} color="primary" variant="ghost" size="sm" className="justify-center ">
                                <div className="flex justify-center">
                                    <AiOutlinePlus></AiOutlinePlus>
                                </div>
                            </Button>
                        </div>
                    </div>
                </div>
                <Divider></Divider>
                <div className="pb-9">
                    {
                        bookMarks ? bookMarks.map((bookmark) => {
                            return (
                                <BookMark
                                    key={bookmark.id}
                                    id={bookmark.id}
                                    productName={bookmark.productName}
                                    websites={bookmark.websites}
                                    ratings={bookmark.isRating == 'true' ? bookmark.ratings : null}
                                    reviews={bookmark.isReviews == 'true' ? bookmark.reviews : null}
                                    sortBy={bookmark.sortBy}
                                    onDeleted={handleDeleteBookMark}></BookMark>
                            )
                        }) : null
                    }
                </div>


                <div className="fixed  bottom-0 z-50 min-w-[9.99%] max-w-[9.99%] p-2 bg-secondary-100">
                    <Divider className="mb-1"></Divider>
                    <div className="grid grid-cols-[66.6%_33.3%]">
                        <div className="text-lg flex w-full justify-center items-center">Hi {user.email.split('@')[0]}</div>
                        <div className="flex justify-end">
                            <div>
                                <Button onClick={handleSignOut} color="primary" variant="ghost" size="sm" className="justify-center ">
                                    <div className="flex justify-center">
                                        Sign out
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>


            </div>


        )

    }

    return (
        <div className="flex  w-[10%] h-full fixed items-center justify-center">
            {
                user ? getBookMarks() : <div className="flex w-full h-full items-center justify-center">
                    <Button onClick={() => signIn()} color="primary" variant="ghost">Log in</Button></div>
            }
            <Divider orientation="vertical" />
        </div>
    );
}
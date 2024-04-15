"use client"
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Avatar, Button } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { AiOutlineMinus } from "react-icons/ai";

export default function BookMark(props) {
    const { id, productName, websites, ratings, reviews, sortBy, onDeleted } = props;
    const router = useRouter();
    const getImgSrc = (websiteName) => {
        if (websiteName == 'Amazon') {
            return "https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg";
        }
        else if (websiteName == 'Walmart') {
            return "https://upload.wikimedia.org/wikipedia/commons/1/14/Walmart_Spark.svg";
        }
    }

    const deleteBookMark = () => {
        onDeleted(id);
    }

    const onPressHandle = () => {
        let isSelectedStarts = false;
        let isSelectedReviews = false;
        let rating_pass = 4;
        if (ratings != null) {
            rating_pass = ratings;
            isSelectedStarts = true;
        }

        let reviews_pass = 100;
        if (reviews != null) {
            reviews_pass = reviews;
            isSelectedReviews = true;
        }

        router.push(`/pages/pk/result?q=${productName}&wb=${websites}&ir=${isSelectedStarts}&r=${rating_pass}&ire=${isSelectedReviews}&res=${reviews_pass}&sort=${sortBy}`);
    }

    const getWebIcons = () => {
        const webSplit = websites.split(',');
        return (

            <div className="flex flex-row gap-3 flex-1 ">
                {
                    webSplit.map((website, index) => {
                        return (
                            <Avatar
                                key={index}
                                color='secondary'
                                className=" max-h-[20px] max-w-[20px] "
                                name={website}
                                src={getImgSrc(website)} />
                        )
                    })
                }
            </div>
        )
    }
    return (
        <div className="flex items-center justify-center max-w-[500px] m-2">

            <Card isPressable={true} onPress={() => onPressHandle()} className="w-full">
                <CardHeader >

                    <div className="flex flex-row w-full gap-2  items-center">
                        <p className="text-md ">{productName}</p>
                        {getWebIcons()}
                        <div className="flex mr-2 justify-end">
                            <Button onClick={deleteBookMark} color="danger" size="sm" variant="ghost" isIconOnly={true}>
                                <AiOutlineMinus size={15} />
                            </Button>
                        </div>
                    </div>


                </CardHeader>
                <Divider />
                <CardBody className="flex flex-col gap-2 justify-center">
                    <div>
                        {ratings ? <p>{'Rating >'} {ratings}</p> : null}
                        {reviews ? <p>{'Reviews > '} {reviews}</p> : null}
                        {sortBy ? <p>{'Order by : '} {sortBy}</p> : null}
                    </div>

                </CardBody>

            </Card>

        </div>

    );
}
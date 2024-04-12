import { Rating } from 'react-simple-star-rating'
import { Image, Link, Chip, Avatar } from "@nextui-org/react";
export default function ProductCard({ product }) {

    const getChipByWebsite = () => {
        switch (product.website) {
            case "Amazon":
                return <div className='flex items-center'>
                    <Link style={{ display: "table-cell" }} target='_blank' href={"https://www.amazon.ca/"} >
                        <Chip radius="md" className='pl-1 max-w-[28px]' color="warning" variant="bordered" avatar={
                            <Avatar color='secondary' name="Amazon" src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg" />
                        }>Amazon</Chip>
                    </Link>
                </div>
            case 'Walmart':
                return <div className='flex items-center'>
                    <Link style={{ display: "table-cell" }} target='_blank' href={"https://www.walmart.ca/"} >
                        <Chip radius="md" className='pl-1 max-w-[28px]' color="success" variant="bordered" avatar={
                            <Avatar color='secondary' name="Walmart" src="https://upload.wikimedia.org/wikipedia/commons/1/14/Walmart_Spark.svg" />
                        }>Walmart</Chip>
                    </Link>
                </div>
        }
    }




    return (
        <div className="w-[1200px] grid grid-cols-[25%_80%] max-h-[200px]">
            {/* <div className="bg-cover bg-center h-56 p-4" style={{ backgroundImage: `url(${product.image})` }}>Image</div> */}
            <div className='bg-zinc-100 self-center max-h-[200px] flex justify-center items-center'>
                <Link className='justify-center items-center' style={{ display: "table-cell" }} target='_blank' href={product.link}>
                    <div className='  justify-center max-h-[200px] items-center'>
                        <Image
                            isZoomed
                            alt="Woman listing to music"
                            className="object-contain  max-h-[180px] w-full"
                            src={product.imgPath}
                            height={200}
                        />
                    </div>
                </Link>

            </div>

            <div className="grid grid-rows-4 p-4 gap-6 max-h-[200px]">
                <Link className="self-center justify-self-cente pl-1 font-semibold text-lg text-blue-500" style={{ display: "table-cell" }} target='_blank' href={product.link} >
                    <p>{product.title}</p>
                </Link>
                <div className='flex flex-row items-center'>
                    {product.starts ? <Rating SVGstyle={{ 'display': 'inline' }} initialValue={product.starts} allowFraction={true} readonly={true} /> : <div></div>}
                    {product.reviews ? <p className='text-secondary-50 text-xl'>{`(${product.reviews})`}</p> : <div></div>}
                </div>

                {product.price ? <p className="flex items-center pl-1 text-secondary-50 font-semibold text-4xl">${product.price}</p> : <p className="flex items-center pl-1 text-secondary-50 font-semibold text-xl">Price is hidden, check the price in the product page</p>}
                {getChipByWebsite()}
            </div>
        </div >
    );
}
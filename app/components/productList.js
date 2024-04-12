import React from 'react';
import ProductCard from './productCard';
import { Divider, ScrollShadow } from "@nextui-org/react";

export default function ProductList(props) {
    const { productList } = props;

    return (
        <div>
            <Divider className='mx-2' />
            <div className='mx-2'>
                {
                    productList.map((product, index) => {
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
"use client";
import Image from "next/image";
import React from 'react';
import { useRouter } from 'next/navigation';
import { AiOutlineSearch } from 'react-icons/ai';
import logo from "../images/logo.png";
import ThemeSwitcher from "./ThemeSwitcher";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, cn, Divider, Avatar, Checkbox, Input } from "@nextui-org/react";
import { Popover, PopoverTrigger, PopoverContent, Link } from "@nextui-org/react";
import { useState } from "react";
import { Rating } from 'react-simple-star-rating'
const isDev = process.env.NODE_ENV === "development";
const Header = (props) => {

    const [selectedKeys, setSelectedKeys] = React.useState(new Set(["Amazon"]));
    const [isSelectedReviews, setIsSelectedReviews] = React.useState(false);
    const [isSelectedStarts, setIsSelectedStarts] = React.useState(false);
    const [rating, setRating] = React.useState(4);
    const [searchQuery, setSearchQuery] = useState('');

    const router = useRouter();
    const [reviews, setReviews] = useState(0);
    const handleRating = (rate) => { setRating(rate) }

    const [selectedSortKeys, setSelectedSortKeys] = React.useState(new Set(["Default"]));

    const selectedSortValue = React.useMemo(
        () => Array.from(selectedSortKeys).join(", ").replaceAll("_", " "),
        [selectedSortKeys]
    );

    async function handleAboutMeClick(e) {
        router.push(`/pages/subPages/about`);
    }

    async function handleSearch(e) {
        e.preventDefault();
        const websites = Array.from(selectedKeys).join('+');

        const encodeSearchQuery = encodeURI(searchQuery);
        if (encodeSearchQuery != null && encodeSearchQuery != '') {

            let sortByOption = '';
            if (selectedSortValue === "Default") {
                sortByOption = '&sort=default';
            }
            if (selectedSortValue === "Price: Low To High") {
                sortByOption = '&sort=priceLowToHigh';
            }
            else if (selectedSortValue === "Price: High To Low") {
                sortByOption = '&sort=priceHighToLow';
            }
            router.push(`/pages/pk/result?q=${encodeSearchQuery}&wb=${websites}&ir=${isSelectedStarts}&r=${rating}&ire=${isSelectedReviews}&res=${reviews}${sortByOption}`);
        }
    }

    return (
        <div className='header sticky top-0 z-50 bg-secondary-100'>
            <div>
                <div className='flex flex-row py-[15px]'>
                    <div className="flex-1 ml-5">
                        <div className="flex flex-row ">
                            <Image
                                src={logo}
                                width={50}
                                height={100}
                                alt="Picture of the logo"
                            />

                            <div className="flex flex-1 justify-end items-center mr-4">

                                <div className="mr-4">
                                    <Dropdown>
                                        <DropdownTrigger>
                                            <Button color="primary" variant="ghost">Website</Button>
                                        </DropdownTrigger>
                                        <DropdownMenu
                                            selectionMode="multiple"
                                            disallowEmptySelection
                                            closeOnSelect={false}
                                            variant="flat"
                                            selectedKeys={selectedKeys}
                                            onSelectionChange={setSelectedKeys}
                                        >
                                            <DropdownItem
                                                key="Amazon"
                                                startContent={<Avatar color='secondary' className=" max-h-[20px] max-w-[20px] " name="Amazon" src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg" />}
                                            >Amazon
                                            </DropdownItem>
                                            <DropdownItem
                                                isReadOnly={isDev ? false : true}
                                                key="Walmart"
                                                startContent={<Avatar color='secondary' className=" max-h-[20px] max-w-[20px] " name="Amazon" src="https://upload.wikimedia.org/wikipedia/commons/1/14/Walmart_Spark.svg" />}
                                            >Walmart
                                            </DropdownItem>

                                        </DropdownMenu>

                                    </Dropdown>
                                </div>

                                <div className="mr-4">
                                    <Popover >
                                        <PopoverTrigger>
                                            <Button color="primary" variant="ghost">Rating</Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <div className="flex flex-row justify-start  w-full ml-1">
                                                <Checkbox isSelected={isSelectedStarts} onValueChange={setIsSelectedStarts} defaultSelected></Checkbox>
                                                <Rating SVGstyle={{ 'display': 'inline' }} initialValue={rating} onClick={handleRating} readonly={!isSelectedStarts} allowFraction={true} />
                                            </div>
                                            <div className="flex flex-row  w-full ml-1">
                                                <Checkbox isSelected={isSelectedReviews} onValueChange={setIsSelectedReviews} defaultSelected></Checkbox>
                                                <Input
                                                    className="max-w-[200px]"
                                                    isDisabled={!isSelectedReviews}
                                                    type='number'
                                                    size={20}
                                                    value={reviews}
                                                    onValueChange={setReviews}
                                                    startContent={
                                                        <p>Reviews</p>
                                                    } />
                                            </div>

                                        </PopoverContent>
                                    </Popover >
                                </div>

                                <div className="w-[145px]">
                                    <Dropdown className="w-full">
                                        <DropdownTrigger>
                                            <Button
                                                color="primary"
                                                variant="ghost"
                                                className="capitalize w-full"
                                            >
                                                {selectedSortValue}
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu
                                            aria-label="Single selection example"
                                            variant="flat"
                                            disallowEmptySelection
                                            selectionMode="single"
                                            selectedKeys={selectedSortKeys}
                                            onSelectionChange={setSelectedSortKeys}
                                        >
                                            <DropdownItem key="Default">Default</DropdownItem>
                                            <DropdownItem key="Price: Low To High">Price: Low to High</DropdownItem>
                                            <DropdownItem key="Price: High To Low">Price High to Low</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>

                            </div>
                        </div>


                    </div>

                    <div className="self-center">
                        <form className='w-[440px]' onSubmit={handleSearch} >
                            <div className="relative">
                                <input onChange={(e) => setSearchQuery(e.target.value)} type="search" placeholder='Type product name here' className='border w-full max-h-[55px] p-4 rounded-full bg-slate-50'></input>
                                <button className='absolute max-h-[45px] right-1 top-1/2 -translate-y-1/2 p-4 bg-slate-50 rounded-full'>
                                    <AiOutlineSearch />
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="flex-1 self-center ">

                        <div className="flex flex-row items-center justify-end">

                            <div className="mr-4">
                                <Link href="/pages/subPages/about" color="primary">ABOUT ME</Link>
                            </div>


                            <div className="mr-2">
                                <ThemeSwitcher></ThemeSwitcher>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
            <Divider />
        </div >
    );
}

export default Header;
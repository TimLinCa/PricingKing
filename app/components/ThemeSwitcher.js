'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes';
import { MoonIcon } from "../images/MoonIcon";
import { SunIcon } from "../images/SunIcon";

import { Switch, VisuallyHidden, useSwitch } from "@nextui-org/react";
export default function ThemeSwitcher(props) {
    const {
        Component,
        slots,
        isSelected,
        getBaseProps,
        getInputProps,
        getWrapperProps,
    } = useSwitch(props);

    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()
    const { themeString, setThemeString } = useState("");

    const setIsSelected = (value) => {
        console.log(value);
        setTheme(value ? "dark" : "light");
        setThemeString(value ? "dark" : "light");
    }

    useEffect(() => setMounted(true), []);
    useEffect(() => {
        const changeTheme = () => {
            isSelected ? setTheme("light") : setTheme("dark");
        }
        changeTheme();
    }, [isSelected, setTheme])

    if (!mounted) return null;

    return (
        <div>
            <Component  {...getBaseProps()}>
                <VisuallyHidden>
                    <input {...getInputProps()} />
                </VisuallyHidden>
                <div
                    {...getWrapperProps()}
                    className={slots.wrapper({
                        class: [
                            "w-8 h-8",
                            "flex items-center justify-center",
                            "rounded-lg bg-default-100 hover:bg-default-200",
                        ],
                    })}
                >
                    {isSelected ? <SunIcon /> : <MoonIcon />}
                </div>

            </Component>
        </div>
    )
}


// app/providers.tsx
'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
export default function Providers({ children }) {
    return (
        <NextUIProvider>
            <NextThemesProvider
                attributes='class'
                defaultTheme='light'
                themes={['light', 'dark']}>
                {children}
            </NextThemesProvider>
        </NextUIProvider>
    )
}
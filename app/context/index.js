'use client'

import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppWrapper({ children }) {
    let [productList, setProductList] = useState([]);

    return (
        <AppContext.Provider value={{
            productList,
            setProductList
        }}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext() {
    return useContext(AppContext);
}
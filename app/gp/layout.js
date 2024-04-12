import { Inter } from "next/font/google";
import "../globals.css";
import Providers from "../Provider";
import Header from "../components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Pricing King",
    description: "Generated by create next app",
};

export default function RootLayout({ children }) {
    return (

        <div>
            <Header></Header>
            <div className="grid grid-cols-[20%_80%]">
                <div></div>
                <div>{children}</div>
            </div>
        </div>



    );
}

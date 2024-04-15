import Image from 'next/image'
import logo from "../../../images/logo.png";

export default function Home() {
    return (
        <div className="flex h-[calc(100vh-95px)] items-center justify-center mr-[15%]">
            <Image
                src={logo}
                alt="Picture of the logo"
            />
        </div>
    );
}

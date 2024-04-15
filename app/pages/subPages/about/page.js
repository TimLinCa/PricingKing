import Image from 'next/image'
import headShot from "../../../images/1670413686295.jpeg";
import { Button } from "@nextui-org/react";
import { AiFillGithub } from "react-icons/ai";
import { Link } from "@nextui-org/react";
import { AiOutlineMail } from "react-icons/ai";

export default function About() {
    return (
        <div className="flex flex-row h-[calc(100vh-95px)] items-center justify-center ">
            <div className='mr-12 h-[600px] overflow-hidden rounded-full bg-slate-200'>
                <Image height={600} src={headShot} alt="headShot"></Image>
            </div>
            <article className='h-[600px] text-pretty w-2/12' >
                <p className='text-secondary-50 text-8xl mb-20 font-bold'>Hello</p>
                <p className='text-secondary-50 text-3xl ml-1 font-semibold'> A Bit About Me</p>
                <p className='leading-relaxed text-secondary-50 text-3xl ml-1 mt-2'>
                    I am a software developer with a passion for creating and building things.
                    I have experience in building web applications using React, Next.js, and Node.js and mobile app with react native, and desktop app with WPF and C#.
                    I am always looking for new opportunities to learn and grow as a developer.
                </p>
                <div className='flex flex-row mt-4' >
                    <Link style={{ display: "table-cell" }} target='_blank' href="https://github.com/TimLinCa?ocid=AIDcmmli8vlwie_SEM__k_CjwKCAjwoPOwBhAeEiwAJuXRh_Z_cJegRrgFPSV2edp57zjj6jwO-A6M-TB9VO5IEwkfg5uGhjy6uhoCC-gQAvD_BwE_k_" isBlock color="success" >
                        <AiFillGithub size={30} />
                    </Link>
                    <Link style={{ display: "table-cell" }} target='_blank' href="mailto:TimLin626@gmail.com" isBlock color="success" >
                        <AiOutlineMail size={30} />
                    </Link>
                </div>
            </article >

        </div>
    );
}

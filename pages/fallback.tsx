import { NextPage } from "next";
import Head from "next/head";
import Header from "../components/common/header";

const Fallback: NextPage = () => (
    <div className='h-full max-w-screen flex justify-start items-center flex-col'>
        <Head>
            <title>Journo | Home</title>
            <link rel="icon" href="/journo.png" />
        </Head>

        <Header />

        <main className='h-full w-full mx-auto py-6 px-6 sm:px-10 lg:px-8'>
            <div className='h-full w-ful flex justify-center items-center'>
                <p
                    className="max-w-xs px-10 text-base"
                >This is a fallback page, you are offline</p>
            </div>
        </main>

    </div>
);

export default Fallback;
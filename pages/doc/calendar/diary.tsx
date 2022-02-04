import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Header from "../../../components/common/header";
import { Diary } from "../../../types/models/diary";
import { User } from "../../../types/verifyToken";
import { verifyToken } from "../../../utils/verifyToken";

const DiaryPage: NextPage<{ user: User; token: string; diary: Diary }> = ({ user, token, diary }) => {
    return (
        <div className='h-full max-w-screen flex justify-start items-center flex-col'>
            <Head>
                <title>Journo | Home</title>
                <link rel="icon" href="/journo.png" />
            </Head>

            <Header />

            <main className='h-full w-full mx-auto py-6 px-6 sm:px-10 lg:px-8 overflow-x-scroll'>
                <div className='h-full w-ful flex justify-center items-center flex-col'>
                    <h1 className='text-2xl font-semibold'>{diary.body}</h1>
                    <h1 className='text-2xl font-semibold'>{new Date(diary.date).toISOString().split("T")[0]}</h1>
                </div>
            </main>

        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    const { cookies } = req;
    const token: string = cookies['authentication'];
    const _id: string = query._id as string;

    if (token !== undefined) { // check auth-token
        const { success, user } = verifyToken(token);

        if (success && _id) {
            try {
                const response = await axios({
                    method: "GET",
                    url: `${process.env.NEXT_PUBLIC_API}/api/diary/${_id}`,
                    headers: {
                        "authentication": `Bearer ${token}`
                    }
                });

                const { data, error, success }: { data?: Diary; error?: string; success: boolean } = response.data;

                if (success && data) {
                    return {
                        props: {
                            user,
                            token,
                            diary: data
                        }
                    }
                }
            } catch (error) { }
        }
    }

    return {
        props: {},
        redirect: {
            permanent: false,
            destination: "/login"
        }
    }
}

export default DiaryPage;
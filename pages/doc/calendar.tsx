import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Header from '../../components/header';
import { User } from '../../types/verifyToken';
import { verifyToken } from '../../utils/verifyToken';

const Calendar: NextPage<{ user: User; token: string }> = ({ token, user }) => {
    return (
        <div className='h-screen min-h-screen max-w-screen flex justify-start items-center flex-col'>
            <Head>
                <title>Journo | Calendar</title>
                <link rel="icon" href="/journo.png" />
            </Head>

            <Header user={user} />

            <main className='h-full w-full mx-auto py-6 px-6 sm:px-10 lg:px-8 overflow-x-scroll'>
                <div className='h-full w-ful flex justify-center items-center'>
                    <h1 className='text-2xl font-semibold'>I'm working on this part.</h1>
                </div>
            </main>

        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const { cookies } = req;
    const token: string = cookies['authentication'];

    if (token !== undefined) { // check auth-token
        const { success, user } = verifyToken(token);

        if (success) {
            return {
                props: {
                    user,
                    token
                }
            }
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


export default Calendar
import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';

const Register: NextPage = () => {
    return (
        <div className='h-screen w-screen flex justify-center items-center'>
            <Head>
                <title>Journo | Register</title>
                <link rel="icon" href="/journo.png" />
            </Head>

            <main className='h-full w-full flex justify-center items-center'>
                <h1>Hello ji</h1>
            </main>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    return {
        props: {}
    }
}

export default Register
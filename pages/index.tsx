import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { User } from '../types/verifyToken';
import { verifyToken } from '../utils/verifyToken';
import Header from '../components/header';

const Home: NextPage<{ user: User; token: string }> = ({ user, token }) => {
  return (
    <div className='h-screen min-h-screen max-w-screen flex justify-start items-center flex-col'>
      <Head>
        <title>Journo | Home</title>
        <link rel="icon" href="/journo.png" />
      </Head>

      <Header />

      <main className='h-full w-full mx-auto py-6 px-6 sm:px-10 lg:px-8 overflow-x-scroll'>
        <div className='h-full w-ful flex justify-center items-center'>
          <h1>{user.username}</h1>
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

export default Home
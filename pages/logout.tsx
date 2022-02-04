import { GetServerSideProps, NextPage } from "next";
import { verifyToken } from "../utils/verifyToken";
import Cookies from 'universal-cookie';
import { NextRouter, useRouter } from "next/router";
import { NextApiRequestCookies } from "next/dist/server/api-utils";

const Logout: NextPage = () => {
    const cookies: Cookies = new Cookies();
    const Router: NextRouter = useRouter();

    const logout = (): void => {
        cookies.remove('authentication');
        Router.replace('/login');
    }

    return (
        <div className="h-screen w-screen flex justify-center items-center">
            <h1
                onClick={logout}
                className="text-xl text-gray-800 cursor-pointer font-medium border-transparent hover:text-gray-700 border-b-2 hover:border-slate-700 duration-300"
            >
                Logout
            </h1>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const { cookies }: { cookies: NextApiRequestCookies } = req;
    const token: string = cookies['authentication'];

    if (token !== undefined) { // check auth-token
        const { success, user } = verifyToken(token);

        if (success) {
            return {
                props: {}
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

export default Logout;
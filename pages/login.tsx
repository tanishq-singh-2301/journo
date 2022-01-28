import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { verifyToken } from '../utils/verifyToken';
import { LockClosedIcon } from '@heroicons/react/solid';
import { useState } from 'react';
import { UserLogin, UserLoginJoiSchema } from '../types/models/user';
import Spinner from '../components/spinner';
import axios from 'axios';
import { NextRouter, useRouter } from 'next/router';
import Cookies from 'universal-cookie';


const Login: NextPage = () => {
    const [cred, setCred] = useState<UserLogin>({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const Router: NextRouter = useRouter();
    const cookies = new Cookies();

    const Login = async (): Promise<void> => {
        const { error, value } = UserLoginJoiSchema.validate(cred);

        if (error)
            return alert(error.message.replace(/\"/g, ""))

        try {
            setIsLoading(true);
            const { data } = await axios({
                method: "POST",
                url: `${process.env.NEXT_PUBLIC_API as string}/api/auth/login`,
                data: value
            });

            const { success, error, token } = data;

            if (!success) {
                alert(error)
            } else {
                cookies.set('authentication', token, {
                    maxAge: 60 * 60 * 24 * 2 // 2 days
                })
                setIsLoading(false);
                Router.push('/')
            }
        } catch (error) {
            console.error(error)
        }

        setIsLoading(false)
    }

    return (
        <div className='h-screen w-screen flex justify-center items-center'>
            <Head>
                <title>Journo | Login</title>
                <link rel="icon" href="/journo.png" />
            </Head>

            <main className='h-full w-full flex justify-center items-center'>
                <div className="max-w-md w-full space-y-8 px-9">
                    <div className="mt-8 space-y-6">
                        <input type="hidden" name="remember" defaultValue="true" />
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email-address" className="sr-only">
                                    Email address
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete='off'
                                    value={cred.email}
                                    onChange={e => setCred((state: UserLogin) => { return { ...state, email: e.target.value } })}
                                    className="appearance-none bg-transparent rounded-none relative block w-full px-3 py-2 border border-neutral-400 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Email address"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    Password
                                </label>
                                <input
                                    name="password"
                                    type="password"
                                    autoComplete='off'
                                    required
                                    value={cred.password}
                                    onChange={e => setCred((state: UserLogin) => { return { ...state, password: e.target.value } })}
                                    className="appearance-none bg-transparent rounded-none relative block w-full px-3 py-2 border border-neutral-400 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                onClick={Login}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                                </span>
                                {isLoading ? <Spinner /> : "Sign in"}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const { cookies } = req;
    const token: string = cookies['authentication'];

    if (token !== undefined) { // check auth-token
        const { success } = verifyToken(token);

        if (success) {
            return {
                props: {},
                redirect: {
                    permanent: false,
                    destination: "/"
                }
            }
        }
    }

    return {
        props: {}
    }
}

export default Login
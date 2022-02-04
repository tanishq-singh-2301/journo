import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { User } from '../types/verifyToken';
import { verifyToken } from '../utils/verifyToken';
import Header from '../components/common/header';
import { useRef, useState } from 'react';
import Compressor from 'compressorjs';
import _arrayBufferToBase64 from '../utils/arrayToBuffer';
import { UserDP, UserDpSchema } from '../types/models/user';
import axios from 'axios';
import Resizer from "react-image-file-resizer";

const resizeFile = (file: File): Promise<string> => {
    return new Promise((resolve) => {
        Resizer.imageFileResizer(file, 400, 400, "JPEG", 100, 0,
            (uri) => {
                if (typeof uri === 'string')
                    resolve(uri);

            }, "base64"
        );
    });
};

const Settings: NextPage<{ user: User; token: string }> = ({ user, token }) => {
    const [dp, setDp] = useState<UserDP>({ base64: "", imageType: "" });
    const hiddenFileInput = useRef<HTMLInputElement | null>(null);

    return (
        <div className='h-full max-w-screen flex justify-start items-center flex-col'>
            <Head>
                <title>Journo | Settings</title>
                <link rel="icon" href="/journo.png" />
            </Head>

            <Header />

            <main className='h-full w-full mx-auto py-6 px-6 sm:px-10 lg:px-8 overflow-x-scroll'>
                <div className='h-full w-ful flex justify-center items-center flex-col'>

























                    {dp.base64 !== '' ?
                        <img
                            src={`data:${dp.imageType};base64,${dp.base64}`}
                            className='max-w-sm border-2 p-1 border-slate-700 rounded-sm'
                        /> : null}

                    <input
                        type="file"
                        ref={hiddenFileInput}
                        accept="image/*"
                        className='hidden'
                        onChange={async (event) => {
                            if (event.target.files && event.target.files[0]) {
                                const image: File = event.target.files[0];

                                new Compressor(image, {
                                    quality: 0.3,
                                    success: (compressedFile: File) => {
                                        compressedFile.arrayBuffer()
                                            .then(async (buffer: ArrayBuffer) => {
                                                const { base64, size } = _arrayBufferToBase64(buffer);

                                                if (size > 0.5) {
                                                    const base64: string = await resizeFile(image);
                                                    setDp({ imageType: 'image/jpeg', base64: base64.split('base64,')[1] });
                                                }

                                                else {
                                                    setDp({ imageType: image.type, base64: base64 });
                                                }

                                            });
                                    }
                                });

                            }
                        }}
                    />

                    <p
                        className='cursor-pointer'
                        onClick={() => hiddenFileInput.current!.click()}
                    >click</p>

                    <p
                        className='cursor-pointer'
                        onClick={() => {
                            const { error, value } = UserDpSchema.validate(dp);

                            console.log({ error, value });

                            if (!error) {
                                (async () => {
                                    const { data } = await axios({
                                        method: "PUT",
                                        url: `${process.env.NEXT_PUBLIC_API}/api/user/updatedp`,
                                        data: {
                                            image: value
                                        },
                                        headers: {
                                            "authentication": `Bearer ${token}`
                                        }
                                    });

                                    console.log({ data });

                                })()
                            }

                        }}
                    >Push</p>















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

export default Settings
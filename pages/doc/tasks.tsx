import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { User } from '../../types/verifyToken';
import Header from '../../components/common/header';
import { verifyToken } from '../../utils/verifyToken';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';
import { useEffect } from 'react';
import { useTask } from '../../context/task-context';
import TaskStack from '../../components/tasks/taskStack';
import nProgress from 'nprogress';
import { TaskTypes } from '../../types/models/task';

const Tasks: NextPage<{ user: User; token: string }> = ({ token, user }) => {
    const { task, getTask } = useTask();

    useEffect(() => {
        if (!task) {
            (async () => {
                nProgress.start();

                const { success, error } = await getTask();
                if (!success) {
                    alert(error)
                }

                nProgress.done();
            })()
        }
    }, []);

    return (
        <div className='h-full max-w-screen flex justify-start items-center flex-col'>
            <Head>
                <title>Journo | Tasks</title>
                <link rel="icon" href="/journo.png" />
            </Head>

            <Header />

            <section className="bg-transparent shadow w-full h-min">
                <div className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8 flex justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
                    <div>
                        <button
                            className='py-[5px] px-[10px] border-2 border-transparent bg-black text-slate-50 font-medium duration-300 hover:border-2 hover:font-semibold hover:border-black hover:text-black hover:bg-transparent'
                        >
                            Create task
                        </button>
                    </div>
                </div>
            </section >

            <main className='h-max w-full mx-auto py-0 sm:py-4 px-6 sm:px-10 lg:px-8'>
                <div className='h-full touchMoveAllowed py-1 w-full flex snap-x snap-mandatory items-start justify-start flex-row overflow-x-scroll no-scrollbar'>
                    {task && <TaskStack lists={task.todo} task={TaskTypes.To_Do} />}
                    {task && <TaskStack lists={task.inProgress} task={TaskTypes.In_Progress} />}
                    {task && <TaskStack lists={task.onHold} task={TaskTypes.On_Hold} />}
                    {task && <TaskStack lists={task.done} task={TaskTypes.Done} />}
                </div>
            </main>

        </div >
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const { cookies }: { cookies: NextApiRequestCookies } = req;
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

export default Tasks
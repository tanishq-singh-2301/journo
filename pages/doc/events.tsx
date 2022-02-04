import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import type { User } from '../../types/verifyToken';
import { verifyToken } from '../../utils/verifyToken';
import { useEvents } from '../../context/event-context';
import { useEffect, useState } from 'react';
import Header from '../../components/common/header';
import EventStack from '../../components/event/eventStack';
import EventUpdate from '../../components/update/event';
import nProgress from 'nprogress';

const Events: NextPage<{ user: User; token: string }> = ({ user, token }) => {
    const { events, getEvents, setEvent } = useEvents();
    const [editEvent, setEditEvent] = useState<{ state: boolean; todo: Function }>({ state: false, todo: () => { } });

    useEffect(() => {
        (async () => {
            if (!events) {
                nProgress.start()

                const { success, error } = await getEvents(token);
                if (!success)
                    alert(error);

                nProgress.done()
            }
        })();
    }, []);

    return (
        <div className='h-full max-w-screen flex justify-start items-center flex-col'>

            <Head>
                <title>Journo | Events</title>
                <link rel="icon" href="/journo.png" />
            </Head>

            <Header />

            <section className="bg-transparent shadow w-full h-min">
                <div className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8 flex justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Events</h1>
                    <div>
                        <button
                            className='bg-gray-800 text-white px-4 py-2 rounded-sm text-sm font-medium hover:shadow-lg'
                            onClick={() => {
                                setEditEvent({
                                    state: true,
                                    todo: async ({ name, date }: { name: string, date: Date }) => {
                                        const added: boolean = await setEvent(name, date);

                                        if (added) {
                                            setEditEvent(oldState => { return { ...oldState, state: false } })
                                        }
                                    }
                                })
                            }}
                        >
                            Create
                        </button>
                        {events &&
                            <button
                                className='bg-gray-800 text-white px-4 py-2 rounded-sm text-sm font-medium hover:shadow-lg ml-5'
                                onClick={async () => {
                                    const { success, error } = await getEvents(token);
                                    if (!success)
                                        alert(error);
                                }}
                            >
                                Load More
                            </button>}
                    </div>
                </div>
            </section>

            <main className='h-max w-full mx-auto py-4 px-6 sm:px-10 lg:px-8'>
                <div className='h-full w-full flex justify-center items-start flex-col sm:justify-start sm:flex-row sm:overflow-x-scroll no-scrollbar'>
                    {events && events.map((event, index) => <EventStack Event={event} key={index} />)}
                </div>

                <EventUpdate
                    edit={editEvent}
                    setEdit={setEditEvent}
                    task="create"
                />
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

export default Events
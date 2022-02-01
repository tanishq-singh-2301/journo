import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Header from '../../components/header';
import { User } from '../../types/verifyToken';
import { verifyToken } from '../../utils/verifyToken';
import moment, { Moment } from 'moment';
import { Fragment, useEffect, useRef, useState } from 'react';
import Week from '../../components/calendar/week';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { Dialog, Transition } from '@headlessui/react';

type Calendar = {
    days: Array<Moment>;
}

const Calendar: NextPage<{ user: User; token: string; }> = ({ token, user }) => {
    const [date, setDate] = useState<Date>(new Date());
    const [calendar, setCalendar] = useState<Array<Calendar> | null>(null);
    const cancelButtonRef = useRef(null);

    useEffect(() => {
        const calendar: Array<Calendar> = [];
        const today: Moment = moment();
        const startDay: Moment = today.clone().startOf('month').startOf('week');
        const endDay: Moment = today.clone().endOf('month').endOf('week');
        let date: Moment = startDay.clone().subtract(1, 'day');

        while (date.isBefore(endDay, 'day'))
            calendar.push({ days: Array(7).fill(0).map(() => date.add(1, 'day').clone()) });

        setCalendar(calendar);
    }, []);

    return (
        <div className='h-screen min-h-screen max-w-screen flex justify-start items-center flex-col'>
            <Head>
                <title>Journo | Calendar</title>
                <link rel="icon" href="/journo.png" />
            </Head>

            <Header user={user} />

            <section className="bg-transparent shadow w-full h-min px-5 py-6 sm:px-16 lg:px-14">
                <div className='w-full flex max-h-16 justify-between items-center'>

                    <div className='flex justify-start w-2/6 sm:w-3/6 lg:w-3/6 items-center flex-row'>
                        <span className='text-2xl sm:text-4xl font-bold md:mr-9'>
                            JAN
                            <i className='mr-2'>&lsquo;</i>
                            2022
                        </span>
                        <span className='hidden md:flex duration-300 border-b border-gray-400 pb-2 justify-center items-center font-black'>
                            <ChevronLeftIcon className="block h-5 w-5 font-black cursor-pointer hover:text-gray-500" aria-hidden="true" />
                            &ensp;&ensp;&bull;&ensp;&ensp;
                            <ChevronRightIcon className="block h-5 w-5 font-black cursor-pointer hover:text-gray-500" aria-hidden="true" />
                        </span>
                    </div>

                    <div className='text-gray-800 w-2/6 sm:w-1/6 lg:w-1/6 flex justify-center items-center'>
                        <span className='flex font-bold justify-center items-center md:border-b duration-200 border-gray-400 w-16 pb-2 cursor-pointer hover:text-slate-600'>
                            <CalendarIcon className="block h-5 w-5 mr-3" aria-hidden="true" /> :

                            {/* <Transition.Root show={true} as={Fragment}>
                                <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={() => { }}>
                                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                        <Transition.Child
                                            as={Fragment}
                                            enter="ease-out duration-300"
                                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                                            leave="ease-in duration-200"
                                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                        >
                                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                                    <input type="date" name="" id="" />
                                                </div>
                                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                                    <button
                                                        type="button"
                                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </Transition.Child>
                                    </div>
                                </Dialog>
                            </Transition.Root> */}

                        </span>
                    </div>

                    <div className='w-2/6 lg:w-3/6 flex justify-end items-center'>
                        <button className='h-10 w-28 md:h-12 md:w-32 bg-black text-slate-50 font-medium duration-300 hover:border-2 hover:font-semibold hover:border-black hover:text-black hover:bg-transparent'>
                            Add Dairy
                        </button>
                    </div>

                </div>
            </section>

            <main className='h-full w-full mx-auto py-6 px-6 sm:px-10 lg:px-8 flex justify-center items-center flex-col'>

                <div className="-my-2 w-full overflow-x-auto sm:-mx-6 lg:-mx-8 no-scrollbar snap-both">
                    <div className="align-middle inline-block min-w-full h-full">
                        <table className="min-w-full h-full w-full">
                            <thead className='h-20 sticky top-0 bg_paper_fiber_img'>
                                <tr>
                                    {
                                        ["SUN", "MON", "TUE", "WED", "THUR", "FRI", "SAT"].map((value, index) => {
                                            return (
                                                <th
                                                    key={index}
                                                    scope="col"
                                                    className=" px-6 align-top py-3 text-left text-base font-semibold text-gray-600 uppercase tracking-wider"
                                                > {value} </th>
                                            )
                                        })
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {calendar && calendar.map(({ days }, index) => <Week days={days} week={index} key={index} />)}
                            </tbody>
                        </table>
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
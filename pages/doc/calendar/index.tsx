import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Header from '../../../components/header';
import { User } from '../../../types/verifyToken';
import { verifyToken } from '../../../utils/verifyToken';
import moment, { Moment } from 'moment';
import { Fragment, useEffect, useRef, useState } from 'react';
import Week from '../../../components/calendar/week';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { Dialog, Transition } from '@headlessui/react';
import { useDiarys } from '../../../context/diary-context';

type Calendar = {
    days: Array<Moment>;
}

const monthsArr: Array<string> = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
enum months { "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" };

const getCalendar = (months: months, year: number): Array<Calendar> => {
    const calendar: Array<Calendar> = [];
    const today: Moment = moment().set("month", months).set("year", year);
    const startDay: Moment = today.clone().startOf('month').startOf('week');
    const endDay: Moment = today.clone().endOf('month').endOf('week');
    let date: Moment = startDay.clone().subtract(1, 'day');

    while (date.isBefore(endDay, 'day'))
        calendar.push({ days: Array(7).fill(0).map(() => date.add(1, 'day').clone()) });

    return calendar;
}

const Calendar: NextPage<{ user: User; token: string; }> = ({ token, user }) => {
    const today: Moment = moment();
    const [date, setDate] = useState<{ month: months; year: number }>({ month: today.month(), year: today.year() });
    const [calendar, setCalendar] = useState<Array<Calendar> | null>(null);
    const [adjustDate, setAdjustDate] = useState<boolean>(false);
    const { getDiarys, diarys } = useDiarys();

    useEffect(() => {
        setCalendar(getCalendar(date.month, date.year));
        (async () => {
            if (!diarys) {
                const { success, error } = await getDiarys(token, moment().set("month", date.month).set("year", date.year));
                if (!success)
                    alert(error);
            }
        })();
    }, []);

    useEffect(() => {
        setCalendar(getCalendar(date.month, date.year));
        (async () => {
            const { success, error } = await getDiarys(token, moment().set("month", date.month).set("year", date.year));
            if (!success)
                alert(error);
        })();
    }, [date]);

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
                            {monthsArr[date.month]}
                            <i className='mr-2'>{"'"}</i>
                            {date.year}
                        </span>
                        <span className='hidden md:flex duration-300 border-b border-gray-400 pb-2 justify-center items-center font-black'>
                            <ChevronLeftIcon
                                className="block h-5 w-5 font-black cursor-pointer hover:text-gray-500" aria-hidden="true"
                                onClick={() => setDate(oldState => {
                                    return {
                                        year: (oldState.month - 1) !== -1 ? oldState.year : oldState.year - 1,
                                        month: (oldState.month - 1) !== -1 ? oldState.month - 1 : 11
                                    }
                                })}
                            />
                            &ensp;&ensp;&bull;&ensp;&ensp;
                            <ChevronRightIcon
                                className="block h-5 w-5 font-black cursor-pointer hover:text-gray-500" aria-hidden="true"
                                onClick={() => setDate(oldState => {
                                    return {
                                        year: (oldState.month + 1) !== 12 ? oldState.year : oldState.year + 1,
                                        month: (oldState.month + 1) !== 12 ? oldState.month + 1 : 0
                                    }
                                })}
                            />
                        </span>
                    </div>

                    <div className='text-gray-800 w-2/6 sm:w-1/6 lg:w-1/6 flex justify-center items-center'>
                        <span
                            className='flex font-bold justify-center items-center md:border-b duration-200 border-gray-400 w-16 pb-2 cursor-pointer hover:text-slate-600'
                            onClick={() => setAdjustDate(true)}
                        >
                            <CalendarIcon className="block h-5 w-5 mr-3" aria-hidden="true" /> :

                            <Transition.Root show={adjustDate} as={Fragment}>
                                <Dialog as="div" className="absolute top-1/2 left-1/2 z-10" onClose={() => setAdjustDate(false)}>
                                    <div className="flex items-center justify-center min-h-screen text-center sm:block sm:p-0">
                                        <Transition.Child
                                            as={Fragment}
                                            enter="ease-out duration-300"
                                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                                            leave="ease-in duration-200"
                                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                        >
                                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl -translate-y-1/2 -translate-x-1/2 transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                                    <input
                                                        type="date"
                                                        value={moment().set("month", date.month).set("year", date.year).toDate().toISOString().split("T")[0]}
                                                        onChange={e => {
                                                            if (e.target.value) {
                                                                const date: Moment = moment(e.target.value);

                                                                setDate({
                                                                    year: date.year(),
                                                                    month: date.month()
                                                                })
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:justify-between">
                                                    <button
                                                        type="button"
                                                        onClick={() => setAdjustDate(false)}
                                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:mx-3 sm:w-auto sm:text-sm"
                                                    >
                                                        Done
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setAdjustDate(false)}
                                                        className="mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 bg-red-700 text-base font-medium text-slate-50 hover:bg-red-800 hover:text-white sm:mt-0 sm:mx-3 sm:w-auto sm:text-sm"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </Transition.Child>
                                    </div>
                                </Dialog>
                            </Transition.Root>

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
                                {calendar && calendar.map(({ days }, index) => <Week days={days} key={index} month={date.month} />)}
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
export type {
    months
}
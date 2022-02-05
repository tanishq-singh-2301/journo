import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Header from '../../../components/common/header';
import { User } from '../../../types/verifyToken';
import { verifyToken } from '../../../utils/verifyToken';
import moment, { Moment } from 'moment';
import { useEffect, useRef, useState } from 'react';
import Week from '../../../components/calendar/week';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { useDiarys } from '../../../context/diary-context';
import DatePicker from "react-datepicker";
import { NextApiRequestCookies } from 'next/dist/server/api-utils';
import nProgress from 'nprogress';

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
    const dateInputElement = useRef<DatePicker<never, undefined> | null>(null);
    const { getDiarys, diarys } = useDiarys();

    useEffect(() => {
        setCalendar(getCalendar(date.month, date.year));
        (async () => {
            if (!diarys) {
                nProgress.start();

                const { success, error } = await getDiarys(token, moment().set("month", date.month).set("year", date.year));
                if (!success)
                    alert(error);

                nProgress.done();
            }
        })();
    }, []);

    useEffect(() => {
        setCalendar(getCalendar(date.month, date.year));
        (async () => {
            nProgress.start();

            const { success, error } = await getDiarys(token, moment().set("month", date.month).set("year", date.year));
            if (!success)
                alert(error);

            nProgress.done();
        })();
    }, [date]);

    return (
        <div className='h-full max-w-screen flex justify-start items-center flex-col'>
            <Head>
                <title>Journo | Calendar</title>
                <link rel="icon" href="/journo.png" />
            </Head>

            <Header />

            <section className="bg-transparent shadow w-full h-min px-5 py-6 sm:px-16 lg:px-14">
                <div className='w-full flex max-h-16 justify-between items-center box-border relative'>

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

                    <div className='relative text-gray-800 w-2/6 sm:w-1/6 lg:w-1/6 flex justify-center items-center z-20'>
                        <span
                            className='absolute flex font-bold justify-center items-center md:border-b duration-200 border-gray-400 w-16 pb-2 cursor-pointer hover:text-slate-600'
                            onClick={() => {
                                dateInputElement.current!.setOpen(true)
                            }}
                        >
                            <CalendarIcon className="block h-5 w-5 mr-3" aria-hidden="true" /> :
                        </span>

                        <DatePicker
                            selected={moment().set("month", date.month).set("year", date.year).toDate()}
                            onChange={e => {
                                if (e) {
                                    const date: Moment = moment(e);

                                    setDate({
                                        year: date.year(),
                                        month: date.month()
                                    })
                                }
                            }}
                            dateFormat="MMMM yyyy"
                            showMonthYearPicker
                            className='hidden'
                            ref={e => dateInputElement.current = e}
                        />
                    </div>

                    <div className='w-2/6 lg:w-3/6 flex justify-end items-center'>
                        <button className='h-10 w-28 md:h-12 md:w-32 bg-black text-slate-50 font-medium duration-300 hover:border-2 hover:font-semibold hover:border-black hover:text-black hover:bg-transparent'>
                            Add Dairy
                        </button>
                    </div>

                </div>
            </section>

            <main className='h-full w-full mx-auto py-6 px-6 sm:px-10 lg:px-8 flex justify-center items-center flex-col'>

                <div className="-my-2 w-full overflow-x-auto touchMoveAllowed sm:-mx-6 lg:-mx-8 no-scrollbar snap-both">
                    <div className="align-middle inline-block min-w-full h-full">
                        <table className="min-w-full h-full w-full relative">
                            <thead
                                className='h-20 sticky right-0 z-10'
                            >
                                <tr>
                                    {
                                        ["SUN", "MON", "TUE", "WED", "THUR", "FRI", "SAT"].map((value, index) => {
                                            return (
                                                <th
                                                    key={index}
                                                    scope="col"
                                                    className="scale-75 sm:scale-90 md:scale-100 pr-3 sm:px-6 align-top py-3 text-left text-base font-semibold underline underline-offset-2 text-gray-900 uppercase tracking-wider"
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


export default Calendar
export type {
    months
}
import moment, { Moment } from 'moment';
import type { NextPage } from 'next';
import { useState } from 'react';
import { months } from '../../pages/doc/calendar';

const classNames = (...classes: any): string => classes.filter(Boolean).join(' ');
const n = (n: number): string => n > 9 ? "" + n : "0" + n;
const dayName = (day: number): string => ["SUN", "MON", "TUE", "WED", "THUR", "FRI", "SAT"][day];

const Day: NextPage<{ day: Moment; month: months }> = ({ day, month }) => {
    const [dayHover, setDayHover] = useState<boolean>(false);

    return (
        <td className="h-72 px-5 py-3 whitespace-nowrap">
            <div
                className='h-full w-44 border-t-2 hover:font-medium border-slate-500 hover:border-orange-400 hover:bg-[#ece9e4] duration-500 py-5 hover:px-4 cursor-pointer flex justify-start items-center flex-col'
                onMouseEnter={() => setDayHover(state => !state)}
                onMouseLeave={() => setDayHover(state => !state)}
            >
                <div className='w-full mb-5 flex justify-between items-end'>
                    <span className={classNames(
                        day.month() === month ? "text-slate-700" : "text-slate-400",
                        dayHover ? "text-orange-400" : "",
                        "text-3xl duration-500")}
                    >
                        {n(day.date())}
                    </span>
                    <span
                        className={classNames(
                            dayHover ? "text-orange-400" : "opacity-0 duration-500",
                            "text-sm mb-1 underline underline-offset-2"
                        )}
                    >
                        {dayName(day.day())}
                    </span>
                </div>

                <div
                    className={classNames(
                        day.month() === month ? "text-slate-700" : "text-slate-400",
                        'w-full mb-5 overflow-hidden truncate whitespace-normal'
                    )}
                >
                    <span className='text-sm font-medium'>
                        Review your place safety and something else. hello there how are you
                    </span>
                </div>

            </div>
        </td >
    );
};

export default Day;
import moment, { Moment } from 'moment';
import type { NextPage } from 'next';
import { NextRouter, useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useDiarys } from '../../context/diary-context';
import { months } from '../../pages/doc/calendar';

const classNames = (...classes: any): string => classes.filter(Boolean).join(' ');
const n = (n: number): string => n > 9 ? "" + n : "0" + n;
const dayName = (day: number): string => ["SUN", "MON", "TUE", "WED", "THUR", "FRI", "SAT"][day];

const Day: NextPage<{ day: Moment; month: months }> = ({ day, month }) => {
    const [dayHover, setDayHover] = useState<boolean>(false);
    const divRef = useRef<HTMLDivElement | null>(null);
    const { diarys } = useDiarys();
    const Router: NextRouter = useRouter();

    return (
        <td className="h-72 px-5 py-3 whitespace-nowrap">
            <div
                className="h-full w-44 border-t-2 hover:font-medium border-slate-500 hover:border-orange-400 hover:bg-[#ece9e4] duration-500 py-5 hover:px-4 flex justify-start items-center flex-col"
                ref={divRef}
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
                    {((diarys !== null) && (diarys.length > 0)) ?
                        diarys.map((diary, diaryIndex) => {
                            const diaryDate: Moment = moment(diary.date);

                            if ((diaryDate.year() === day.year()) && (diaryDate.month() === day.month()) && (day.date() === diaryDate.date())) {
                                const div = divRef.current;

                                div!.classList.add("cursor-pointer");
                                div!.onclick = () => {
                                    Router.push(`/doc/calendar/diary?_id=${diary._id}`)
                                }

                                return (
                                    <>
                                        <span className='text-sm font-bold underline underline-offset-2' key={diaryIndex}>
                                            {diary.best_part}
                                        </span>

                                        <br />

                                        {diary.tags?.map((value, index) => {
                                            return (
                                                <>
                                                    <span className='text-sm font-medium mx-1' key={index}>
                                                        &bull; {value}
                                                    </span>

                                                    <br />
                                                </>
                                            )
                                        })}
                                    </>
                                )
                            }
                        }) : null}
                </div>

            </div>
        </td >
    );
};

export default Day;
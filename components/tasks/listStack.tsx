import moment from "moment";
import { NextPage } from "next";
import { useState } from "react";
import { List } from '../../types/models/task';

const classNames = (...classes: Array<string>): string => classes.filter(Boolean).join(' ');

const ListStack: NextPage<{ list: List }> = ({ list }) => {
    const [hover, setHover] = useState<boolean>(false);

    return (
        <>
            <div
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                className={classNames(
                    "mb-4 sm:px-10 hover:px-5 duration-300"
                )}
            >
                <div
                    className={classNames(
                        "w-full pb-4 hover:bg-[#ece9e4] hover:border-t-orange-400 hover:border-b-transparent cursor-pointer border-y-2 border-t-transparent border-b-slate-300 duration-300 hover:p-5 hover:pb-5"
                    )}
                >
                    <div className="max-h-10 w-full flex justify-between items-center">
                        <h1 className={classNames(
                            "text-gray-800 font-bold",
                            hover ? "text-orange-400" : ""
                        )}>{list.title}</h1>
                    </div>
                    <div className="h-1/2 w-full flex justify-start items-center py-4">
                        <h1 className="text-gray-700 text-sm font-medium">{list.description}</h1>
                    </div>
                    <div className="w-full py-1 flex justify-start items-center overflow-x-auto flex-wrap">
                        {list.tags.length > 0 ? list.tags.map((value, index) => {
                            if (value.length > 0) {
                                return (
                                    <h1
                                        className="text-gray-700 text-sm font-medium bg-slate-300 w-fit p-2 mr-3 mb-3"
                                        key={index}
                                    >{value}</h1>
                                )
                            }
                        }) : null}
                    </div>
                    <div className="max-h-10 w-full flex justify-between items-center">
                        <h1 className="text-gray-500 font-medium">{moment(new Date(list.date)).format('ll')}</h1>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ListStack;
import { NextPage } from "next";
import { TaskTypes, List } from "../../types/models/task";
import ListStack from "./listStack";

const dots: Array<string> = ["border-red-600", "border-orange-500", "border-violet-500", "border-stone-700", "border-rose-400", "border-green-700", "border-yellow-500"];
const classNames = (...classes: Array<string>): string => classes.filter(Boolean).join(' ');

const TaskStack: NextPage<{ lists: Array<List>; task: TaskTypes; }> = ({ lists, task }) => {
    return (
        <div className="max-h-[70vh] overflow-y-auto relative sm:max-w-sm custom-scrollbar min-w-[calc(100vw-48px)] snap-start sm:min-w-[384px] py-0 sm:my-6 mb-4 mr-4 justify-start flex flex-col" >

            <div className="sticky top-0 bg_paper_fiber_img h-fit py-6 w-full sm:px-10 mb-4 flex justify-center items-center flex-col">
                <div className="h-full w-full flex justify-center items-center flex-col border-b-2 border-gray-700">
                    <div className="w-full h-1/2 flex justify-start items-center z-10 py-px">
                        <p className="text-black text-lg font-bold">
                            {TaskTypes[task].replace('_', ' ')} &ensp;
                        </p>
                        <div className={classNames(
                            "h-4 w-4 border-[3px] rounded-full ",
                            dots[Math.floor(Math.random() * dots.length)]
                        )}></div>
                    </div>
                    <div className="w-full h-1/2 flex justify-between items-center py-px">
                        <h1 className="text-gray-500 text-sm font-medium">
                            {lists.length} Tasks
                        </h1>
                    </div>
                </div>
            </div>

            {lists.length > 0 ? lists.map((list, index) => <ListStack list={list} key={index} />) : null}

        </div>
    )
}

export default TaskStack;
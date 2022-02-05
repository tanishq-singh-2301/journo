import { NextPage } from "next";
import { TaskTypes, List } from "../../types/models/task";
import ListStack from "./listStack";

const dots: Array<string> = ["⭕", "🟠", "🔴", "🟤", "🟣", "🔵", "🟢", "🟡"];

const TaskStack: NextPage<{ lists: Array<List>; task: TaskTypes; }> = ({ lists, task }) => {
    return (
        <div className="max-h-[70vh] overflow-y-auto relative sm:max-w-sm custom-scrollbar min-w-[calc(100vw-48px)] snap-start sm:min-w-[384px] py-0 sm:my-6 mb-4 mr-4 justify-start flex flex-col" >

            <div className="sticky top-0 bg_paper_fiber_img h-fit py-6 w-full sm:px-10 mb-4 flex justify-center items-center flex-col">
                <div className="h-full w-full flex justify-center items-center flex-col border-b-2 border-gray-700">
                    <div className="w-full h-1/2 flex justify-between items-center z-10 py-px">
                        <p className="text-black text-lg font-bold">
                            {/* {TaskTypes[task].replaceAll('_', ' ')} &ensp; */}

                            <span className="text-sm">
                                {dots[Math.floor(Math.random() * 8)]}
                            </span>
                        </p>
                    </div>
                    <div className="w-full h-1/2 flex justify-between items-center py-px">
                        <h1 className="text-gray-500 text-sm font-medium">
                            {lists.length} Tasks
                        </h1>
                    </div>
                </div>
            </div>

            {/* {lists.length > 0 ? lists.map((list, index) => <ListStack list={list} key={index} />) : null} */}

        </div>
    )
}

export default TaskStack;
import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { NextPage } from 'next';
import { List, ListJoiSchema } from '../../types/models/event';
import Spinner from '../spinner';

const ListUpdate: NextPage<{
    edit: { state: boolean; todo: Function; };
    setEdit: Function;
    List?: List;
    task: "create" | "update";
    eventName?: string;
    eventId: string;
    index?: number;
}> = ({ edit, setEdit, List, task, eventName, eventId, index }) => {

    const cancelButtonRef = useRef(null);
    const [title, setTitle] = useState<string>((task === "update" ? List?.title : "")!);
    const [description, setDescription] = useState<string>((task === "update" ? List?.description : "")!);
    const [time, setTime] = useState<Date>((task === "update" ? new Date(List?.time || new Date()) : new Date())!);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    return (
        <Transition.Root show={edit.state} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={() => setEdit((oldState: { state: boolean; todo: Function }) => { return { ...oldState, state: false } })}>
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-4 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all my-8 align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="grid grid-cols-6 gap-6">
                                    {
                                        task === "update" &&
                                        <div className="col-span-6">
                                            <h3
                                                className="mt-1 block w-full sm:text-md font-medium underline underline-offset-1 text-center outline-none bottom-0"
                                            >{eventName}</h3>
                                        </div>
                                    }
                                    <div className="col-span-3">
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            id="title"
                                            autoComplete="off"
                                            value={title}
                                            onChange={e => setTitle(e.target.value)}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            name="date"
                                            id="date"
                                            autoComplete="date"
                                            value={new Date(time).toISOString().split('T')[0]}
                                            onChange={e => {
                                                if (e.target.value) {
                                                    setTime(new Date(e.target.value))
                                                } else setTime(new Date())
                                            }}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>
                                    <div className="col-span-6">
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            id="description"
                                            autoComplete="off"
                                            value={description}
                                            onChange={e => setDescription(e.target.value)}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block h-32 w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>
                                <div className="py-3 pt-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={async () => {
                                            try {
                                                const { error, value } = ListJoiSchema.validate({
                                                    title,
                                                    description,
                                                    time
                                                });

                                                if (error) {
                                                    throw (error.message.replace(/\"/g, ""))
                                                } else {
                                                    setIsLoading(true);

                                                    if (task === "update")
                                                        await edit.todo(eventId, index, { title: value.title, description: value.description, time: value.time });

                                                    else
                                                        await edit.todo(eventId, -1, { title: value.title, description: value.description, time: value.time });

                                                }
                                            }
                                            catch (error) { alert(error); }
                                            finally { setIsLoading(false); }
                                        }}
                                    >
                                        &ensp; {isLoading ? <Spinner /> : "Save"} &ensp;
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => {
                                            setEdit((oldState: { state: boolean; todo: Function }) => { return { ...oldState, state: false } })
                                        }}
                                        ref={cancelButtonRef}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default ListUpdate;
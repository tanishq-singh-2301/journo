import { NextPage } from "next";
import { Event, List } from "../types/models/event";
import type { Option } from '../types/components/drop-down-menu';
import { useState } from "react";
import Alert from "./alert";
import ListUpdate from "./update/list";
import DropDownMenu from "./drop-down-menu";
import { useEvents } from "../context/event-context";

const ListStack: NextPage<{ List: List; eventId: string; index: number; eventName: string }> = ({ List, eventId, index, eventName }) => {
    const [alert, setAlert] = useState<{ state: boolean; todo: Function }>({ state: false, todo: () => { } });
    const [edit, setEdit] = useState<{ state: boolean; todo: Function }>({ state: false, todo: () => { } });
    const { deleteEventList, updateEventList } = useEvents();

    const optionsList: Array<Option> = [
        {
            title: 'Edit',
            todo: () => setEdit({
                state: true,
                todo: async (eventId: string, index: number, data: { title: string, description: string, time: Date }) => {
                    const updated: boolean = await updateEventList(eventId, index, data);
                    if (updated) {
                        setEdit(oldState => { return { ...oldState, state: false } })
                    }
                }
            }),
            hoverBgColor: 'hover:bg-gray-100',
            hoverTextColor: 'hover:text-gray-800'
        },
        {
            title: 'Remove',
            todo: () => setAlert({
                state: true,
                todo: async () => {
                    const deleted: boolean = await deleteEventList(eventId, index);
                    if (deleted) {
                        setAlert(oldState => { return { ...oldState, state: false } })
                    }
                }
            }),
            hoverBgColor: 'hover:bg-red-600',
            hoverTextColor: 'hover:text-white'
        }
    ];

    return (
        <>
            <div className="w-full bg-slate-50 mb-4 shadow-md p-6">
                <div className="max-h-10 w-full flex justify-between items-center">
                    <h1 className="text-gray-800 font-bold">{List.title}</h1>
                    <DropDownMenu name=":" options={optionsList} />
                </div>
                <div className="h-1/2 w-full flex justify-start items-center py-4">
                    <h1 className="text-gray-700 font-normal">{List.description}</h1>
                </div>
                <div className="max-h-10 w-full flex justify-between items-center">
                    <h1 className="text-gray-800 font-medium">{new Date(List.time).toDateString()}</h1>
                </div>
            </div>
            <Alert
                alert={alert}
                setAlert={setAlert}
                description="Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone."
                onDoBtnName="Delete"
                title="Delete"
            />
            <ListUpdate
                edit={edit}
                setEdit={setEdit}
                List={List}
                task="update"
                eventName={eventName}
                eventId={eventId}
                index={index}
            />
        </>

    )
}

export default ListStack;
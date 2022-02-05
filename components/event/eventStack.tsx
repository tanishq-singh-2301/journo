import { NextPage } from "next";
import { Event } from "../../types/models/event";
import DropDownMenu from '../common/drop-down-menu';
import type { Option } from '../../types/components/drop-down-menu';
import Alert from "../common/alert";
import { useState } from "react";
import { useEvents } from "../../context/event-context";
import EventUpdate from "../update/event";
import ListStack from "./listStack";
import ListUpdate from "../update/list";
import { ListJoiSchema } from "../../types/models/task";

const dots: Array<string> = ["border-red-600", "border-orange-500", "border-violet-500", "border-stone-700", "border-rose-400", "border-green-700", "border-yellow-500"];
const classNames = (...classes: Array<string>): string => classes.filter(Boolean).join(' ');

const EventStack: NextPage<{ Event: Event }> = ({ Event }) => {
    const { name, date } = Event;
    const [alert, setAlert] = useState<{ state: boolean; todo: Function }>({ state: false, todo: () => { } });
    const [eventEdit, setEventEdit] = useState<{ state: boolean; todo: Function }>({ state: false, todo: () => { } });
    const [listEdit, setListEdit] = useState<{ state: boolean; todo: Function }>({ state: false, todo: () => { } });
    const { deleteEvent, updateEvent, setEventList } = useEvents();

    const optionsContainer: Array<Option> = [
        {
            title: 'Edit',
            todo: () => setEventEdit({
                state: true,
                todo: async (data: { name: string, date: Date }, Event: Event) => {
                    const updated = await updateEvent(Event, data);

                    if (updated)
                        setEventEdit(oldState => { return { ...oldState, state: false } })
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
                    const deleted: boolean = await deleteEvent(Event._id);
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
        <div className="w-full sm:max-w-sm sm:min-w-[384px] p-6 border border-[rgb(0 0 0 / 13%)] bg-[#f1f1f152] rounded-sm drop-shadow-sm mb-4 sm:mr-4">
            <div className="h-16 w-full mb-4 drop-shadow-md flex justify-center items-center flex-col px-6">
                <div className="w-full h-1/2 flex justify-between items-center z-10">
                    <div className="flex justify-center items-center">
                        <p className="text-black text-lg font-semibold">
                            {name} &ensp;
                        </p>
                        <div className={classNames(
                            "h-4 w-4 border-[3px] rounded-full ",
                            dots[Math.floor(Math.random() * dots.length)]
                        )}></div>
                    </div>
                    <DropDownMenu name=":" options={optionsContainer} />
                </div>
                <div className="w-full h-1/2 flex justify-between items-center">
                    <h1 className="text-gray-500 text-md font-medium">{new Date(date).toDateString()}</h1>
                </div>
            </div>
            {Event.List && Event.List.map((list, index) => <ListStack List={list} key={index} eventId={Event._id} index={index} eventName={Event.name} />)}
            <div className="h-16 w-full drop-shadow-md flex justify-start items-center px-6">
                <h1
                    onClick={() => {
                        setListEdit({
                            state: true,
                            todo: async (eventId: string, index: number, data: { title: string, description: string, time: Date }) => {
                                if (index < 0) {
                                    const { error, value } = ListJoiSchema.validate(data);

                                    if (error) {
                                        window.alert(error.message.replace(/\"/g, ""));
                                    }

                                    else {

                                        const added: boolean = await setEventList(eventId, index, {
                                            title: value.title,
                                            description: value.description,
                                            time: value.time
                                        })

                                        if (added) {
                                            setListEdit(oldState => { return { ...oldState, state: false } })
                                        }
                                    }

                                }
                            }
                        })
                    }}
                    className="text-green-800 font-normal hover:text-green-600 underline underline-offset-1 cursor-pointer"
                >Add Stack</h1>
            </div>
            <Alert
                alert={alert}
                setAlert={setAlert}
                description="Are you sure you want to delete your stack? All of this data will be permanently removed. This action cannot be undone."
                onDoBtnName="Delete"
                title="Delete"
            />
            <EventUpdate
                edit={eventEdit}
                setEdit={setEventEdit}
                Event={Event}
                task="update"
            />
            <ListUpdate
                edit={listEdit}
                setEdit={setListEdit}
                task="create"
                eventId={Event._id}
            />
        </div>
    )
}

export default EventStack;
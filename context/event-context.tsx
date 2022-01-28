import axios from 'axios';
import { NextPage, NextPageContext } from 'next';
import { createContext, ReactNode, useContext, useState } from 'react';
import Cookies from 'universal-cookie';
import type { Event } from '../types/models/event';

type QueryReturn = {
    success: boolean;
    error?: string;
}

type EventsContextType = {
    events: Array<Event> | null;
    getEvents: Function;
    setEvent: Function;
    deleteEvent: Function;
    updateEvent: Function;
    deleteEventList: Function;
    setEventList: Function;
    updateEventList: Function;
};

const EventsContextTypeDefaultValues: EventsContextType = {
    events: null,
    deleteEvent: () => { },
    getEvents: () => { },
    setEvent: () => { },
    updateEvent: () => { },
    deleteEventList: () => { },
    setEventList: () => { },
    updateEventList: () => { },
};

const EventsContext = createContext<EventsContextType>(EventsContextTypeDefaultValues);

export const useEvents = () => useContext(EventsContext);

export const EventsProvider: NextPage<{ children: ReactNode }> = ({ children }) => {
    const [events, setEvents] = useState<Array<Event> | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const cookies = new Cookies();
    const token: string = cookies.get('authentication');

    // TODO: validate user given data.

    const getEvents = async (token: string): Promise<QueryReturn> => { // db
        try {
            const response = await axios({
                method: "GET",
                url: `${process.env.NEXT_PUBLIC_API}/api/event`,
                headers: {
                    "authorization": `Bearer ${token}`,
                    "page-number": pageNumber
                }
            });

            const { data, success, error }: { data: Array<Event>; success: boolean; error: string } = response.data;

            if (success) {
                setEvents(state => {
                    if (!state) return data;
                    else return [...state, ...data]
                });
                setPageNumber(state => state + 1);
                return { success: true }
            }

            return {
                success: false,
                error
            }
        } catch (error) {
            return {
                success: false,
                error: error as string
            }
        }
    };

    const setEvent = async (name: string, date: Date): Promise<boolean> => { // db
        try {
            const response = await axios({
                method: "POST",
                url: `${process.env.NEXT_PUBLIC_API}/api/event`,
                data: {
                    "data": {
                        name, date
                    }
                },
                headers: {
                    "authorization": `Bearer ${token}`
                }
            });

            const { success, error, data } = response.data;

            if (success) {
                const updatedEvents: Array<Event> = [...events!, ...data];
                setEvents(updatedEvents);
                return true;
            } else {
                alert(error);
                return false;
            }
        } catch (error) {
            console.error(error)
        }

        return false;
    };

    const deleteEvent = async (eventId: string): Promise<boolean> => { // db
        try {
            const updatedEvents: Array<Event> = [...events!];

            updatedEvents.filter(async (event, eventIndex) => {
                if (event._id === eventId) {
                    updatedEvents.splice(eventIndex, 1);

                    const response = await axios({
                        method: "DELETE",
                        url: `${process.env.NEXT_PUBLIC_API}/api/event`,
                        headers: {
                            "authorization": `Bearer ${token}`,
                            "delete-id": eventId
                        }
                    });

                    const { success, error } = response.data;

                    if (!success) {
                        alert(error);
                        return false;
                    }
                }
            });

            setEvents(updatedEvents);

            return true;
        } catch (error) {
            console.error(error)
        }

        return false;
    };

    const updateEvent = async (Event: Event, data: { name: string; date: Date }): Promise<boolean> => { // db
        try {
            const updatedEvents: Array<Event> = [...events!];

            updatedEvents.filter(async (event, eventIndex) => {
                if (event._id === Event._id) {
                    event.date = data.date;
                    event.name = data.name;

                    const response = await axios({
                        method: "PUT",
                        url: `${process.env.NEXT_PUBLIC_API}/api/event`,
                        data: {
                            "data": {
                                ...updatedEvents[eventIndex]
                            },
                            "updateId": event._id
                        },
                        headers: {
                            "authorization": `Bearer ${token}`
                        }
                    });

                    const { success, error } = response.data;

                    if (!success) {
                        alert(error);
                        return false;
                    }

                }
            });

            setEvents(updatedEvents);

            return true;
        } catch (error) {
            console.error(error)
        }

        return false;
    };

    const setEventList = async (eventId: string, index: number, data: { title: string, description: string, time: Date }): Promise<boolean> => { // db
        try {
            const updatedEvents: Array<Event> = [...events!];

            updatedEvents.filter(async (event, eventIndex) => {
                if (event._id === eventId) {
                    event.List!.push({
                        description: data.description,
                        time: data.time,
                        title: data.title
                    })

                    console.log(updatedEvents[eventIndex]);


                    const response = await axios({
                        method: "PUT",
                        url: `${process.env.NEXT_PUBLIC_API}/api/event`,
                        data: {
                            "data": {
                                ...updatedEvents[eventIndex]
                            },
                            "updateId": eventId
                        },
                        headers: {
                            "authorization": `Bearer ${token}`
                        }
                    });

                    const { success, error } = response.data;

                    if (!success) {
                        alert(error);
                        return false;
                    }
                }
            });

            setEvents(updatedEvents);

            return true;
        } catch (error) {
            console.error(error);
        }

        return false;
    };

    const deleteEventList = async (eventId: string, index: number): Promise<boolean> => { // db
        try {
            const updatedEvents: Array<Event> = [...events!];

            updatedEvents.filter(async (event, eventIndex) => {
                if (event._id === eventId) {

                    event.List!.splice(index, 1);

                    const response = await axios({
                        method: "PUT",
                        url: `${process.env.NEXT_PUBLIC_API}/api/event`,
                        data: {
                            "data": {
                                ...updatedEvents[eventIndex]
                            },
                            "updateId": eventId
                        },
                        headers: {
                            "authorization": `Bearer ${token}`
                        }
                    });

                    const { success, error } = response.data;

                    if (!success) {
                        alert(error);
                        return false;
                    }
                }
            });

            setEvents(updatedEvents);

            return true;
        } catch (error) {
            console.error(error);
        }

        return false;
    };

    const updateEventList = async (eventId: string, index: number, data: { title: string, description: string, time: Date }): Promise<boolean> => { // db
        try {
            const updatedEvents: Array<Event> = [...events!];

            updatedEvents.filter(async (event, eventIndex) => {
                if (event._id === eventId) {
                    event.List![index].title = data.title;
                    event.List![index].description = data.description;
                    event.List![index].time = data.time;

                    const response = await axios({
                        method: "PUT",
                        url: `${process.env.NEXT_PUBLIC_API}/api/event`,
                        data: {
                            "data": {
                                ...updatedEvents[eventIndex]
                            },
                            "updateId": eventId
                        },
                        headers: {
                            "authorization": `Bearer ${token}`
                        }
                    });

                    const { success, error } = response.data;

                    if (!success) {
                        alert(error);
                        return false;
                    }
                }
            });

            setEvents(updatedEvents);

            return true;
        } catch (error) {
            console.error(error);
        }

        return false;
    };

    const value: EventsContextType = {
        events,
        deleteEvent,
        getEvents,
        setEvent,
        updateEvent,
        deleteEventList,
        setEventList,
        updateEventList
    };

    return <EventsContext.Provider value={value}> {children} </EventsContext.Provider>
}
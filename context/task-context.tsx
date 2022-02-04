import axios from 'axios';
import { NextPage } from 'next';
import { createContext, ReactNode, useContext, useState } from 'react';
import { Task } from '../types/models/task';
import cookies from 'universal-cookie'

type QueryReturn = {
    success: boolean;
    error?: string;
}

type TaskContextType = {
    task: Task | null;
    getTask: Function;
};

const TaskContextTypeDefaultValues: TaskContextType = {
    task: null,
    getTask: () => undefined
};

const TaskContext = createContext<TaskContextType>(TaskContextTypeDefaultValues);

export const useTask = () => useContext(TaskContext);

export const TaskProvider: NextPage<{ children: ReactNode }> = ({ children }) => {
    const [task, setTask] = useState<Task | null>(null);
    const Cookies = new cookies();
    const token: string = Cookies.get("authentication");

    const getTask = async (): Promise<QueryReturn> => { // db
        try {
            const response = await axios({
                method: "GET",
                url: `${process.env.NEXT_PUBLIC_API}/api/task`,
                headers: {
                    "authentication": `Bearer ${token}`
                }
            });

            const { data, success, error }: { data: Task; success: boolean; error: string } = response.data;

            if (success) {
                setTask(data);
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

    const value: TaskContextType = {
        task,
        getTask
    };

    return <TaskContext.Provider value={value}> {children} </TaskContext.Provider>
}
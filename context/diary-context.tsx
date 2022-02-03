import axios from 'axios';
import moment, { Moment } from 'moment';
import { NextPage, NextPageContext } from 'next';
import { createContext, ReactNode, useContext, useState } from 'react';
import Cookies from 'universal-cookie';
import type { Diary } from '../types/models/diary';

type QueryReturn = {
    success: boolean;
    error?: string;
}

type DiarysContextType = {
    diarys: Array<Diary> | null;
    getDiarys: Function;
};

const DiarysContextTypeDefaultValues: DiarysContextType = {
    diarys: null,
    getDiarys: () => undefined
};

const DiarysContext = createContext<DiarysContextType>(DiarysContextTypeDefaultValues);

export const useDiarys = () => useContext(DiarysContext);

export const DiarysProvider: NextPage<{ children: ReactNode }> = ({ children }) => {
    const [diarys, setDiarys] = useState<Array<Diary> | null>(null);
    const cookies = new Cookies();
    const token: string = cookies.get('authentication');

    const getDiarys = async (token: string, startOfMonth: Moment): Promise<QueryReturn> => { // db
        try {
            const response = await axios({
                method: "GET",
                url: `${process.env.NEXT_PUBLIC_API}/api/diary`,
                headers: {
                    "authentication": `Bearer ${token}`,
                    "start-of-the-month": startOfMonth.toISOString(),
                    "end-of-the-month": startOfMonth.add(1, "month").toISOString()
                }
            });

            const { data, success, error }: { data: Array<Diary>; success: boolean; error: string } = response.data;

            if (success) {
                setDiarys(data);
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

    const value: DiarysContextType = {
        diarys,
        getDiarys
    };

    return <DiarysContext.Provider value={value}> {children} </DiarysContext.Provider>
}
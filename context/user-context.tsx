import axios from 'axios';
import { NextPage } from 'next';
import { createContext, ReactNode, useContext, useState } from 'react';
import { User } from '../types/models/user';
import cookies from 'universal-cookie'

type QueryReturn = {
    success: boolean;
    error?: string;
}

type UserContextType = {
    user: User | null;
    getUser: Function;
};

const UserContextTypeDefaultValues: UserContextType = {
    user: null,
    getUser: () => undefined
};

const UserContext = createContext<UserContextType>(UserContextTypeDefaultValues);

export const useUser = () => useContext(UserContext);

export const UserProvider: NextPage<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const Cookies = new cookies();
    const token: string = Cookies.get("authentication");

    const getUser = async (): Promise<QueryReturn> => { // db
        try {
            const response = await axios({
                method: "GET",
                url: `${process.env.NEXT_PUBLIC_API}/api/user`,
                headers: {
                    "authentication": `Bearer ${token}`
                }
            });

            const { data, success, error }: { data: User; success: boolean; error: string } = response.data;

            if (success) {
                setUser(data);
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

    const value: UserContextType = {
        user,
        getUser
    };

    return <UserContext.Provider value={value}> {children} </UserContext.Provider>
}
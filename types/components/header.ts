type Navigation = {
    name: string;
    href: string;
    current: boolean;
}

type UserNavigation = {
    name: string;
    href: string;
    bgColor?: string;
}

type Account = {
    name: string;
    email: string;
    imageUrl: string;
}

export type {
    Navigation,
    UserNavigation,
    Account
}
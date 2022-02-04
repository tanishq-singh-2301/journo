import { Fragment, useEffect, useState } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import { NextPage } from 'next';
import { User } from '../../types/verifyToken';
import { Account, Navigation, UserNavigation } from '../../types/components/header';
import { useRouter } from 'next/router';
import { UserDP } from '../../types/models/user';
import { useUser } from '../../context/user-context';
import Image from 'next/image';
import appImg from '../../public/journo_logo.svg'

const classNames = (...classes: any): string => classes.filter(Boolean).join(' ');

const Header: NextPage = () => {
    const Router = useRouter();
    const { user, getUser } = useUser();

    const [navigation, setNavigation] = useState<Array<Navigation>>([
        { name: 'Dashboard', href: '/', current: false },
        { name: 'Calendar', href: '/doc/calendar', current: false },
        { name: 'Events', href: '/doc/events', current: false },
        { name: 'Tasks', href: '/doc/tasks', current: false }
    ]);

    const userNavigation: Array<UserNavigation> = [
        { name: 'Your Profile', href: '#' },
        { name: 'Settings', href: '/settings' },
        { name: 'Sign out', href: '/logout', bgColor: 'bg-red-600' },
    ];

    const account: Account = {
        name: user ? user!.username : "",
        email: user ? user!.email : "",
        imageUrl: user?.image ? user!.image.base64 : 'https://images.unsplash.com/photo-1621508638997-e30808c10653?ixlib=rb-1.2.1&auto=format&fit=crop&w=880&q=80'
    };

    useEffect(() => {
        const updatedNavigation: Array<Navigation> = [...navigation];

        updatedNavigation.filter(set => {
            if (Router.route === set.href) {
                set.current = true;

                setNavigation(updatedNavigation)
            }
        });

        (async () => {
            if (!user) {
                await getUser();
            }
        })()

    }, []);

    return (
        <>
            <div className="w-full">
                <Disclosure as="nav" className="bg-gray-800">
                    {({ open }) => (
                        <>
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex items-center justify-between h-16">
                                    <div className="flex items-center">
                                        <div className="relative m-px h-8 w-8 rounded-full overflow-hidden flex justify-center items-center bg-white">
                                            <Image
                                                src={appImg}
                                                alt=''
                                                className='scale-[1.7] absolute translate-y-0.5'
                                                height={"100%"}
                                                width={"100%"}
                                            />
                                        </div>
                                        <div className="hidden md:block">
                                            <div className="ml-10 flex items-baseline space-x-4">
                                                {navigation.map((item) => (
                                                    <Link href={item.href} key={item.name}>
                                                        <a
                                                            href={item.href}
                                                            className={classNames(
                                                                item.current
                                                                    ? 'bg-gray-900 text-white'
                                                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                                'px-3 py-2 rounded-md text-sm font-medium'
                                                            )}
                                                            aria-current={item.current ? 'page' : undefined}
                                                        >
                                                            {item.name}
                                                        </a>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="ml-4 flex items-center md:ml-6">
                                            <button
                                                type="button"
                                                className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white"
                                            >
                                                <span className="sr-only">View notifications</span>
                                                <BellIcon className="h-6 w-6" aria-hidden="true" />
                                            </button>

                                            {/* Profile dropdown */}
                                            <Menu as="div" className="ml-3 relative">
                                                <div>
                                                    <Menu.Button className="h-8 w-8 max-w-xs bg-gray-800 rounded-full flex items-center text-sm border-2 border-slate-200 p-[2px]">
                                                        <span className="sr-only">Open user menu</span>
                                                        <img
                                                            className="rounded-full object-cover w-full h-full"
                                                            src={account.imageUrl.includes('http') ? account.imageUrl : `data:${user!.image.imageType};base64,${user!.image.base64}`}
                                                        />
                                                    </Menu.Button>
                                                </div>
                                                <Transition
                                                    as={Fragment}
                                                    enter="transition ease-out duration-100"
                                                    enterFrom="transform opacity-0 scale-95"
                                                    enterTo="transform opacity-100 scale-100"
                                                    leave="transition ease-in duration-75"
                                                    leaveFrom="transform opacity-100 scale-100"
                                                    leaveTo="transform opacity-0 scale-95"
                                                >
                                                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg overflow-hidden bg-white ring-1 ring-black ring-opacity-5">
                                                        {userNavigation.map((item) => (
                                                            <Link
                                                                href={item.href}
                                                                key={item.name}
                                                            >
                                                                <Menu.Item>
                                                                    <a
                                                                        href={item.href}
                                                                        className={classNames(
                                                                            'block px-4 py-2 text-sm text-gray-700 font-medium',
                                                                            item.bgColor ? `hover:${item.bgColor} hover:text-white` : 'hover:bg-slate-200'
                                                                        )}
                                                                    >
                                                                        {item.name}
                                                                    </a>
                                                                </Menu.Item>
                                                            </Link>
                                                        ))}
                                                    </Menu.Items>
                                                </Transition>
                                            </Menu>
                                        </div>
                                    </div>
                                    <div className="-mr-2 flex md:hidden">
                                        {/* Mobile menu button */}
                                        <Disclosure.Button className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700">
                                            <span className="sr-only">Open main menu</span>
                                            {open ? (
                                                <XIcon className="block h-6 w-6" aria-hidden="true" />
                                            ) : (
                                                <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                                            )}
                                        </Disclosure.Button>
                                    </div>
                                </div>
                            </div>

                            <Disclosure.Panel className="md:hidden">
                                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                                    {navigation.map((item) => (
                                        <Disclosure.Panel
                                            key={item.name}
                                        >
                                            <Link
                                                href={item.href}
                                                key={item.name}
                                            >
                                                <a
                                                    href={item.href}
                                                    className={classNames(
                                                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                        'block px-3 py-2 rounded-md text-base font-medium'
                                                    )}
                                                >
                                                    {item.name}
                                                </a>
                                            </Link>
                                        </Disclosure.Panel>
                                    ))}
                                </div>
                                <div className="pt-4 pb-3 border-t border-gray-700">
                                    <div className="flex items-center px-5">
                                        <div className="flex-shrink-0">
                                            <img
                                                className="h-11 w-11 rounded-full p-[2px] border border-slate-50"
                                                src={account.imageUrl.includes('http') ? account.imageUrl : `data:${user!.image.imageType};base64,${user!.image.base64}`}
                                            />
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-base font-medium leading-none text-white">{account.name}</div>
                                            <div className="text-sm font-medium leading-none text-gray-400">{account.email}</div>
                                        </div>
                                        <button
                                            type="button"
                                            className="ml-auto bg-gray-800 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                                        >
                                            <span className="sr-only">View notifications</span>
                                            <BellIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>
                                    </div>
                                    <div className="mt-3 px-2 space-y-1">
                                        {userNavigation.map((item) => (
                                            <Disclosure.Panel
                                                key={item.name}
                                            >
                                                <Link
                                                    href={item.href}
                                                >
                                                    <a
                                                        href={item.href}
                                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"

                                                    >
                                                        {item.name}
                                                    </a>
                                                </Link>
                                            </Disclosure.Panel>
                                        ))}
                                    </div>
                                </div>
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>
            </div>
        </>
    )
}

export default Header;
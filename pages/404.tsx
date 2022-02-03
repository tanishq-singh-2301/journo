import type { NextPage } from 'next';
import { NextRouter, useRouter } from 'next/router';
import { useEffect } from 'react';

const Custom404: NextPage = () => {
    const Router: NextRouter = useRouter();

    useEffect(() => {
        Router.replace('/');
    }, []);

    return null;
}

export default Custom404
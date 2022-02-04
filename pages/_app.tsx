import '../styles/globals.css';
import 'nprogress/nprogress.css';
import "react-datepicker/dist/react-datepicker.css";
import type { AppProps } from 'next/app';
import { EventsProvider } from '../context/event-context';
import { DiarysProvider } from '../context/diary-context';
import Router from 'next/router';
import NProgress from 'nprogress';
import { UserProvider } from '../context/user-context';
import { TaskProvider } from '../context/task-context';

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 800
});

Router.events.on("routeChangeStart", NProgress.start);
Router.events.on("routeChangeError", NProgress.done);
Router.events.on("routeChangeComplete", NProgress.done);

function MyApp({ Component, pageProps }: AppProps) {

  const appHeight = (): void => {
    const doc: HTMLElement = document.documentElement;
    doc.style.setProperty('--app-height', `${window.innerHeight}px`);
  }

  if (typeof window !== "undefined") {
    window.addEventListener('resize', appHeight);
    appHeight();
  }

  return (
    <>
      <EventsProvider>
        <DiarysProvider>
          <UserProvider>
            <TaskProvider>
              <Component {...pageProps} />
            </TaskProvider>
          </UserProvider>
        </DiarysProvider>
      </EventsProvider>
    </>
  )
}

export default MyApp

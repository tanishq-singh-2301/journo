import '../styles/globals.css';
import 'nprogress/nprogress.css';
import "react-datepicker/dist/react-datepicker.css";
import type { AppProps } from 'next/app';
import { EventsProvider } from '../context/event-context';
import { DiarysProvider } from '../context/diary-context';
import Router from 'next/router';
import nProgress from 'nprogress';
import { UserProvider } from '../context/user-context';
import { TaskProvider } from '../context/task-context';

nProgress.configure({
  showSpinner: false,
  trickleSpeed: 800
});

Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", nProgress.done);

function MyApp({ Component, pageProps }: AppProps) {

  const appHeight = (): void => {
    const doc: HTMLElement = document.documentElement;
    doc.style.setProperty('--app-height', `${window.innerHeight}px`);
  }

  if (typeof window !== "undefined") {
    window.addEventListener('resize', appHeight);
    appHeight();

    // document.ontouchmove = (e) => {
    //   e.preventDefault();
    // }

    document.ontouchmove = (event: any) => {
      var isTouchMoveAllowed = false;
      var p = event.target;

      while (p != null) {
        if (p.classList && p.classList.contains("touchMoveAllowed")) {
          isTouchMoveAllowed = true;
          break;
        }
        p = p.parentNode;
      }

      if (!isTouchMoveAllowed) {
        event.preventDefault();
      }

    };
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

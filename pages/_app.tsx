import '../styles/globals.css';
import 'nprogress/nprogress.css';
import "react-datepicker/dist/react-datepicker.css";
import type { AppProps } from 'next/app';
import { EventsProvider } from '../context/event-context';
import { DiarysProvider } from '../context/diary-context';
import Router from 'next/router';
import NProgress from 'nprogress';
import { UserProvider } from '../context/user-context';

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 800
});

Router.events.on("routeChangeStart", NProgress.start);
Router.events.on("routeChangeError", NProgress.done);
Router.events.on("routeChangeComplete", NProgress.done);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <EventsProvider>
        <DiarysProvider>
          <UserProvider>
            <Component {...pageProps} />
          </UserProvider>
        </DiarysProvider>
      </EventsProvider>
    </>
  )
}

export default MyApp

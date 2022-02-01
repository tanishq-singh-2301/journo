import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { EventsProvider } from '../context/event-context';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <EventsProvider>
        <Component {...pageProps} />
      </EventsProvider>
    </>
  )
}

export default MyApp

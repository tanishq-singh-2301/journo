import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { EventsProvider } from '../context/event-context';
import { DiarysProvider } from '../context/diary-context';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <EventsProvider>
        <DiarysProvider>
          <Component {...pageProps} />
        </DiarysProvider>
      </EventsProvider>
    </>
  )
}

export default MyApp

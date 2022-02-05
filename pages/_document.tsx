import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'

class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <Html>
                <Head>
                    <meta name="apple-mobile-web-app-capable" content="yes"></meta>
                    <meta name="apple-mobile-web-app-status-bar-style" content="black"></meta>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"></meta>
                    <link rel="manifest" href="/manifest.json" />
                    <link rel="apple-touch-icon" href="/journo.png"></link>
                    <meta name="theme-color" content="#fff" />
                </ Head>
                <body className='no-scrollbar'>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
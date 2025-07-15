import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  
  return (
    <div id='div_main'>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#252525" />
        <meta name="format-detection" content="telephone=no" />
      </Head>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp

import Head from 'next/head';
import Script from 'next/script';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '../utils/createEmotionCache';
import theme from '../styles/theme';
import '../styles/globals.css';
import '../styles/styles.css';
import AppContextProvider from '../contexts/AppContextProvider';
import { AppServicesProvider } from '../services/AppServices';
import MockBanner from '../components/MockBanner';
import { useEffect } from 'react';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
    const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
    const showMockBanner = process.env.NEXT_PUBLIC_DO_MOCK === 'true';

    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <title>Squares • Digital Football Squares</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
                <meta name="description" content="The easiest way to play Football Squares with your friends and family located anywhere." />
                <meta property="og:title" content="Squares • Digital Football Squares" />
                <meta property="og:description" content="The easiest way to play Football Squares with your friends and family located anywhere." />
                <meta property="og:image" content="/Squares_LogosOpenGraphImage_Text_Blue.png" />
                <meta property="og:url" content="https://squares.billycougan.com" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Squares • Digital Football Squares" />
                <meta name="twitter:description" content="The easiest way to play Football Squares with your friends and family located anywhere." />
                <meta name="twitter:image" content="https://www.squares.billycougan.com/Squares_LogosTwitterCardImage_Text_Blue.png" />
            </Head>
            {/* Google Analytics */}
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-T6MT8EZK4S"
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-T6MT8EZK4S');
        `}
            </Script>

            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AppContextProvider>
                    <AppServicesProvider>
                        {showMockBanner && <MockBanner />}
                        <Box sx={{ flexGrow: 1 }}>
                            <Component {...pageProps} />
                        </Box>
                    </AppServicesProvider>
                </AppContextProvider>
            </ThemeProvider>
        </CacheProvider>
    );
}

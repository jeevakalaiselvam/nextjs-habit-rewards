// pages/_app.js
import Head from 'next/head';
import 'antd/dist/reset.css'; // Import Ant Design styles
import '../styles/globals.css';
import { Button, ConfigProvider } from 'antd';
import {
  CARD_BACKGROUND,
  COLOR_BACKGROUND,
} from '../components/helpers/colorHelper';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0,maximum-scale=1"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Your App Name" />
        <link rel="apple-touch-icon" href="/icons/icon.png" />
      </Head>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1890ff',
            colorBgBase: '#100d0d',
            colorTextBase: '#fefefe',
            colorLink: '#1890ff',
            colorPrimaryBorder: '#000',
            colorBgContainer: CARD_BACKGROUND,
          },
          components: {
            Select: {
              optionFontSize: '1rem',
              optionActiveBg: CARD_BACKGROUND,
              optionSelectedBg: CARD_BACKGROUND,
              hoverBorderColor: '#000',
              colorBgBase: COLOR_BACKGROUND,
              colorBgContainer: CARD_BACKGROUND,
            },
            Button: {
              primaryShadow: 'none',
              defaultShadow: ' none',
              dangerShadow: 'none',
            },
          },
        }}
      >
        <Component {...pageProps} />
      </ConfigProvider>
    </>
  );
}

export default MyApp;

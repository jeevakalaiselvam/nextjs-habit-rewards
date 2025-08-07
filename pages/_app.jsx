// pages/_app.js
import Head from "next/head";
import "antd/dist/reset.css"; // Import Ant Design styles
import "../styles/globals.css";
import { Button, ConfigProvider } from "antd";
import { CARD_BACKGROUND, COLOR_BACKGROUND } from "../helpers/colorHelper";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../store/store";

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
          token: {},
          components: {},
        }}
      >
        {" "}
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Component {...pageProps} />{" "}
          </PersistGate>
        </Provider>
      </ConfigProvider>
    </>
  );
}

export default MyApp;

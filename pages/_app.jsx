// pages/_app.js
import Head from "next/head";
import "antd/dist/reset.css"; // Import Ant Design styles
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../store/store";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <DndProvider backend={HTML5Backend}>
          <Component {...pageProps} />{" "}
        </DndProvider>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;

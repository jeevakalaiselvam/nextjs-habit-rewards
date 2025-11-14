import { HTML5Backend } from "react-dnd-html5-backend";
import Main from "./Main";
import { DndProvider } from "react-dnd";

export default function Home() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Main />
    </DndProvider>
  );
}

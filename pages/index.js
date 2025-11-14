import { useDispatch, useSelector } from "react-redux";
import Main from "./Main";

export default function Home() {
  const dispatch = useDispatch();
  const { kanbanObj } = useSelector((s) => s.kanban);

  return <Main />;
}

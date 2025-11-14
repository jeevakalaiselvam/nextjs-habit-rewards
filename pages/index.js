import { useDispatch, useSelector } from "react-redux";
import Main from "./Main";

export default function Home() {
  const dispatch = useDispatch();
  const { name, isLoggedIn } = useSelector((s) => s.user);

  return <Main />;
}

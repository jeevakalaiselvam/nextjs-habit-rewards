import { BiSolidMoviePlay } from "react-icons/bi";
import { BsFillCreditCard2FrontFill } from "react-icons/bs";
import {
  FaFemale,
  FaGamepad,
  FaMale,
  FaMoneyBillAlt,
  FaShoppingCart,
} from "react-icons/fa";
import { HiMiniHome } from "react-icons/hi2";
import { IoFastFood } from "react-icons/io5";
import { MdOutlineElectricalServices } from "react-icons/md";
import { TbDeviceDesktopFilled } from "react-icons/tb";

export const ICON_CATEGORY = {
  games: <FaGamepad />,
  movies: <BiSolidMoviePlay />,
  food: <IoFastFood />,
  clothing: <FaShoppingCart />,
  gadget: <TbDeviceDesktopFilled />,
  grocery: <FaGamepad />,
  mom: <FaFemale />,
  dad: <FaMale />,
  loan: <FaMoneyBillAlt />,
  credit: <BsFillCreditCard2FrontFill />,
  house: <HiMiniHome />,
  electricity: <MdOutlineElectricalServices />,
};

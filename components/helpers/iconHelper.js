import { BiSolidMoviePlay } from "react-icons/bi";
import { BsFillCreditCard2FrontFill, BsFillFuelPumpFill } from "react-icons/bs";
import {
  FaFemale,
  FaGamepad,
  FaMale,
  FaMoneyBillAlt,
  FaShoppingCart,
} from "react-icons/fa";
import { HiMiniHome } from "react-icons/hi2";
import { IoFastFood, IoGift } from "react-icons/io5";
import { MdOutlineElectricalServices, MdSubscriptions } from "react-icons/md";
import { TbDeviceDesktopFilled } from "react-icons/tb";

export const ICON_CATEGORY = {
  fuel: <BsFillFuelPumpFill />,
  subscription: <MdSubscriptions />,
  gift: <IoGift />,
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

export const ICON_COLORS = {
  fuel: "#FEAE4E", // warm orange
  subscription: "#FF6C60", // coral red
  gift: "#4DDC9C", // minty green
  games: "#8F63FD", // lavender purple
  movies: "#5474FD", // sky blue
  food: "#FDAC46", // orange (base)
  clothing: "#3BD987", // green (base)
  gadget: "#5474FD", // blue (base)
  grocery: "#FE6662", // red (base)
  mom: "#F984C1", // pink
  dad: "#55C3F0", // teal blue
  loan: "#C87CFE", // violet
  credit: "#F9B846", // golden yellow
  house: "#72C079", // moss green
  electricity: "#FF8D5B", // soft tangerine
};

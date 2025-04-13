import { AiFillFund, AiFillGolden } from "react-icons/ai";
import { BiSolidMoviePlay } from "react-icons/bi";
import { BsFillCreditCard2FrontFill, BsFillFuelPumpFill } from "react-icons/bs";
import {
  FaFemale,
  FaGamepad,
  FaGlobe,
  FaMale,
  FaMoneyBillAlt,
  FaPiggyBank,
  FaShoppingCart,
} from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { HiMiniHome } from "react-icons/hi2";
import { IoFastFood, IoGift } from "react-icons/io5";
import { MdOutlineElectricalServices, MdSubscriptions } from "react-icons/md";
import { PiCertificateFill } from "react-icons/pi";
import { RiStockFill } from "react-icons/ri";
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

export const WALLET_OPTIONS = [
  {
    name: "Provident Fund",
    id: "providentfund",
    color: "#6A5ACD",
    icon: <FaPiggyBank />,
  },
  {
    name: "Liquid Money",
    id: "liquidfund",
    color: "#00CED1",
    icon: <FaIndianRupeeSign />,
  },
  { name: "Gold", id: "gold", color: "#FFD700", icon: <AiFillGolden /> },
  {
    name: "Mutual Funds",
    id: "mutualfunds",
    color: "#3CB371",
    icon: <AiFillFund />,
  },
  { name: "Stocks", id: "stocks", color: "#FF6347", icon: <RiStockFill /> },
  { name: "Bonds", id: "bonds", color: "#4682B4", icon: <PiCertificateFill /> },
];

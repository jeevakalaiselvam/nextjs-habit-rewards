import { AiFillFund, AiFillGolden } from "react-icons/ai";
import { BiSolidMoviePlay } from "react-icons/bi";
import { BsFillCreditCard2FrontFill, BsFillFuelPumpFill } from "react-icons/bs";
import {
  FaCar,
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
  Fuel: <BsFillFuelPumpFill />,
  Subscription: <MdSubscriptions />,
  Gift: <IoGift />,
  Games: <FaGamepad />,
  Movies: <BiSolidMoviePlay />,
  Food: <IoFastFood />,
  Clothing: <FaShoppingCart />,
  Gadget: <TbDeviceDesktopFilled />,
  Grocery: <FaGamepad />,
  Mom: <FaFemale />,
  Dad: <FaMale />,
  Loan: <FaMoneyBillAlt />,
  Credit: <BsFillCreditCard2FrontFill />,
  House: <HiMiniHome />,
  Electricity: <MdOutlineElectricalServices />,
  Car: <FaCar />,
  "Provident Fund": <FaPiggyBank />,
  "Liquid Fund": <FaIndianRupeeSign />,
  Gold: <AiFillGolden />,
  "Mutual Funds": <AiFillFund />,
  Stocks: <RiStockFill />,
  Bonds: <PiCertificateFill />,
  Achu: <FaFemale />,
  Mom: <FaFemale />,
  Dad: <FaFemale />,
};

export const ICON_COLORS = {
  Fuel: "#FEAE4E", // warm orange
  Subscription: "#FF6C60", // coral red
  Gift: "#4DDC9C", // minty green
  Games: "#8F63FD", // lavender purple
  Movies: "#5474FD", // sky blue
  Food: "#FDAC46", // orange (base)
  Clothing: "#3BD987", // green (base)
  Gadget: "#5474FD", // blue (base)
  Grocery: "#FE6662", // red (base)
  Mom: "#F984C1", // pink
  Dad: "#55C3F0", // teal blue
  Loan: "#C87CFE", // violet
  Credit: "#F9B846", // golden yellow
  House: "#72C079", // moss green
  Electricity: "#FF8D5B", // soft tangerine
  "Provident Fund": "#6A5ACD",
  "Liquid Fund": "#00CED1",
  Gold: "#FFD700",
  "Mutual Funds": "#3CB371",
  Stocks: "#FF6347",
  Bonds: "#4682B4",
  Car: "#659324",
  Achu: "#19c8d5",
  Mom: "#19c8d5",
  Dad: "#19c8d5",
  Personal: "#FF6347",
  Family: "#5474FD",
  Investment: "#3BD987",
};

export const WALLET_OPTIONS = [
  {
    name: "Provident Fund",
    id: "Provident Fund",
    color: "#6A5ACD",
    icon: <FaPiggyBank />,
  },
  {
    name: "Liquid Money",
    id: "Liquid Money",
    color: "#00CED1",
    icon: <FaIndianRupeeSign />,
  },
  { name: "Gold", id: "Gold", color: "#FFD700", icon: <AiFillGolden /> },
  {
    name: "Mutual Funds",
    id: "Mutual Funds",
    color: "#3CB371",
    icon: <AiFillFund />,
  },
  { name: "Stocks", id: "Stocks", color: "#FF6347", icon: <RiStockFill /> },
  { name: "Bonds", id: "Bonds", color: "#4682B4", icon: <PiCertificateFill /> },
];

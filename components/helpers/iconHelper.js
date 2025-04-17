import { AiFillFund, AiFillGolden } from "react-icons/ai";
import { BiSolidCylinder, BiSolidMoviePlay } from "react-icons/bi";
import { BsFillCreditCard2FrontFill, BsFillFuelPumpFill } from "react-icons/bs";
import {
  FaBusAlt,
  FaCar,
  FaFemale,
  FaGamepad,
  FaGlobe,
  FaInternetExplorer,
  FaMale,
  FaMoneyBillAlt,
  FaPiggyBank,
  FaShoppingCart,
} from "react-icons/fa";
import { FaIndianRupeeSign, FaShieldDog } from "react-icons/fa6";
import { GiChickenOven, GiFruitBowl } from "react-icons/gi";
import { HiShoppingCart } from "react-icons/hi";
import { HiMiniHome } from "react-icons/hi2";
import { IoFastFood, IoGift } from "react-icons/io5";
import {
  MdEventNote,
  MdFastfood,
  MdOutlineElectricalServices,
  MdSubscriptions,
} from "react-icons/md";
import { PiCertificateFill } from "react-icons/pi";
import { RiPlantFill, RiStockFill } from "react-icons/ri";
import { TbDeviceDesktopFilled, TbMilkFilled } from "react-icons/tb";

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
  Electricity: <FaInternetExplorer />,
  Internet: <MdOutlineElectricalServices />,
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
  Malligai: <HiShoppingCart />,
  Vegetables: <RiPlantFill />,
  Fruits: <GiFruitBowl />,
  LPG: <BiSolidCylinder />,
  Meat: <GiChickenOven />,
  Puppy: <FaShieldDog />,
  Milk: <TbMilkFilled />,
  Patti: <FaFemale />,
  Mom: <FaFemale />,
  Dad: <FaMale />,
  Jeeva: <FaMale />,
  Sindhu: <FaFemale />,
  Jeeva: <FaMale />,
  Sindhu: <FaFemale />,
  Event: <MdEventNote />,
  Travel: <FaBusAlt />,
  Snacks: <MdFastfood />,
  Extra: <FaIndianRupeeSign />,
};

export const ICON_COLORS = {
  Internet: "#4ea0fe",
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
  Sindhu: "#84f9af", // pink
  Jeeva: "#e6f055", // teal blue
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
  Grocery: "#d7f227",
  Malligai: "#cd5ab2",
  Vegetables: "#5acd80",
  Fruits: "#6A5ACD",
  LPG: "#de5050",
  Meat: "#bfcb33",
  Puppy: "#36c8e2",
  Milk: "#b0e6f0",
  Patti: "#fbb3ab",
  Mom: "#ed91ff",
  Dad: "#89ff9d",
  Jeeva: "#c1ff7a",
  Sindhu: "#6068ff",
  Event: "#91ff9e",
  Travel: "#ffd97a",
  Snacks: "#60a5ff",
  Extra: "#b991ff",
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

export const GROCERY_OPTIONS = [
  {
    name: "Malligai",
    id: "Malligai",
    color: "#cd5ab2",
    icon: <HiShoppingCart />,
  },
  {
    name: "Vegetables",
    id: "Vegetables",
    color: "#5acd80",
    icon: <RiPlantFill />,
  },
  {
    name: "Fruits",
    id: "Fruits",
    color: "#6A5ACD",
    icon: <GiFruitBowl />,
  },
  {
    name: "LPG",
    id: "LPG",
    color: "#de5050",
    icon: <BiSolidCylinder />,
  },
  {
    name: "Meat",
    id: "Meat",
    color: "#bfcb33",
    icon: <GiChickenOven />,
  },
  {
    name: "Puppy",
    id: "Puppy",
    color: "#36c8e2",
    icon: <FaShieldDog />,
  },
  {
    name: "Milk",
    id: "Milk",
    color: "#b0e6f0",
    icon: <TbMilkFilled />,
  },
  {
    name: "Patti",
    id: "Patti",
    color: "#fbb3ab",
    icon: <FaFemale />,
  },
  {
    name: "Mom",
    id: "Mom",
    color: "#ed91ff",
    icon: <FaFemale />,
  },
  {
    name: "Dad",
    id: "Dad",
    color: "#89ff9d",
    icon: <FaMale />,
  },
  {
    name: "Jeeva",
    id: "Jeeva",
    color: "#c1ff7a",
    icon: <FaMale />,
  },
  {
    name: "Sindhu",
    id: "Sindhu",
    color: "#6068ff",
    icon: <FaFemale />,
  },
  {
    name: "Event",
    id: "Event",
    color: "#91ff9e",
    icon: <MdEventNote />,
  },
  {
    name: "Travel",
    id: "Travel",
    color: "#ffd97a",
    icon: <FaBusAlt />,
  },
  {
    name: "Snacks",
    id: "Snacks",
    color: "#60a5ff",
    icon: <MdFastfood />,
  },
  {
    name: "Extra",
    id: "Extra",
    color: "#b991ff",
    icon: <FaIndianRupeeSign />,
  },
];

import moment from "moment/moment";
import { getOperatorIconFor } from "./operatorHelper";
import {
  COLOR_ACCENT,
  COLOR_BRONZE,
  COLOR_COPPER,
  COLOR_GOLD,
  COLOR_PLATINUM,
  COLOR_SILVER,
} from "./colorHelper";

export const ICON_MAPPER = {
  "Battlefield 2042":
    "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/1517290/59d040bb9b67112e982261a71d93ed033740ac4c.jpg",
  "Hitman World of Assassination":
    "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/1659040/79c615cd7d3feef4deb072173a36ee546e916615.jpg",
  Dex: "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/269650/37dd7d1b585764249e35566fc1afca5c76de340b.jpg",
  "Rainbow Six Siege":
    "https://cdn2.steamgriddb.com/icon/bcb4bf9c71b2ceaca2cc07f5a07cd397.png",
};

export const GAMES_ARRAY = [
  "Battlefield 2042",
  "Hitman World of Assassination",
  "Dex",
];

export const getFandomRemovedUrl = (url) => {
  return url?.includes("/revision/latest")
    ? url?.split("/revision/latest")?.[0]
    : url;
};

export const formatIndianMoney = (value) => {
  return new Intl.NumberFormat("en-IN").format(value);
};

export const TROPHY_PLACEHOLDER =
  "https://wallpapers.com/images/hd/sick-steam-logo-z39nec53f2dqayr0.jpg";

export const getTimeFormattedForAch = (time) => {
  return moment(new Date(time)).format("DD MMM, YYYY hh:mm A");
};

const SIEGE_ICONS = {
  ash: "https://staticctf.ubisoft.com/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/58Y4Q2x7msL8uQUoiA7LGM/b204acc9c5a015029140723ef2e435bb/Y0R6_BADGE_Ash_L.png",
};

export const getIconBasedOnKeyword = (keyword) => {
  console.log("KEY", keyword);
  return getOperatorIconFor(keyword?.split(" ")?.[0]);
};

export const getTrophyColor = (name) => {
  if (name == "Gold") {
    return COLOR_GOLD;
  }
  if (name == "Silver") {
    return COLOR_SILVER;
  }
  if (name == "Bronze") {
    return COLOR_COPPER;
  }
  if (name == "Platinum") {
    return COLOR_PLATINUM;
  }
};

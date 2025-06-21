import moment from "moment/moment";


export const ICON_MAPPER = {
  "Battlefield 2042":
    'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/1517290/59d040bb9b67112e982261a71d93ed033740ac4c.jpg',
  "Hitman World of Assassination":
    'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/1659040/79c615cd7d3feef4deb072173a36ee546e916615.jpg',
  "Dex":
    'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/269650/37dd7d1b585764249e35566fc1afca5c76de340b.jpg',
    "Rainbow Six Siege": "https://images.steamusercontent.com/ugc/1797474602914928017/E4477817964EABF1E2E59DB6B815C584E68951F9/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false"
};


export const GAMES_ARRAY = ['Battlefield 2042', 'Hitman World of Assassination', "Dex"];



export const getFandomRemovedUrl = (url) => {
  return url?.includes('/revision/latest')
    ? url?.split('/revision/latest')?.[0]
    : url;
};

export const formatIndianMoney = (value) => {
  return new Intl.NumberFormat('en-IN').format(value);
};


export const TROPHY_PLACEHOLDER = "https://wallpapers.com/images/hd/sick-steam-logo-z39nec53f2dqayr0.jpg"

export const getTimeFormattedForAch = (time) => {
  return moment(new Date(time)).format(
    "DD MMM, YYYY hh:mm A"
  );
};

const SIEGE_ICONS = {
  "ash":"URL"
}

export const  getIconBasedOnKeyword = (keyword) => {
  return 
}
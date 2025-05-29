export const Battlefield2042 = 'Battlefield 2042';
export const Hitman = 'Hitman World of Assassination';

export const ICON_MAPPER = {
  [Battlefield2042]:
    'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/1517290/59d040bb9b67112e982261a71d93ed033740ac4c.jpg',
  [Hitman]:
    'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/1659040/79c615cd7d3feef4deb072173a36ee546e916615.jpg',
};


export const GAMES_ARRAY = ['Battlefield 2042', 'Hitman World of Assassination'];



export const getFandomRemovedUrl = (url) => {
  return url?.includes('/revision/latest')
    ? url?.split('/revision/latest')?.[0]
    : url;
};

export const formatIndianMoney = (value) => {
  return new Intl.NumberFormat('en-IN').format(value);
};

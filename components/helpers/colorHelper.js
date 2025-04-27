export const COLOR_BACKGROUND = "#010A19";
export const COLOR_BACKGROUND_HEADER = "#121723";

export const CARD_BACKGROUND = "#121723";
export const COLOR_ACCENT = "#1890ff";
export const COLOR_ACCENT_DARK = "rgb(6, 42, 75)";
export const COLOR_SUCCESS = "#15C2C2";
export const COLOR_STREAK = "#15C2C2";

export const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff;
    // Force the value to be in the light range (e.g., 127–255)
    value = Math.floor((value + 255) / 2);
    color += value.toString(16).padStart(2, "0");
  }
  return color;
};

const baseColors = [
  "#FDAC46", // food
  "#FE6662", // movies
  "#3BD987", // clothing
  "#5474FD", // gadget
  "#8854FC", // games
];

// Utility to convert HEX to HSL
function hexToHSL(hex) {
  const r = parseInt(hex.substr(1, 2), 16) / 255;
  const g = parseInt(hex.substr(3, 2), 16) / 255;
  const b = parseInt(hex.substr(5, 2), 16) / 255;

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }

  return { h, s, l };
}

// Utility to convert HSL to HEX
function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;

  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const color =
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };

  return `#${f(0)}${f(8)}${f(4)}`;
}

// Main generator
export const generateSimilarColor = () => {
  const base = baseColors[Math.floor(Math.random() * baseColors.length)];
  const { h, s, l } = hexToHSL(base);

  const newH = (h + (Math.random() * 20 - 10) + 360) % 360;
  const newS = Math.min(100, Math.max(40, s * 100 + (Math.random() * 20 - 10)));
  const newL = Math.min(90, Math.max(40, l * 100 + (Math.random() * 20 - 10)));

  return hslToHex(newH, newS, newL);
};

export const generateDarkTextColorForLightBg = (hex, darkenPercent = 40) => {
  let newHex = hex ? hex : "#333333";
  const amt = Math.round(2.55 * darkenPercent);

  const R = Math.max(0, parseInt(newHex?.slice(1, 3), 16) - amt);
  const G = Math.max(0, parseInt(newHex?.slice(3, 5), 16) - amt);
  const B = Math.max(0, parseInt(newHex?.slice(5, 7), 16) - amt);

  return `#${[R, G, B].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
};

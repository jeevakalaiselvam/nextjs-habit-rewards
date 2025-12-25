export const getColorBasedOnRarity = (percentage) => {
  if (percentage >= 0 && percentage <= 5) {
    return "Platinum";
  } else if (percentage > 5 && percentage <= 10) {
    return "Gold";
  } else if (percentage > 10 && percentage <= 25) {
    return "Silver";
  } else if (percentage > 20 && percentage <= 100) {
    return "Bronze";
  }
};

export const getRarityBasedOnRarity = (percentage) => {
  if (percentage > 0 && percentage <= 5) {
    return "Ultra Rare";
  } else if (percentage > 5 && percentage <= 10) {
    return "Very Rare";
  } else if (percentage > 10 && percentage <= 25) {
    return "Rare";
  } else if (percentage > 25 && percentage <= 50) {
    return "Uncommon";
  } else if (percentage > 50 && percentage <= 100) {
    return "Common";
  }
};

export const formatNumberWithCommas = (number) => {
  return number.toLocaleString();
};

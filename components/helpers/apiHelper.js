export const getRewardApiKeyForUser = (user) => {
  if (user == 'Jeeva') {
    return 'jeevareward';
  }

  if (user == 'Aswathy') {
    return 'jeevareward';
  }

  if (user == 'Mom') {
    return 'momreward';
  }
  if (user == 'Dad') {
    return 'dadreward';
  }
};

export const getHabitApiKeyForUser = (user) => {
  if (user == 'Jeeva') {
    return 'jeevahabit';
  }

  if (user == 'Aswathy') {
    return 'jeevahabit';
  }

  if (user == 'Mom') {
    return 'momhabit';
  }
  if (user == 'Dad') {
    return 'dadhabit';
  }
};

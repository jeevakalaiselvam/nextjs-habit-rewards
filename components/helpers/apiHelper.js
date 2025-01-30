import axios from 'axios';

export const getRewardApiKeyForUser = (user) => {
  if (user == 'Jeeva') {
    return 'rewards';
  }

  if (user == 'Aswathy') {
    return 'rewards';
  }

  if (user == 'Mom') {
    return 'rewards';
  }
  if (user == 'Dad') {
    return 'rewards';
  }

  if (user == 'Vikram') {
    return 'rewards';
  }

  if (user == 'Guest') {
    return 'rewards';
  }
};

export const getHabitApiKeyForUser = (user) => {
  if (user == 'Jeeva') {
    return 'habits';
  }

  if (user == 'Aswathy') {
    return 'habits';
  }

  if (user == 'Mom') {
    return 'habits';
  }
  if (user == 'Dad') {
    return 'habits';
  }
  if (user == 'Guest') {
    return 'habits';
  }

  if (user == 'Vikram') {
    return 'habits';
  }
};

export const getMongoRewardForUser = (user) => {
  if (user == 'Jeeva') {
    return 'jeevareward';
  }

  if (user == 'Aswathy') {
    return 'aswathyreward';
  }

  if (user == 'Mom') {
    return 'momreward';
  }
  if (user == 'Dad') {
    return 'dadreward';
  }

  if (user == 'Vikram') {
    return 'vikramreward';
  }

  if (user == 'Guest') {
    return 'guestreward';
  }
};

export const getMongoHabitsForUser = (user) => {
  if (user == 'Jeeva') {
    return 'jeevahabit';
  }

  if (user == 'Aswathy') {
    return 'aswathyhabit';
  }

  if (user == 'Mom') {
    return 'momhabit';
  }
  if (user == 'Dad') {
    return 'dadhabit';
  }

  if (user == 'Vikram') {
    return 'vikramhabit';
  }

  if (user == 'Guest') {
    return 'guesthabit';
  }
};

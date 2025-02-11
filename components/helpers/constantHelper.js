export const CATEGORY_OPTIONS = [
  { id: 'Health', value: 'Health' },
  { id: 'Cleaning', value: 'Cleaning' },
  { id: 'Weight Loss', value: 'Weight Loss' },
  { id: 'Skincare', value: 'Skincare' },
  { id: 'Work', value: 'Work' },
  { id: 'Good Habit', value: 'Good Habit' },
  { id: 'Hobby', value: 'Hobby' },
  { id: 'Puppy', value: 'Puppy' },
  { id: 'Introvert', value: 'Introvert' },
  { id: 'House', value: 'House' },
  { id: 'Food', value: 'Food' },
  { id: 'Base', value: 'Base' },
  { id: 'Gaming', value: 'Gaming' },
  { id: 'Others', value: 'Others' },
];

export const MULTI_OPTIONS = [
  { id: 'Single', value: 'Single' },
  { id: 'Multi', value: 'Multi' },
];

export const getRelativeDate = (inputDateString) => {
  // Parse the input date string (assuming "DD-MM-YYYY" format)
  const [day, month, year] = inputDateString.split('-').map(Number);
  const inputDate = new Date(year, month - 1, day);

  // Get the current date (start of the day)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate the difference in days
  const diffTime = inputDate - today; // Difference in milliseconds
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); // Convert to days

  // Return the appropriate description
  if (diffDays === 0) return 'Today';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays > 1) return `${diffDays} Days from now`;
  return `${Math.abs(diffDays)} Days ago`;
};

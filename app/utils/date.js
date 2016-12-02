export const MONTHS_OF_YEAR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

export const formatDate = (date) => {
  let now = new Date();
  let minutes = date.getMinutes();
  minutes = date.getMinutes() < 10 ? '0' + minutes : minutes;

  if ( now.getTime() - date.getTime() < 60000 ) {
    return 'now';
  }

  if ( now.getDate() == date.getDate() ) {
    return date.getHours() + ':' + minutes;
  }

  return date.getDate() + ' ' + MONTHS_OF_YEAR[ date.getMonth() ] + ' ' + date.getHours() + ':' + minutes;
};

const getDate = () => {
  const dateObj = new Date();

  let dateString = dateObj.getFullYear() + '-';
  const month = dateObj.getMonth() + 1;
  dateString += (/\d{2}/.test(month) ? month : '0' + month) + '-';
  const date = dateObj.getDate();
  dateString += /\d{2}/.test(date) ? date : '0' + date;
  
  return dateString;
};

const timeToString = (time) => {
  time = Math.floor(time / 10);
  let ms = String(time % 100);
  while (!/\d{2}/.test(ms)) ms = '0'.concat(ms);
  time = Math.floor(time /= 100);

  let seconds = String(time % 60);
  while (!/[0-5]\d/.test(seconds)) {
    seconds = '0'.concat(seconds);
  }
  time = Math.floor(time /= 60);

  let minutes = time % 60;
  while (!/[0-5]\d/.test(minutes)) {
    minutes = '0'.concat(minutes);
  }
  time = Math.floor(time /= 60);

  let hour = time;

  return hour + ":" + minutes + ":" + seconds + "." + ms;
};

export default {getDate, timeToString};
const getDate = (dateObj) => {
  dateObj = dateObj || new Date();

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

const stringToTime = (str) => {
  const reg = /^(\d{1,}):(\d{2}):(\d{2}).(\d{2})$/g;
  const result = reg.exec(str);
  if(!result) return null;
  else {
    const hours = +result[1];
    const mins = +result[2];
    const secs = +result[3];
    const msecs = +result[4];

    return hours*60*60*1000 + mins*60*1000 + secs*1000 + msecs;
  }
};

const findUserItemByDate = (userItems, date) => {
  if(!userItems) return null;
  let ret;
  userItems.some(userItem => {
    if(userItem.date === date) {
      ret = userItem;
      return true;
    }
    return false;
  });
  return ret;
};

const findItemById = (userItems, date, _id) => {
  if(!userItems) return null;
  let ret;
  userItems.some(userItem => {
    if(userItem.date === date) {
      userItem.dateItems.some(dateItem => {
        if(String(dateItem._id) === String(_id)) {
          ret = dateItem;
          return true;
        }
        return false;
      });
      return true;
    }
    return false;
  });
  return ret;
};

const findItemBySubject = (userItems, date, subject) => {
  if(!userItems) return null;
  let ret;
  
  userItems.some(userItem => {
    if(userItem.date === date) {
      userItem.dateItems.some(dateItem => {
        if(dateItem.subject === subject) {
          ret = dateItem;
          return true;
        }
        return false;
      });
      return true;
    }
    return false;
  });

  return ret;
};

export default {getDate, timeToString, stringToTime, findItemById, findItemBySubject, findUserItemByDate};
export const formatDate = (date) => {
  const newDate = new Date(date);
  const year = newDate.getFullYear();
  const month = newDate.getMonth() + 1;
  const day = newDate.getDate();

  const hours = newDate.getHours();
  const minutes = newDate.getMinutes();
  const seconds = newDate.getSeconds();

  return `${year > 9 ? year : "0" + year}-${month > 9 ? month : "0" + month}-${
    day > 9 ? day : "0" + day
  } ${hours > 9 ? hours : "0" + hours}:${
    minutes > 9 ? minutes : "0" + minutes
  }:${seconds > 9 ? seconds : "0" + seconds}`;
};

export const formatBytes = (bytes) => {
  if (bytes >= Math.pow(1024, 4)) {
    return (bytes / Math.pow(1024, 4)).toFixed(2) + " TB";
  } else if (bytes >= Math.pow(1024, 3)) {
    return (bytes / Math.pow(1024, 3)).toFixed(2) + " GB";
  } else if (bytes >= Math.pow(1024, 2)) {
    return (bytes / Math.pow(1024, 2)).toFixed(2) + " MB";
  } else if (bytes >= 1024) {
    return (bytes / 1024).toFixed(2) + " KB";
  } else {
    return bytes + " bytes";
  }
};

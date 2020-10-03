import * as firebase from "firebase/app";

export const firebaseTimestampToDateString = (date: firebase.firestore.Timestamp): string => {
  const fullDate = (new Date(date.seconds * 1000));
  return (fullDate.getMonth() + 1) +
    "/" + fullDate.getDate() +
    "/" + fullDate.getFullYear();
}

export const toTimestamp = (date: Date | firebase.firestore.Timestamp | undefined) => {
  return date instanceof firebase.firestore.Timestamp ? date : firebase.firestore.Timestamp.fromDate(date ?? new Date());
}

export const arrSum = (arr: number[]): number => arr.reduce((a, b) => a + b, 0);

export const arrMin = (arr: number[]): number => arr.reduce((a, b) => Math.min(a, b), Number.MAX_SAFE_INTEGER);

export const isValidInteger = (str: string): Boolean => {
  str = str.trim();
  if (!str) {
    return false;
  }
  str = str.replace(/^0+/, "") || "0";
  var n = Math.floor(Number(str));
  return n !== Infinity && String(n) === str && n >= 0;
}

export const isValidCurrency = (str: string): Boolean => {
  const currencyRegex = /^\d+(?:\.\d{0,2})$/;
  return currencyRegex.test(str);
}

export const toCurrency = (input: string | number): number => {
  const result = Number(parseFloat(String(input)).toFixed(2));
  if (isNaN(result)) {
    console.error(result + ' is not a number');
    return 0;
  }
  return result;
}

export const toInteger = (input: string | number) => {
  const result = parseInt(String(input));
  if (isNaN(result)) {
    console.error(result + ' is not a number');
    return 0;
  }
  return result;
}
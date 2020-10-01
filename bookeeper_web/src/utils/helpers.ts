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
import * as firebase from "firebase/app";

export const firebaseTimestampToDateString = (date: firebase.firestore.Timestamp): string => {
  const fullDate = (new Date(date.nanoseconds));
  return (fullDate.getMonth() + 1) +
    "/" + fullDate.getDate() +
    "/" + fullDate.getFullYear();
}
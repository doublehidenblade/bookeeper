import * as firebase from "firebase/app";

export const firebaseTimestampToDateString = (date: firebase.firestore.Timestamp): string => {
  const fullDate = (new Date(date.seconds * 1000));
  return (fullDate.getMonth() + 1) +
    "/" + fullDate.getDate() +
    "/" + fullDate.getFullYear();
}
import * as firebase from "firebase/app";
import { classToPlain, plainToClass } from 'class-transformer';

export class Payroll {
  constructor(
    readonly date: firebase.firestore.Timestamp,
    readonly employee_id: string,
    readonly withholding: number,
    readonly disbursement: number,
  ) { }

}

export type PayrollData = {
  data: Payroll,
  id: string,
}

/*
documentation:
https://firebase.google.com/docs/reference/js/firebase.firestore.FirestoreDataConverter#tofirestore
*/
export const payrollConverter = {
  toFirestore(data: Payroll): firebase.firestore.DocumentData {
    return classToPlain(data);
  },

  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): Payroll {
    const JSONdata = snapshot.data(options)!;
    return plainToClass(Payroll, JSONdata);
  }
};
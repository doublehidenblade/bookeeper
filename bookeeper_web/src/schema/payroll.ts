import * as firebase from "firebase/app";
import { Entries } from "../utils/types";
import { toTimestamp, toCurrency } from "../utils/helpers";

export const payrollTableOptions = [
  {
    key: 'employee_name',
    label: 'employee name',
    type: 'string',
    required: true,
  },
  {
    key: 'date',
    label: 'date',
    type: 'date',
    required: true,
  },
  {
    key: 'salary',
    label: 'salary($)',
    type: 'number',
    required: true,
  },
  {
    key: 'disbursement',
    label: 'disbursement($)',
    type: 'number',
    required: true,
  },
  {
    key: 'withholding',
    label: 'withholding($)',
    type: 'number',
    required: true,
  },
];

export type PayrollTableData = {
  employee_name: string | null | undefined,
  date: string | null | undefined,
  salary: number | null | undefined,
  disbursement: number | null | undefined,
  withholding: number | null | undefined,
}

export class Payroll {
  date: firebase.firestore.Timestamp;
  employee_id: string;
  withholding: number;
  disbursement: number;
  constructor(data: Entries) {
    this.date = toTimestamp(data?.date);
    this.employee_id = String(data?.employee_id);
    this.withholding = toCurrency(Number(data?.withholding));
    this.disbursement = toCurrency(Number(data?.disbursement));
  }

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
    return { ...data };
  },

  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): Payroll {
    const JSONdata = snapshot.data(options)!;
    return new Payroll(JSONdata);
  }
};
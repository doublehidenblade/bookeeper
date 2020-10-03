import * as firebase from "firebase/app";
import { Entries } from "../utils/types";
import { toTimestamp, toInteger } from "../utils/helpers";

export const invoiceTableOptions = [
  {
    key: 'customer_name',
    label: 'customer name',
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
    key: 'quantity',
    label: 'quantity',
    type: 'number',
    required: true,
  },
  {
    key: 'price',
    label: 'price($)',
    type: 'number',
    required: true,
  },
  {
    key: 'total',
    label: 'total($)',
    type: 'number',
    required: true,
  },
];

export type InvoiceTableData = {
  customer_name: string | null | undefined,
  date: string | null | undefined,
  quantity: number | null | undefined,
  price: number | null | undefined,
  total: number | null | undefined,
}

export class Invoice {
  date: firebase.firestore.Timestamp;
  customer_id: string;
  quantity: number;
  constructor(data: Entries) {
    this.date = toTimestamp(data?.date);
    this.customer_id = String(data?.customer_id);
    this.quantity = toInteger(Number(data?.quantity));
  }

}

export type InvoiceData = {
  data: Invoice,
  id: string,
}

/*
documentation:
https://firebase.google.com/docs/reference/js/firebase.firestore.FirestoreDataConverter#tofirestore
*/
export const invoiceConverter = {
  toFirestore(data: Invoice): firebase.firestore.DocumentData {
    return { ...data };
  },

  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): Invoice {
    const JSONdata = snapshot.data(options)!;
    return new Invoice(JSONdata);
  }
};
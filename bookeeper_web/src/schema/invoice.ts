import * as firebase from "firebase/app";
import { classToPlain, plainToClass } from 'class-transformer';

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
  constructor(
    readonly date: firebase.firestore.Timestamp,
    readonly customer_id: string,
    readonly quantity: number,
  ) { }

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
    return classToPlain(data);
  },

  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): Invoice {
    const JSONdata = snapshot.data(options)!;
    return plainToClass(Invoice, JSONdata);
  }
};
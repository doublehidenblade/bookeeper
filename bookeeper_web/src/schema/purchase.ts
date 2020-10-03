import * as firebase from "firebase/app";
import { Entries } from "../utils/types";
import { toTimestamp, toInteger } from "../utils/helpers";

export const purchaseTableOptions = [
  {
    key: 'company_name',
    label: 'supplier',
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
    key: 'part',
    label: 'part',
    type: 'string',
    required: true,
  },
  {
    key: 'quantity',
    label: 'quantity',
    type: 'number',
    required: true,
  },
  {
    key: 'price_per_part',
    label: 'price/part($)',
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

export type PurchaseTableData = {
  company_name: string | null | undefined,
  part: string | null | undefined,
  date: string | null | undefined,
  price_per_part: number | null | undefined,
  quantity: number | null | undefined,
  total: number | null | undefined,
}

export class Purchase {
  date: firebase.firestore.Timestamp;
  company_id: string;
  quantity: number;
  constructor(data: Entries) {
    this.date = toTimestamp(data?.date);
    this.company_id = String(data?.company_id);
    this.quantity = toInteger(Number(data?.quantity));
  }

}

export type PurchaseData = {
  data: Purchase,
  id: string,
}

/*
documentation:
https://firebase.google.com/docs/reference/js/firebase.firestore.FirestoreDataConverter#tofirestore
*/
export const purchaseConverter = {
  toFirestore(data: Purchase): firebase.firestore.DocumentData {
    return { ...data };
  },

  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): Purchase {
    const JSONdata = snapshot.data(options)!;
    return new Purchase(JSONdata);
  }
};
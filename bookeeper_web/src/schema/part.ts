import * as firebase from "firebase/app";
import { Entries, FieldTypes } from "../utils/types";
import { toInteger } from "../utils/helpers";

export const partTableOptions = [
  {
    key: 'part',
    label: 'part',
    type: FieldTypes.string,
    required: true,
  },
  {
    key: 'quantity',
    label: 'quantity',
    type: FieldTypes.integer,
    required: true,
  },
  {
    key: 'price_per_part',
    label: 'price/part($)',
    type: FieldTypes.currency,
    required: true,
  },
  {
    key: 'company_name',
    label: 'company name',
    type: FieldTypes.string,
    required: true,
  },
  {
    key: 'total',
    label: 'total($)',
    type: FieldTypes.currency,
    required: true,
  },
  {
    key: 'is_reorder',
    label: 'reorder',
    type: FieldTypes.string,
    required: true,
  },
];

export type PartTableData = {
  company_name: string | null | undefined,
  part: string | null | undefined,
  price_per_part: number | null | undefined,
  quantity: number | null | undefined,
  total: number | null | undefined,
  is_reorder: string | null | undefined,
}

export class Part {
  is_reorder: boolean;
  name: string;
  quantity: number;
  company_name: string;
  constructor(data: Entries) {
    this.is_reorder = Boolean(data?.is_reorder);
    this.name = String(data?.name);
    this.quantity = toInteger(Number(data?.quantity));
    this.company_name = String(data?.company_name);
  }

}

export type PartData = {
  data: Part,
  id: string,
}

/*
documentation:
https://firebase.google.com/docs/reference/js/firebase.firestore.FirestoreDataConverter#tofirestore
*/
export const partConverter = {
  toFirestore(data: Part): firebase.firestore.DocumentData {
    return { ...data };
  },

  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): Part {
    const JSONdata = snapshot.data(options)!;
    return new Part(JSONdata);
  }
};
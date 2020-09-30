import * as firebase from "firebase/app";
import { classToPlain, plainToClass } from 'class-transformer';

export const partTableOptions = [
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
    key: 'company_name',
    label: 'company name',
    type: 'string',
    required: true,
  },
  {
    key: 'total',
    label: 'total($)',
    type: 'number',
    required: true,
  },
  {
    key: 'is_reorder',
    label: 'reorder',
    type: 'string',
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
  constructor(
    readonly is_reorder: boolean,
    readonly name: string,
    readonly quantity: number,
    readonly price_per_part: number,
    readonly company_name: string,
  ) { }

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
    return classToPlain(data);
  },

  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): Part {
    const JSONdata = snapshot.data(options)!;
    return plainToClass(Part, JSONdata);
  }
};
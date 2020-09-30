import * as firebase from "firebase/app";
import { classToPlain, plainToClass } from 'class-transformer';

export const vendorFormOptions = [
  {
    key: 'company_name',
    label: 'company name',
    type: 'string',
    required: true,
  },
  {
    key: 'part',
    label: 'part',
    type: 'string',
    required: true,
  },
  {
    key: 'price_per_part',
    label: 'price/part',
    type: 'number',
    required: true,
  },
  {
    key: 'address_line_1',
    label: 'address line 1',
    type: 'string',
    required: true,
  },
  {
    key: 'address_line_2',
    label: 'address line 2',
    type: 'string',
    required: false,
  },
  {
    key: 'city',
    label: 'city',
    type: 'string',
    required: true,
  },
  {
    key: 'state',
    label: 'state',
    type: 'string',
    required: true,
  },
  {
    key: 'zip_code',
    label: 'zip code',
    type: 'number',
    required: true,
  },
];

export class Vendor {
  constructor(
    readonly company_name: string,
    readonly part: string,
    readonly price_per_part: number,
    readonly address_line_1: string,
    readonly address_line_2: string = '',
    readonly city: string,
    readonly state: string,
    readonly zip_code: number,
  ) { }

}

export type VendorData = {
  data: Vendor,
  id: string,
}

/*
documentation:
https://firebase.google.com/docs/reference/js/firebase.firestore.FirestoreDataConverter#tofirestore
*/
export const vendorConverter = {
  toFirestore(data: Vendor): firebase.firestore.DocumentData {
    return classToPlain(data);
  },

  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): Vendor {
    const JSONdata = snapshot.data(options)!;
    return plainToClass(Vendor, JSONdata);
  }
};

import * as firebase from "firebase/app";
import { Entries, FieldTypes } from "../utils/types";

export const vendorFormOptions = [
  {
    key: 'company_name',
    label: 'company name',
    type: FieldTypes.string,
    required: true,
  },
  {
    key: 'part',
    label: 'part',
    type: FieldTypes.selector,
    selectOptions: [
      {
        label: 'plastic',
        value: 'plastic',
      },
      {
        label: 'glass',
        value: 'glass',
      },
    ],
    required: true,
  },
  {
    key: 'address_line_1',
    label: 'address line 1',
    type: FieldTypes.string,
    required: true,
  },
  {
    key: 'address_line_2',
    label: 'address line 2',
    type: FieldTypes.string,
    required: false,
  },
  {
    key: 'city',
    label: 'city',
    type: FieldTypes.string,
    required: true,
  },
  {
    key: 'state',
    label: 'state',
    type: FieldTypes.string,
    required: true,
  },
  {
    key: 'zip_code',
    label: 'zip code',
    type: FieldTypes.number,
    required: true,
  },
];

export class Vendor {
  company_name: string;
  part: string;
  address_line_1: string;
  address_line_2: string = '';
  city: string;
  state: string;
  zip_code: number;
  constructor(data: Entries) {
    this.company_name = String(data?.company_name);
    this.part = String(data?.part);
    this.address_line_1 = String(data?.address_line_1);
    this.address_line_2 = String(data?.address_line_2 ?? '');
    this.city = String(data?.city);
    this.state = String(data?.state);
    this.zip_code = Number(data?.zip_code);
  }

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
    return { ...data };
  },

  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): Vendor {
    const JSONdata = snapshot.data(options)!;
    return new Vendor(JSONdata);
  }
};

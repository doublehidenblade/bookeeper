import * as firebase from "firebase/app";
import { Entries } from "../utils/types";

export const customerFormOptions = [
  {
    key: 'company_name',
    label: 'company name',
    type: 'string',
    required: true,
  },
  {
    key: 'first_name',
    label: 'first name',
    type: 'string',
    required: true,
  },
  {
    key: 'last_name',
    label: 'last name',
    type: 'string',
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

export class Customer {
  company_name: string;
  first_name: string;
  last_name: string;
  address_line_1: string;
  address_line_2: string = '';
  city: string;
  state: string;
  zip_code: number;
  constructor(data: Entries) {
    this.company_name = String(data?.company_name);
    this.first_name = String(data?.first_name);
    this.last_name = String(data?.last_name);
    this.address_line_1 = String(data?.address_line_1);
    this.address_line_2 = String(data?.address_line_2 ?? '');
    this.city = String(data?.city);
    this.state = String(data?.state);
    this.zip_code = Number(data?.zip_code);
  }

  getName(): string {
    return this.first_name + ' ' + this.last_name;
  }

}

export type CustomerData = {
  data: Customer,
  id: string,
}

/*
documentation:
https://firebase.google.com/docs/reference/js/firebase.firestore.FirestoreDataConverter#tofirestore
*/
export const customerConverter = {
  toFirestore(data: Customer): firebase.firestore.DocumentData {
    return { ...data };
  },

  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): Customer {
    const JSONdata = snapshot.data(options)!;
    return new Customer(JSONdata);
  }
};

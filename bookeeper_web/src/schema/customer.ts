import * as firebase from "firebase/app";
import { classToPlain, plainToClass } from 'class-transformer';

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
  constructor(
    readonly company_name: string,
    readonly first_name: string,
    readonly last_name: string,
    readonly address_line_1: string,
    readonly address_line_2: string = '',
    readonly city: string,
    readonly state: string,
    readonly zip_code: number,
  ) { }

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
    return classToPlain(data);
  },

  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): Customer {
    const JSONdata = snapshot.data(options)!;
    return plainToClass(Customer, JSONdata);
  }
};

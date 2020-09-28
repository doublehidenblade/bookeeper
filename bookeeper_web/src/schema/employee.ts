import * as firebase from "firebase/app";
import { classToPlain, plainToClass } from 'class-transformer';

export const employeeFormOptions = [
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
    key: 'salary',
    label: 'salary',
    type: 'number',
    required: true,
  },
  {
    key: 'SSN',
    label: 'SSN',
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
  {
    key: 'num_withholdings',
    label: 'number of withholdings',
    type: 'number',
    required: true,
  },
];

export class Employee {
  constructor(
    readonly first_name: string,
    readonly last_name: string,
    readonly salary: number,
    readonly SSN: number,
    readonly address_line_1: string,
    readonly address_line_2: string = '',
    readonly city: string,
    readonly state: string,
    readonly zip_code: number,
    readonly num_withholdings: number,
  ) { }

  getName(): string {
    return this.first_name + ' ' + this.last_name;
  }

}

export type EmployeeData = {
  data: Employee,
  id: string,
}

/*
documentation:
https://firebase.google.com/docs/reference/js/firebase.firestore.FirestoreDataConverter#tofirestore
*/
export const employeeConverter = {
  toFirestore(data: Employee): firebase.firestore.DocumentData {
    return classToPlain(data);
  },

  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): Employee {
    const JSONdata = snapshot.data(options)!;
    return plainToClass(Employee, JSONdata);
  }
};

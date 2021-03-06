import * as firebase from "firebase/app";
import { Entries, FieldTypes } from "../utils/types";
import { toCurrency } from "../utils/helpers";

export const employeeTableOptions = [
  {
    key: 'first_name',
    label: 'first name',
    type: FieldTypes.string,
    required: true,
  },
  {
    key: 'last_name',
    label: 'last name',
    type: FieldTypes.string,
    required: true,
  },
  {
    key: 'salary',
    label: 'salary($)',
    type: FieldTypes.currency,
    required: true,
  },
  {
    key: 'SSN',
    label: 'SSN',
    type: FieldTypes.number,
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
  {
    key: 'num_withholdings',
    label: 'withholdings number',
    type: FieldTypes.number,
    required: true,
  },
]

export const employeeFormOptions = [
  {
    key: 'first_name',
    label: 'first name',
    type: FieldTypes.string,
    required: true,
  },
  {
    key: 'last_name',
    label: 'last name',
    type: FieldTypes.string,
    required: true,
  },
  {
    key: 'salary',
    label: 'salary($)',
    type: FieldTypes.currency,
    required: true,
  },
  {
    key: 'SSN',
    label: 'SSN',
    type: FieldTypes.number,
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

export class Employee {
  first_name: string;
  last_name: string;
  salary: number;
  SSN: number;
  address_line_1: string;
  address_line_2: string = '';
  city: string;
  state: string;
  zip_code: number;
  num_withholdings: number = 0;
  constructor(data: Entries) {
    this.first_name = String(data?.first_name);
    this.last_name = String(data?.last_name);
    this.salary = toCurrency(Number(data?.salary));
    this.SSN = Number(data?.SSN);
    this.address_line_1 = String(data?.address_line_1);
    this.address_line_2 = String(data?.address_line_2 ?? '');
    this.city = String(data?.city);
    this.state = String(data?.state);
    this.zip_code = Number(data?.zip_code);
    this.num_withholdings = Number(data?.num_withholdings ?? 0);
  }

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
    return { ...data };
  },

  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): Employee {
    const JSONdata = snapshot.data(options)!;
    return new Employee(JSONdata);
  }
};

import * as firebase from "firebase/app";

export class Employee {
  constructor(
    readonly first_name: string,
    readonly last_name: string,
    readonly salary: number,
    readonly age: number = 0,
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
  toFirestore(employee: Employee): firebase.firestore.DocumentData {
    return {
      first_name: employee.first_name,
      last_name: employee.last_name,
      salary: employee.salary,
      age: employee.age,
    };
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): Employee {
    const data = snapshot.data(options)!;
    return new Employee(data.first_name, data.last_name, data.salary);
  }
};

import { Payroll, payrollConverter } from '../schema/payroll';
import { Employee, employeeConverter } from '../schema/employee';
import { WITHHOLDING_RATE } from '../utils/constants';
import * as FirestoreTypes from '@firebase/firestore-types'
import * as firebase from "firebase/app";
type Firestore = FirestoreTypes.FirebaseFirestore;

export const addEmployee = async (firestore: Firestore, data: { employee: Employee }): Promise<firebase.firestore.DocumentReference<Employee>> => {
  const employee = data.employee;
  const employeesRef = firestore.collection('employees');
  const employeeRef = await employeesRef.withConverter(employeeConverter).add(employee);
  return employeeRef;
};

export const payEmployee = async (firestore: Firestore, data: { employee_id: string, salary: number }) => {

  const employee_id = data.employee_id;
  const salary = data.salary;

  const withholding = salary * WITHHOLDING_RATE;
  const disbursement = salary * (1 - WITHHOLDING_RATE);
  const new_date = firebase.firestore.Timestamp.fromDate(new Date());

  const payroll = new Payroll(new_date, employee_id, withholding, disbursement);

  const updateVariables = firestore.runTransaction(async (t) => {
    const ref = firestore.collection("company").doc('variables');
    const doc = await t.get(ref);
    const data = doc.data();
    if (data === undefined) {
      throw new Error('no data');
    }
    t.update(ref, {
      payroll: data.payroll + disbursement,
      payroll_withholding: data.payroll_withholding + withholding,
    });
  });

  const createPayroll = new Promise(async (resolve, reject) => {
    const payrollsRef = firestore.collection('payrolls');
    const payrollRef = await payrollsRef.withConverter(payrollConverter).add(payroll);
    if (payrollRef == undefined) {
      reject(new Error('add failed'))
    }
    resolve(payrollRef);
  });

  const incrementEmployeeWitholding = firestore.runTransaction(async (t) => {
    const ref = firestore.collection("employees").doc(employee_id);
    const doc = await t.get(ref);
    const data = doc.data();
    if (data === undefined) {
      throw new Error('no data');
    }
    t.update(ref, {
      num_withholdings: data.num_withholdings + 1,
    });
  });

  await Promise.all([updateVariables, createPayroll, incrementEmployeeWitholding]);
  alert('Pay complete');
}
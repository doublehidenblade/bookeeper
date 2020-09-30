import { Payroll, payrollConverter } from '../schema/payroll';
import { Employee, employeeConverter } from '../schema/employee';
import { Vendor, vendorConverter } from '../schema/vendor';
import { Purchase, purchaseConverter } from '../schema/purchase';


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

export const addVendor = async (firestore: Firestore, data: { vendor: Vendor }): Promise<firebase.firestore.DocumentReference<Vendor>> => {
  const vendor = data.vendor;
  const vendorsRef = firestore.collection('vendors');
  const vendorRef = await vendorsRef.withConverter(vendorConverter).add(vendor);
  return vendorRef;
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
      cash: data.cash + salary,
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
  return true;
}

export const makePurchase = async (firestore: Firestore, data: {
  vendor_id: string,
  part: string,
  quantity: number,
  price_per_part: number,
}) => {
  const { vendor_id, part, quantity, price_per_part } = data;
  if (quantity <= 0) {
    alert('invalid quantity');
    return;
  }
  const payment = quantity * price_per_part;
  const new_date = firebase.firestore.Timestamp.fromDate(new Date());

  const purchase = new Purchase(new_date, vendor_id, quantity, price_per_part);

  const incrementPartQuantity = firestore.runTransaction(async (t) => {
    const ref = firestore.collection("parts").doc(part);
    const doc = await t.get(ref);
    const data = doc.data();
    if (data === undefined) {
      throw new Error('no data');
    }
    t.update(ref, {
      quantity: data.quantity + quantity,
    });
  });

  const createPurchase = new Promise(async (resolve, reject) => {
    const purchasesRef = firestore.collection('purchases');
    const purchaseRef = await purchasesRef.withConverter(purchaseConverter).add(purchase);
    if (purchaseRef == undefined) {
      reject(new Error('add failed'))
    }
    resolve(purchaseRef);
  });

  const updateVariables = firestore.runTransaction(async (t) => {
    const ref = firestore.collection("company").doc('variables');
    const doc = await t.get(ref);
    const data = doc.data();
    if (data === undefined) {
      throw new Error('no data');
    }
    t.update(ref, {
      accounts_payable: data.accounts_payable + payment,
      inventory: data.inventory + payment,
    });
  });

  const result = await Promise.all([updateVariables, incrementPartQuantity, createPurchase]);
  console.log('result: ', result);
  alert('Purchase complete');
  return true;
}
import { Payroll, payrollConverter } from '../schema/payroll';
import { Invoice, invoiceConverter } from '../schema/invoice';
import { Employee, employeeConverter } from '../schema/employee';
import { Vendor, vendorConverter } from '../schema/vendor';
import { Customer, customerConverter } from '../schema/customer';
import { Purchase, purchaseConverter } from '../schema/purchase';
import { WITHHOLDING_RATE, PARTS_NEEDED, PARTS_PER_UNIT, PRICE_PER_PART, COST_PER_UNIT } from '../utils/constants';
import { arrMin } from '../utils/helpers';
import * as FirestoreTypes from '@firebase/firestore-types'
import * as firebase from "firebase/app";
type Firestore = FirestoreTypes.FirebaseFirestore;

export const addEmployee = async (firestore: Firestore, employee: Employee): Promise<firebase.firestore.DocumentReference<Employee>> => {
  const employeesRef = firestore.collection('employees');
  const employeeRef = await employeesRef.withConverter(employeeConverter).add(employee);
  return employeeRef;
};

export const addVendor = async (firestore: Firestore, vendor: Vendor): Promise<firebase.firestore.DocumentReference<Vendor>> => {
  const vendorsRef = firestore.collection('vendors');
  const vendorRef = await vendorsRef.withConverter(vendorConverter).add(vendor);
  return vendorRef;
};

export const addCustomer = async (firestore: Firestore, customer: Customer): Promise<firebase.firestore.DocumentReference<Customer>> => {
  const customersRef = firestore.collection('customers');
  const customerRef = await customersRef.withConverter(customerConverter).add(customer);
  return customerRef;
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

  const result = await Promise.all([updateVariables, createPayroll, incrementEmployeeWitholding]);
  alert('Pay complete');
  return result;
}

export const makePurchase = async (firestore: Firestore, data: {
  vendor_id: string,
  part: string,
  quantity: number,
}) => {
  const { vendor_id, part, quantity } = data;
  if (quantity <= 0) {
    alert('invalid quantity');
    return;
  }
  const price_per_part = PRICE_PER_PART[part];
  const payment = quantity * price_per_part;
  const new_date = firebase.firestore.Timestamp.fromDate(new Date());

  const purchase = new Purchase(new_date, vendor_id, quantity);

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
  alert('Purchase complete');
  return result;
}

export const getAvailableUnitQuantity = async (firestore: Firestore): Promise<number> => {
  const max_units_by_part = await Promise.all(PARTS_NEEDED.map(async part => {
    const part_snapshot = await firestore.collection("parts").doc(part).get();
    const quantity_of_part: number = (part_snapshot.data())?.quantity ?? 0;
    return Math.floor(quantity_of_part / PARTS_PER_UNIT[part]);
  }));
  return arrMin(max_units_by_part);
}

export const makeInvoice = async (firestore: Firestore, data: {
  customer_id: string,
  quantity: number,
  available_quantity: number
  price: number,
}) => {
  const { customer_id, quantity, available_quantity, price } = data;
  if (quantity > available_quantity || quantity <= 0) {
    alert('invalid quantity');
    return;
  }
  const new_date = firebase.firestore.Timestamp.fromDate(new Date());

  const invoice = new Invoice(new_date, customer_id, quantity);

  const decrementPartQuantity = async (part: string) => {
    await firestore.runTransaction(async (t) => {
      const ref = firestore.collection("parts").doc(part);
      const doc = await t.get(ref);
      const data = doc.data();
      if (data === undefined) {
        throw new Error('no data');
      }
      t.update(ref, {
        quantity: data.quantity - quantity * PARTS_PER_UNIT[part],
      });
    });
  }

  const decrementPartsQuantity = Promise.all(PARTS_NEEDED.map(part => decrementPartQuantity(part)))

  const createInvoice = new Promise(async (resolve, reject) => {
    const invoicesRef = firestore.collection('invoices');
    const invoiceRef = await invoicesRef.withConverter(invoiceConverter).add(invoice);
    if (invoiceRef == undefined) {
      reject(new Error('add failed'))
    }
    resolve(invoiceRef);
  });

  const updateVariables = firestore.runTransaction(async (t) => {
    const ref = firestore.collection("company").doc('variables');
    const doc = await t.get(ref);
    const data = doc.data();
    if (data === undefined) {
      throw new Error('no data');
    }
    t.update(ref, {
      sales: data.sales + price * quantity,
      accounts_receivable: data.accounts_receivable + price * quantity,
      inventory: data.inventory - COST_PER_UNIT * quantity,
    });
  });

  const result = await Promise.all([updateVariables, decrementPartsQuantity, createInvoice]);
  alert('Invoice complete');
  return result;
}
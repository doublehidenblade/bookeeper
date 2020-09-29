
// handles data fetching, data computation, callback definition
import 'firebase/storage';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import PayrollsComponent from './PayrollsComponent';
import { Payroll, PayrollData, payrollConverter } from '../../schema/payroll';
import { PayrollTableData } from "./PayrollsComponent";
import { employeeConverter, Employee } from '../../schema/employee';
import { firebaseTimestampToDateString } from '../../utils/helpers';

export default function PayrollsDataContainer() {
  const firestore = useFirestore();
  useFirebase();
  const [payrollsData, setPayrollsData] = useState<PayrollData[]>([]);
  const [payrollsTableData, setPayrollsTableData] = useState<PayrollTableData[]>([]);

  const payrollsTableDataPromise: Promise<PayrollTableData[]> = useMemo(async () => {
    return Promise.all(payrollsData.map(async (payrollData: PayrollData) => {
      const employeeSnapshot = await firestore.collection('employees').withConverter(employeeConverter).doc(payrollData.data.employee_id).get();
      const employeeData: Employee | undefined = employeeSnapshot.data();
      const employeeName = employeeData ? (employeeData.first_name + ' ' + employeeData.last_name) : null;
      const employeeSalary = employeeData?.salary;
      const result: PayrollTableData = {
        employee_name: employeeName,
        date: firebaseTimestampToDateString(payrollData.data.date),
        salary: employeeSalary,
        disbursement: payrollData.data.disbursement,
        withholding: payrollData.data.withholding,
      }
      return result;
    }))
  }, [firestore, payrollsData])

  payrollsTableDataPromise.then(payrollsTableData => setPayrollsTableData(payrollsTableData));

  const handleSnapshot = (snapshot: firebase.firestore.QuerySnapshot<Payroll>): void => {
    const loaded: PayrollData[] = [];
    snapshot.forEach(doc => {
      loaded.push({
        data: doc.data(),
        id: doc.id
      });
    });
    setPayrollsData(loaded);
  }

  const getPayrolls = useCallback(async () => {
    const ref = firestore.collection('payrolls');
    ref.withConverter(payrollConverter).get().then(handleSnapshot);
  }, [firestore]);

  const listenForPayrollsChange = useCallback(() => {
    const payrollsRef = firestore.collection('payrolls').withConverter(payrollConverter);
    payrollsRef.onSnapshot(handleSnapshot);
  }, [firestore]);


  useEffect(() => {
    getPayrolls();
    listenForPayrollsChange();
  }, [getPayrolls, listenForPayrollsChange]);

  return <PayrollsComponent payrollsTableData={payrollsTableData} />;
}
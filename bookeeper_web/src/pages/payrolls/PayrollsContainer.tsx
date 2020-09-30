
// handles data fetching, data computation, callback definition
import 'firebase/storage';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import PayrollsComponent from './PayrollsComponent';
import { Payroll, PayrollData, PayrollTableData, payrollConverter } from '../../schema/payroll';
import { employeeConverter, Employee } from '../../schema/employee';
import { firebaseTimestampToDateString } from '../../utils/helpers';
import { LoadState } from '../../utils/types';

export default function PayrollsDataContainer() {
  const firestore = useFirestore();
  useFirebase();
  const [payrollsData, setPayrollsData] = useState<PayrollData[]>([]);
  const [payrollsTableData, setPayrollsTableData] = useState<PayrollTableData[]>([]);
  const [dataLoadState, setDataLoadState] = useState<LoadState>(LoadState.loading)

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

  const payrollsRef = useMemo(() => firestore.collection('payrolls').withConverter(payrollConverter).orderBy('date', 'desc'), [firestore]);

  const getPayrolls = useCallback(async () => {
    setDataLoadState(LoadState.loading);
    await payrollsRef.get().then(handleSnapshot)
      .catch(() => setDataLoadState(LoadState.error))
      .then(() => setDataLoadState(LoadState.loaded))
  }, [payrollsRef]);

  const listenForPayrollsChange = useCallback(() => {
    return payrollsRef.onSnapshot(handleSnapshot);
  }, [payrollsRef]);


  useEffect(() => {
    getPayrolls();
    return listenForPayrollsChange();
  }, [getPayrolls, listenForPayrollsChange]);

  return <PayrollsComponent payrollsTableData={payrollsTableData} dataLoadState={dataLoadState} />;
}
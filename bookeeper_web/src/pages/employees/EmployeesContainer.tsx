
// handles data fetching, data computation, callback definition
import 'firebase/storage';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import EmployeesComponent from './EmployeesComponent';
import { Employee, EmployeeData, employeeConverter } from '../../schema/employee';
import { LoadState } from '../../utils/types';

export default function EmployeesDataContainer() {
  const firestore = useFirestore();
  useFirebase();
  const [employeesData, setEmployeesData] = useState<EmployeeData[]>([]);
  const [dataLoadState, setDataLoadState] = useState<LoadState>(LoadState.loading)

  const handleSnapshot = (snapshot: firebase.firestore.QuerySnapshot<Employee>): void => {
    const loaded: EmployeeData[] = [];
    snapshot.forEach(doc => {
      loaded.push({
        data: doc.data(),
        id: doc.id
      });
    });
    setEmployeesData(loaded);
  }

  const employeesRef = useMemo(() => firestore.collection('employees').withConverter(employeeConverter).orderBy('first_name', 'asc'), [firestore]);

  const getEmployees = useCallback(async () => {
    setDataLoadState(LoadState.loading);
    await employeesRef.get().then(handleSnapshot)
      .catch(() => setDataLoadState(LoadState.error))
      .then(() => setDataLoadState(LoadState.loaded))
  }, [employeesRef]);

  const listenForEmployeesChange = useCallback(() => {
    return employeesRef.onSnapshot(handleSnapshot);
  }, [employeesRef]);


  useEffect(() => {
    getEmployees();
    return listenForEmployeesChange();
  }, [getEmployees, listenForEmployeesChange]);

  return <EmployeesComponent employeesData={employeesData} dataLoadState={dataLoadState} />;
}
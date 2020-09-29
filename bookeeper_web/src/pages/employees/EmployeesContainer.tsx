
// handles data fetching, data computation, callback definition
import 'firebase/storage';
import React, { useEffect, useState, useCallback } from 'react';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import EmployeesComponent from './EmployeesComponent';
import { Employee, EmployeeData, employeeConverter } from '../../schema/employee';

export default function EmployeesDataContainer() {
  const firestore = useFirestore();
  useFirebase();
  const [employeesData, setEmployeesData] = useState<EmployeeData[]>([]);

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

  const getEmployees = useCallback(async () => {
    const ref = firestore.collection('employees');
    ref.withConverter(employeeConverter).get().then(handleSnapshot);
  }, [firestore]);

  const listenForEmployeesChange = useCallback(() => {
    const employeesRef = firestore.collection('employees').withConverter(employeeConverter);
    employeesRef.onSnapshot(handleSnapshot);
  }, [firestore]);


  useEffect(() => {
    getEmployees();
    listenForEmployeesChange();
  }, [getEmployees, listenForEmployeesChange]);

  const addEmployee = async (employee: Employee) => {
    const employeesRef = firestore.collection('employees');
    const employeeRef = await employeesRef.withConverter(employeeConverter).add(employee);
    return employeeRef;
  };

  return <EmployeesComponent employeesData={employeesData} addEmployee={addEmployee} />;
}
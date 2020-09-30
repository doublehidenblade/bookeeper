
// handles data fetching, data computation, callback definition
import 'firebase/storage';
import React, { useEffect, useState, useCallback } from 'react';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import CustomersComponent from './CustomersComponent';
import { Customer, CustomerData, customerConverter } from '../../schema/customer';

export default function CustomersDataContainer() {
  const firestore = useFirestore();
  useFirebase();
  const [customersData, setCustomersData] = useState<CustomerData[]>([]);

  const handleSnapshot = (snapshot: firebase.firestore.QuerySnapshot<Customer>): void => {
    const loaded: CustomerData[] = [];
    snapshot.forEach(doc => {
      loaded.push({
        data: doc.data(),
        id: doc.id
      });
    });
    setCustomersData(loaded);
  }

  const getCustomers = useCallback(async () => {
    const ref = firestore.collection('customers');
    ref.withConverter(customerConverter).get().then(handleSnapshot);
  }, [firestore]);

  const listenForCustomersChange = useCallback(() => {
    const customersRef = firestore.collection('customers').withConverter(customerConverter);
    customersRef.onSnapshot(handleSnapshot);
  }, [firestore]);


  useEffect(() => {
    getCustomers();
    listenForCustomersChange();
  }, [getCustomers, listenForCustomersChange]);

  return <CustomersComponent customersData={customersData} />;
}
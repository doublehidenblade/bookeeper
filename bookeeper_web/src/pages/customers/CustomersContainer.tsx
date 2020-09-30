
// handles data fetching, data computation, callback definition
import 'firebase/storage';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import CustomersComponent from './CustomersComponent';
import { Customer, CustomerData, customerConverter } from '../../schema/customer';
import { LoadState } from '../../utils/types'

export default function CustomersDataContainer() {
  const firestore = useFirestore();
  useFirebase();
  const [customersData, setCustomersData] = useState<CustomerData[]>([]);
  const [dataLoadState, setDataLoadState] = useState<LoadState>(LoadState.loading)

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

  const customersRef = useMemo(() => firestore.collection('customers').withConverter(customerConverter).orderBy('company_name', 'asc'), [firestore]);

  const getCustomers = useCallback(async () => {
    setDataLoadState(LoadState.loading);
    await customersRef.get().then(handleSnapshot)
      .catch(() => setDataLoadState(LoadState.error))
      .then(() => setDataLoadState(LoadState.loaded))
  }, [customersRef]);

  const listenForCustomersChange = useCallback(() => {
    return customersRef.onSnapshot(handleSnapshot);
  }, [customersRef]);


  useEffect(() => {
    getCustomers();
    return listenForCustomersChange();
  }, [getCustomers, listenForCustomersChange]);

  return <CustomersComponent customersData={customersData} dataLoadState={dataLoadState} />;
}
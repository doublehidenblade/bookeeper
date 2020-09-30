// handles data fetching, data computation, callback definition
import 'firebase/storage';
import React, { useEffect, useState, useCallback } from 'react';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import VendorsComponent from './VendorsComponent';
import { Vendor, VendorData, vendorConverter } from '../../schema/vendor';

export default function VendorsDataContainer() {
  const firestore = useFirestore();
  useFirebase();
  const [vendorsData, setVendorsData] = useState<VendorData[]>([]);

  const handleSnapshot = (snapshot: firebase.firestore.QuerySnapshot<Vendor>): void => {
    const loaded: VendorData[] = [];
    snapshot.forEach(doc => {
      loaded.push({
        data: doc.data(),
        id: doc.id
      });
    });
    setVendorsData(loaded);
  }

  const getVendors = useCallback(async () => {
    const ref = firestore.collection('vendors');
    ref.withConverter(vendorConverter).get().then(handleSnapshot);
  }, [firestore]);

  const listenForVendorsChange = useCallback(() => {
    const vendorsRef = firestore.collection('vendors').withConverter(vendorConverter);
    vendorsRef.onSnapshot(handleSnapshot);
  }, [firestore]);


  useEffect(() => {
    getVendors();
    listenForVendorsChange();
  }, [getVendors, listenForVendorsChange]);

  return <VendorsComponent vendorsData={vendorsData} />;
}
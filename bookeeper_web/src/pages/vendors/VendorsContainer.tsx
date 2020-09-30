// handles data fetching, data computation, callback definition
import 'firebase/storage';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import VendorsComponent from './VendorsComponent';
import { Vendor, VendorData, vendorConverter } from '../../schema/vendor';
import { LoadState } from '../../utils/types';

export default function VendorsDataContainer() {
  const firestore = useFirestore();
  useFirebase();
  const [vendorsData, setVendorsData] = useState<VendorData[]>([]);
  const [dataLoadState, setDataLoadState] = useState<LoadState>(LoadState.loading)

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

  const vendorsRef = useMemo(() => firestore.collection('vendors').withConverter(vendorConverter).orderBy('company_name', 'asc'), [firestore]);

  const getVendors = useCallback(async () => {
    setDataLoadState(LoadState.loading);
    vendorsRef.get()
      .then(handleSnapshot)
      .then(() => setDataLoadState(LoadState.loaded))
      .catch(() => setDataLoadState(LoadState.error));
  }, [vendorsRef]);

  const listenForVendorsChange = useCallback(() => {
    return vendorsRef.onSnapshot(handleSnapshot);
  }, [vendorsRef]);


  useEffect(() => {
    getVendors();
    return listenForVendorsChange();
  }, [getVendors, listenForVendorsChange]);

  return <VendorsComponent vendorsData={vendorsData} dataLoadState={dataLoadState} />;
}
// handles data fetching, data computation, callback definition
import 'firebase/storage';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import PurchasesComponent from './PurchasesComponent';
import { Purchase, PurchaseData, PurchaseTableData, purchaseConverter } from '../../schema/purchase';
import { vendorConverter, Vendor } from '../../schema/vendor';
import { firebaseTimestampToDateString, toInteger } from '../../utils/helpers';
import { PRICE_PER_PART } from '../../utils/constants';
import { LoadState } from '../../utils/types';

export default function PurchasesDataContainer() {
  const firestore = useFirestore();
  useFirebase();
  const [purchasesData, setPurchasesData] = useState<PurchaseData[]>([]);
  const [purchasesTableData, setPurchasesTableData] = useState<PurchaseTableData[]>([]);
  const [dataLoadState, setDataLoadState] = useState<LoadState>(LoadState.loading)

  const purchasesTableDataPromise: Promise<PurchaseTableData[]> = useMemo(async () => {
    return Promise.all(purchasesData.map(async (purchaseData: PurchaseData) => {
      const vendorSnapshot = await firestore.collection('vendors').withConverter(vendorConverter).doc(purchaseData.data.company_id).get();
      const vendorData: Vendor | undefined = vendorSnapshot.data();
      const vendorName = vendorData ? vendorData.company_name : null;
      const vendorPart = vendorData ? vendorData.part : null;
      const price_per_part = vendorPart ? PRICE_PER_PART[vendorPart] : null;
      const total = price_per_part ? toInteger(purchaseData.data.quantity) * price_per_part : null;
      const result: PurchaseTableData = {
        company_name: vendorName,
        part: vendorPart,
        date: firebaseTimestampToDateString(purchaseData.data.date),
        price_per_part: price_per_part,
        quantity: toInteger(purchaseData.data.quantity),
        total: total,
      }
      return result;
    }))
  }, [firestore, purchasesData])

  purchasesTableDataPromise.then(purchasesTableData => setPurchasesTableData(purchasesTableData));

  const handleSnapshot = (snapshot: firebase.firestore.QuerySnapshot<Purchase>): void => {
    const loaded: PurchaseData[] = [];
    snapshot.forEach(doc => {
      loaded.push({
        data: doc.data(),
        id: doc.id
      });
    });
    setPurchasesData(loaded);
  }

  const purchasesRef = useMemo(() => firestore.collection('purchases').withConverter(purchaseConverter).orderBy('date', 'desc'), [firestore]);

  const getPurchases = useCallback(async () => {
    setDataLoadState(LoadState.loading);
    await purchasesRef.get()
      .then(handleSnapshot)
      .catch(() => setDataLoadState(LoadState.error))
      .then(() => setDataLoadState(LoadState.loaded))
  }, [purchasesRef]);

  const listenForPurchasesChange = useCallback(() => {
    return purchasesRef.onSnapshot(handleSnapshot);
  }, [purchasesRef]);


  useEffect(() => {
    getPurchases();
    return listenForPurchasesChange();
  }, [getPurchases, listenForPurchasesChange]);

  return <PurchasesComponent purchasesTableData={purchasesTableData} dataLoadState={dataLoadState} />;
}
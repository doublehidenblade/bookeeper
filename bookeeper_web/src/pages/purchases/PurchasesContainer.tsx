// handles data fetching, data computation, callback definition
import 'firebase/storage';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import PurchasesComponent from './PurchasesComponent';
import { Purchase, PurchaseData, PurchaseTableData, purchaseConverter } from '../../schema/purchase';
import { vendorConverter, Vendor } from '../../schema/vendor';
import { firebaseTimestampToDateString } from '../../utils/helpers';
import { PRICE_PER_PART } from '../../utils/constants';

export default function PurchasesDataContainer() {
  const firestore = useFirestore();
  useFirebase();
  const [purchasesData, setPurchasesData] = useState<PurchaseData[]>([]);
  const [purchasesTableData, setPurchasesTableData] = useState<PurchaseTableData[]>([]);

  const purchasesTableDataPromise: Promise<PurchaseTableData[]> = useMemo(async () => {
    return Promise.all(purchasesData.map(async (purchaseData: PurchaseData) => {
      const vendorSnapshot = await firestore.collection('vendors').withConverter(vendorConverter).doc(purchaseData.data.company_id).get();
      const vendorData: Vendor | undefined = vendorSnapshot.data();
      const vendorName = vendorData ? vendorData.company_name : null;
      const vendorPart = vendorData ? vendorData.part : null;
      const price_per_part = vendorPart ? PRICE_PER_PART[vendorPart] : null;
      const total = price_per_part ? purchaseData.data.quantity * price_per_part : null;
      const result: PurchaseTableData = {
        company_name: vendorName,
        part: vendorPart,
        date: firebaseTimestampToDateString(purchaseData.data.date),
        price_per_part: price_per_part,
        quantity: purchaseData.data.quantity,
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

  const getPurchases = useCallback(async () => {
    const ref = firestore.collection('purchases');
    ref.withConverter(purchaseConverter).get().then(handleSnapshot);
  }, [firestore]);

  const listenForPurchasesChange = useCallback(() => {
    const purchasesRef = firestore.collection('purchases').withConverter(purchaseConverter);
    purchasesRef.onSnapshot(handleSnapshot);
  }, [firestore]);


  useEffect(() => {
    getPurchases();
    listenForPurchasesChange();
  }, [getPurchases, listenForPurchasesChange]);

  return <PurchasesComponent purchasesTableData={purchasesTableData} />;
}
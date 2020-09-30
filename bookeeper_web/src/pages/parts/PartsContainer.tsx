// handles data fetching, data computation, callback definition
import 'firebase/storage';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import PartsComponent from './PartsComponent';
import { Part, PartData, partConverter } from '../../schema/part';
import { PartTableData } from '../../schema/part';

export default function PartsDataContainer() {
  const firestore = useFirestore();
  useFirebase();
  const [partsData, setPartsData] = useState<PartData[]>([]);
  const partsTableData: PartTableData[] = useMemo(() => {
    return partsData.map(partData => ({
      company_name: partData.data.company_name,
      part: partData.data.name,
      price_per_part: partData.data.price_per_part,
      quantity: partData.data.quantity,
      total: partData.data.quantity * partData.data.price_per_part,
      is_reorder: partData.data.is_reorder ? 'yes' : null
    }))
  }, [partsData]);

  const handleSnapshot = (snapshot: firebase.firestore.QuerySnapshot<Part>): void => {
    const loaded: PartData[] = [];
    snapshot.forEach(doc => {
      loaded.push({
        data: doc.data(),
        id: doc.id
      });
    });
    setPartsData(loaded);
  }

  const getParts = useCallback(async () => {
    const ref = firestore.collection('parts');
    ref.withConverter(partConverter).get().then(handleSnapshot);
  }, [firestore]);

  const listenForPartsChange = useCallback(() => {
    const partsRef = firestore.collection('parts').withConverter(partConverter);
    partsRef.onSnapshot(handleSnapshot);
  }, [firestore]);

  useEffect(() => {
    getParts();
    listenForPartsChange();
  }, [getParts, listenForPartsChange]);

  return <PartsComponent partsTableData={partsTableData} />;
}
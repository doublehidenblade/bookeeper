// handles data fetching, data computation, callback definition
import 'firebase/storage';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import PartsComponent from './PartsComponent';
import { Part, PartData, partConverter } from '../../schema/part';
import { PartTableData } from '../../schema/part';
import { PRICE_PER_PART } from '../../utils/constants'
import { LoadState } from '../../utils/types';
import { toCurrency, toInteger } from '../../utils/helpers';

export default function PartsDataContainer() {
  const firestore = useFirestore();
  useFirebase();
  const [partsData, setPartsData] = useState<PartData[]>([]);
  const [dataLoadState, setDataLoadState] = useState<LoadState>(LoadState.loading)

  const partsTableData: PartTableData[] = useMemo(() => {
    return partsData.map(partData => ({
      company_name: partData.data.company_name,
      part: partData.data.name,
      price_per_part: PRICE_PER_PART[partData.data.name],
      quantity: toInteger(partData.data.quantity),
      total: toCurrency(toInteger(partData.data.quantity) * PRICE_PER_PART[partData.data.name]),
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

  const partsRef = useMemo(() => firestore.collection('parts').withConverter(partConverter), [firestore]);

  const getParts = useCallback(async () => {
    setDataLoadState(LoadState.loading);
    await partsRef.get().then(handleSnapshot)
      .catch(() => setDataLoadState(LoadState.error))
      .then(() => setDataLoadState(LoadState.loaded))
  }, [partsRef]);

  const listenForPartsChange = useCallback(() => {
    return partsRef.onSnapshot(handleSnapshot);
  }, [partsRef]);

  useEffect(() => {
    getParts();
    return listenForPartsChange();
  }, [getParts, listenForPartsChange]);

  return <PartsComponent partsTableData={partsTableData} dataLoadState={dataLoadState} />;
}
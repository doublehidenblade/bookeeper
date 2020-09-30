// handles data fetching, data computation, callback definition
import 'firebase/storage';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import InvoicesComponent from './InvoicesComponent';
import { Invoice, InvoiceData, InvoiceTableData, invoiceConverter } from '../../schema/invoice';
import { customerConverter, Customer } from '../../schema/customer';
import { firebaseTimestampToDateString } from '../../utils/helpers';
import { PRICE } from '../../utils/constants';
import { LoadState } from '../../utils/types';

export default function InvoicesDataContainer() {
  const firestore = useFirestore();
  useFirebase();
  const [invoicesData, setInvoicesData] = useState<InvoiceData[]>([]);
  const [invoicesTableData, setInvoicesTableData] = useState<InvoiceTableData[]>([]);
  const [dataLoadState, setDataLoadState] = useState<LoadState>(LoadState.loading)

  const invoicesTableDataPromise: Promise<InvoiceTableData[]> = useMemo(async () => {
    return Promise.all(invoicesData.map(async (invoiceData: InvoiceData) => {
      const customerSnapshot = await firestore.collection('customers').withConverter(customerConverter).doc(invoiceData.data.customer_id).get();
      const customerData: Customer | undefined = customerSnapshot.data();
      const customerName = customerData ? customerData.company_name : null;
      const total = invoiceData.data.quantity * PRICE;
      const result: InvoiceTableData = {
        customer_name: customerName,
        date: firebaseTimestampToDateString(invoiceData.data.date),
        quantity: invoiceData.data.quantity,
        price: PRICE,
        total: total,
      }
      return result;
    }))
  }, [firestore, invoicesData])

  invoicesTableDataPromise.then(invoicesTableData => setInvoicesTableData(invoicesTableData));

  const handleSnapshot = (snapshot: firebase.firestore.QuerySnapshot<Invoice>): void => {
    const loaded: InvoiceData[] = [];
    snapshot.forEach(doc => {
      loaded.push({
        data: doc.data(),
        id: doc.id
      });
    });
    setInvoicesData(loaded);
  }

  const invoicesRef = useMemo(() => firestore.collection('invoices').withConverter(invoiceConverter).orderBy('date', 'desc'), [firestore]);

  const getInvoices = useCallback(async () => {
    setDataLoadState(LoadState.loading);
    await invoicesRef.get().then(handleSnapshot)
      .catch(() => setDataLoadState(LoadState.error))
      .then(() => setDataLoadState(LoadState.loaded))
  }, [invoicesRef]);

  const listenForInvoicesChange = useCallback(() => {
    return invoicesRef.onSnapshot(handleSnapshot);
  }, [invoicesRef]);


  useEffect(() => {
    getInvoices();
    return listenForInvoicesChange();
  }, [getInvoices, listenForInvoicesChange]);

  return <InvoicesComponent invoicesTableData={invoicesTableData} dataLoadState={dataLoadState} />;
}
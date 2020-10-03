
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect, useCallback } from 'react';
import { CustomerData, customerFormOptions, Customer } from '../../schema/customer';
import { addCustomer, makeInvoice, getAvailableUnitQuantity } from '../../utils/functions';
import Form from '../common/Form';
import { useFirestore } from 'react-redux-firebase';
import Table from '../common/Table'
import { PRICE } from '../../utils/constants'
import { partConverter } from '../../schema/part';
import { LoadState, Entries } from '../../utils/types';
import LazyComponent from '../common/LazyComponent';

interface Props {
  customersData: CustomerData[],
  dataLoadState: LoadState
}

// 2. style using Materail-UI
const useStyles = makeStyles(() => ({
  card: {
  },
}));

// 3. export the component
export default function CustomersComponent(props: Props) {
  const classes = useStyles();
  const firestore = useFirestore();
  const { customersData, dataLoadState } = props;
  const [availableQuantity, setAvailableQuantity] = useState(0);

  const getAvailableQuantity = useCallback(() => getAvailableUnitQuantity(firestore).then(result => setAvailableQuantity(result)), [firestore]);

  const listenForPartsChange = useCallback(() => {
    const partsRef = firestore.collection('parts').withConverter(partConverter);
    return partsRef.onSnapshot(() => {
      getAvailableQuantity();
    });
  }, [firestore, getAvailableQuantity]);

  useEffect(() => {
    getAvailableQuantity();
    return listenForPartsChange();
  }, [firestore, getAvailableQuantity, listenForPartsChange]);

  const invoiceOptions = [
    {
      key: 'quantity',
      label: 'quantity',
      type: 'integer',
      required: true,
    },
  ];

  return (<>
    <Form
      action="add customer"
      title="add customer"
      options={customerFormOptions}
      onSubmit={formData => addCustomer(firestore, new Customer(formData))}
    />
    <div className={classes.card}>
      <LazyComponent dataLoadState={dataLoadState} >
        <Table
          headerData={
            [...customerFormOptions.map(option => option.label), 'action']
          }
          data={
            customersData.map((customer: CustomerData, id: number) => {
              const button = (
                <Form
                  key={id}
                  action="invoice"
                  title="invoice"
                  options={invoiceOptions}
                  onSubmit={(data: Entries) => makeInvoice(firestore, {
                    customer_id: customer.id,
                    quantity: data.quantity,
                    available_quantity: availableQuantity,
                    price: PRICE,
                  })}
                  text={"Available quantity: " + availableQuantity + ", price/unit: $" + PRICE}
                />);
              return (
                [...customerFormOptions.map(option => customer.data[option.key]), button]
              )
            })
          }
        />
      </LazyComponent>
    </div>
  </>);
}
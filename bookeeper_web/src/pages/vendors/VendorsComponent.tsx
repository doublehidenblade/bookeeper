
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { VendorData, vendorFormOptions, Vendor } from '../../schema/vendor';
import { addVendor, makePurchase } from '../../utils/functions';
import Form from '../common/Form';
import { useFirestore } from 'react-redux-firebase';
import Table from '../common/Table'
import { LoadState, Entries } from '../../utils/types';
import LazyComponent from '../common/LazyComponent';
import Title from '../common/Title';

interface Props {
  vendorsData: VendorData[],
  dataLoadState: LoadState,
}

// 2. style using Materail-UI
const useStyles = makeStyles(() => ({
  card: {
  },
}));

const purchaseOptions = [
  {
    key: 'quantity',
    label: 'quantity',
    type: 'number',
    required: true,
  },
]
// 3. export the component
export default function VendorsComponent(props: Props) {
  const classes = useStyles();
  const firestore = useFirestore();
  const { vendorsData, dataLoadState } = props;

  return (<>
    <Form
      action="add vendor"
      title="add vendor"
      options={vendorFormOptions}
      onSubmit={formData => addVendor(firestore, new Vendor(formData))}
    />
    <div className={classes.card}>
      <Title content="Vendors" />
      <LazyComponent dataLoadState={dataLoadState}>
        <Table
          headerData={
            [...vendorFormOptions.map(option => option.label), 'action']
          }
          data={
            vendorsData.map((vendor: VendorData, id: number) => {
              const button = (
                <Form
                  key={id}
                  action="purchase"
                  title="purchase"
                  options={purchaseOptions}
                  onSubmit={(data: Entries) => makePurchase(firestore, {
                    vendor_id: vendor.id,
                    part: vendor.data.part,
                    quantity: data.quantity,
                  })}
                />);
              return (
                [...vendorFormOptions.map(option => vendor.data[option.key]), button]
              )
            })
          }
        />
      </LazyComponent>
    </div>
  </>);
}
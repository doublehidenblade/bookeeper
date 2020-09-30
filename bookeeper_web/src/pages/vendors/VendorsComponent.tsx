
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { VendorData, vendorFormOptions } from '../../schema/vendor';
import { addVendor, makePurchase } from '../../utils/functions';
import Form from '../common/Form';
import { useFirestore } from 'react-redux-firebase';
import Table from '../common/Table'

interface Props {
  vendorsData: VendorData[],
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
  const { vendorsData } = props;

  return (<>
    <Form
      action="add vendor"
      title="add vendor"
      options={vendorFormOptions}
      onSubmit={(data) => addVendor(firestore, data)}
    />
    <div className={classes.card}>
      <Table
        headerData={
          vendorFormOptions.map(option => option.label)
        }
        data={
          vendorsData.map((vendor: VendorData, id: number) => {
            const button = (
              <Form
                key={id}
                action="purchase"
                title="purchase"
                options={purchaseOptions}
                onSubmit={(data: { quantity: number }) => makePurchase(firestore, {
                  vendor_id: vendor.id,
                  part: vendor.data.part,
                  quantity: data.quantity,
                  price_per_part: vendor.data.price_per_part,
                })}
              />);
            return (
              [...vendorFormOptions.map(option => vendor.data[option.key]), button]
            )
          })
        }
      />
    </div>
  </>);
}
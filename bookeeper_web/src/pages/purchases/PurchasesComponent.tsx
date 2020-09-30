import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { purchaseTableOptions, PurchaseTableData } from '../../schema/purchase';
import Table from '../common/Table'

interface Props {
  purchasesTableData: PurchaseTableData[],
}

// 2. style using Materail-UI
const useStyles = makeStyles(() => ({
  card: {
  },
}));

// 3. export the component
export default function PurchasesComponent(props: Props) {
  const classes = useStyles();
  const { purchasesTableData } = props;

  return (<>
    <div className={classes.card}>
      <Table
        headerData={
          purchaseTableOptions.map(option => option.label)
        }
        data={
          purchasesTableData.map((purchase: PurchaseTableData) => {
            return (
              purchaseTableOptions.map(option => purchase[option.key])
            )
          })
        }
      />
    </div>
  </>);
}
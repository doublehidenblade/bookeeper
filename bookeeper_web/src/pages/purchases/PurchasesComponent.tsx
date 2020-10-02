import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { purchaseTableOptions, PurchaseTableData } from '../../schema/purchase';
import Table from '../common/Table'
import { LoadState } from '../../utils/types';
import LazyComponent from '../common/LazyComponent';
import Title from '../common/Title';

interface Props {
  purchasesTableData: PurchaseTableData[],
  dataLoadState: LoadState,
}

// 2. style using Materail-UI
const useStyles = makeStyles(() => ({
  card: {
  },
}));

// 3. export the component
export default function PurchasesComponent(props: Props) {
  const classes = useStyles();
  const { purchasesTableData, dataLoadState } = props;

  return (<>
    <div className={classes.card}>
      <Title content="Purchases" />
      <LazyComponent dataLoadState={dataLoadState} >
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
      </LazyComponent>
    </div>
  </>);
}
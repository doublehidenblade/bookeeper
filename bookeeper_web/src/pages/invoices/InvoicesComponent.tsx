import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { invoiceTableOptions, InvoiceTableData } from '../../schema/invoice';
import Table from '../common/Table'
import { LoadState } from '../../utils/types';
import LazyComponent from '../common/LazyComponent';

interface Props {
  invoicesTableData: InvoiceTableData[],
  dataLoadState: LoadState
}

// 2. style using Materail-UI
const useStyles = makeStyles(() => ({
  card: {
  },
}));

// 3. export the component
export default function InvoicesComponent(props: Props) {
  const classes = useStyles();
  const { invoicesTableData, dataLoadState } = props;

  return (<>
    <div className={classes.card}>
      <LazyComponent dataLoadState={dataLoadState} >
        <Table
          headerData={
            invoiceTableOptions.map(option => option.label)
          }
          data={
            invoicesTableData.map((invoice: InvoiceTableData) => {
              return (
                invoiceTableOptions.map(option => invoice[option.key])
              )
            })
          }
        />
      </LazyComponent>
    </div>
  </>);
}
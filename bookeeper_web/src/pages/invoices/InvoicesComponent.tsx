import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { invoiceTableOptions, InvoiceTableData } from '../../schema/invoice';
import Table from '../common/Table'

interface Props {
  invoicesTableData: InvoiceTableData[],
}

// 2. style using Materail-UI
const useStyles = makeStyles(() => ({
  card: {
  },
}));

// 3. export the component
export default function InvoicesComponent(props: Props) {
  const classes = useStyles();
  const { invoicesTableData } = props;

  return (<>
    <div className={classes.card}>
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
    </div>
  </>);
}
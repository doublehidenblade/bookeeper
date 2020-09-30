
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { payrollTableOptions, PayrollTableData } from '../../schema/payroll';
import Table from '../common/Table'

interface Props {
  payrollsTableData: PayrollTableData[],
}

// 2. style using Materail-UI
const useStyles = makeStyles(() => ({
  card: {
  },
}));

// 3. export the component
export default function PayrollsComponent(props: Props) {
  const classes = useStyles();
  const { payrollsTableData } = props;

  return (<>
    <div className={classes.card}>
      <Table
        headerData={
          payrollTableOptions.map(option => option.label)
        }
        data={
          payrollsTableData.map((payroll: PayrollTableData) => {
            return (
              payrollTableOptions.map(option => payroll[option.key])
            )
          })
        }
      />
    </div>
  </>);
}
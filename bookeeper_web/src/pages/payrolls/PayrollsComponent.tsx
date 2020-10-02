
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { payrollTableOptions, PayrollTableData } from '../../schema/payroll';
import Table from '../common/Table'
import { LoadState } from '../../utils/types';
import LazyComponent from '../common/LazyComponent';
import Title from '../common/Title';

interface Props {
  payrollsTableData: PayrollTableData[],
  dataLoadState: LoadState,
}

// 2. style using Materail-UI
const useStyles = makeStyles(() => ({
  card: {
  },
}));

// 3. export the component
export default function PayrollsComponent(props: Props) {
  const classes = useStyles();
  const { payrollsTableData, dataLoadState } = props;

  return (<>
    <div className={classes.card}>
      <Title content="Payrolls" />
      <LazyComponent dataLoadState={dataLoadState}>
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
      </LazyComponent>
    </div>
  </>);
}
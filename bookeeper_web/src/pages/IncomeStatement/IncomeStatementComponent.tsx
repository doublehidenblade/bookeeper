import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { LoadState, ListData } from '../../utils/types';
import LazyComponent from '../common/LazyComponent';
import DataList from '../common/DataList';

interface Props {
  incomeStatementData: ListData | null,
  dataLoadState: LoadState
}

// 2. style using Materail-UI
const useStyles = makeStyles(() => ({
  card: {
  },
}));

// 3. export the component
export default function IncomeStatementComponent(props: Props) {
  const classes = useStyles();
  const { incomeStatementData, dataLoadState } = props;

  return (<>
    <div className={classes.card}>
      <LazyComponent dataLoadState={dataLoadState} >
        <>
          {
            incomeStatementData
              ?
              <DataList data={incomeStatementData} />
              :
              null
          }
        </>
      </LazyComponent>
    </div>
  </>);
}
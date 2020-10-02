import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { LoadState, ListData } from '../../utils/types';
import LazyComponent from '../common/LazyComponent';
import DataList from '../common/DataList';

interface Props {
  balanceSheetData: ListData | null,
  dataLoadState: LoadState
}

// 2. style using Materail-UI
const useStyles = makeStyles(() => ({
  card: {
  },
}));

// 3. export the component
export default function BalanceSheetComponent(props: Props) {
  const classes = useStyles();
  const { balanceSheetData, dataLoadState } = props;

  return (<>
    <div className={classes.card}>
      <LazyComponent dataLoadState={dataLoadState} >
        <>
          {
            balanceSheetData
              ?
              (<div style={{ display: 'flex' }}>
                <DataList data={[balanceSheetData[0]]} style={{ width: '50%' }} />
                <DataList data={[balanceSheetData[1]]} style={{ width: '50%' }} />
              </div>)
              :
              null
          }
        </>
      </LazyComponent>
    </div>
  </>);
}
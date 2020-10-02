import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { partTableOptions, PartTableData } from '../../schema/part';
import Table from '../common/Table'
import { LoadState } from '../../utils/types';
import LazyComponent from '../common/LazyComponent';
import Title from '../common/Title';

interface Props {
  partsTableData: PartTableData[],
  dataLoadState: LoadState,
}

// 2. style using Materail-UI
const useStyles = makeStyles(() => ({
  card: {
  },
}));

// 3. export the component
export default function PartsComponent(props: Props) {
  const classes = useStyles();
  const { partsTableData, dataLoadState } = props;

  return (<>
    <div className={classes.card}>
      <Title content="Inventory" />
      <LazyComponent dataLoadState={dataLoadState}>
        <Table
          headerData={
            partTableOptions.map(option => option.label)
          }
          data={
            partsTableData.map((part: PartTableData) => {
              return (
                partTableOptions.map(option => part[option.key])
              )
            })
          }
        />
      </LazyComponent>
    </div>
  </>);
}
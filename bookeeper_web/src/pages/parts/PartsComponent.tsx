import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { partTableOptions, PartTableData } from '../../schema/part';
import Table from '../common/Table'

interface Props {
  partsTableData: PartTableData[],
}

// 2. style using Materail-UI
const useStyles = makeStyles(() => ({
  card: {
  },
}));

// 3. export the component
export default function PartsComponent(props: Props) {
  const classes = useStyles();
  const { partsTableData } = props;

  return (<>
    <div className={classes.card}>
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
    </div>
  </>);
}
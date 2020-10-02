import React from 'react'
import { ListData } from '../../utils/types';
import { makeStyles } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

interface Props {
  data: ListData,
  style?: any,
}

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '2em',
    padding: '1em',
    backgroundColor: theme.palette.background.paper,
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

const DataList = (props: Props) => {
  const { data, style } = props;
  const classes = useStyles();
  return (
    <div className={classes.root} style={style}>
      {
        data.map((data, id) => (
          <List key={id}>
            <b>{data.category}</b>
            {data.data.map((pair, idx) => (
              <ListItem divider key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ float: 'left' }}>{pair.label}</p>
                <p style={{ float: 'right' }}>{pair.value}</p>
              </ListItem>
            ))}
          </List>
        ))
      }
    </div>
  )
}

export default DataList;

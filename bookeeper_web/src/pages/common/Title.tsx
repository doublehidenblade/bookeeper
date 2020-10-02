import React from 'react'
import { makeStyles } from '@material-ui/core';

interface Props {
  content: string,
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

const Title = (props: Props) => {
  const classes = useStyles();
  const { content, style } = props;
  return (
    <div className={classes.root} style={style}>
      <h2>{content}</h2>
    </div>);
}

export default Title;
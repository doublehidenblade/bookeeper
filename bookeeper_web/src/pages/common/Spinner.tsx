import React from 'react'
import { CircularProgress } from '@material-ui/core';

const Spinner = () => {
  return (<div style={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></div>);
}

export default Spinner;
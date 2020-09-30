import React, { useState } from 'react'
import { Button, CircularProgress } from '@material-ui/core';

interface Props {
  submitAction: Function
  actionName: string
}

const SpinnerButton = (props: Props) => {
  const [submitting, setSubmitting] = useState(false);
  const { submitAction, actionName } = props;
  const onSubmit = async (data) => {
    setSubmitting(true);
    await submitAction(data);
    setSubmitting(false);
  }

  return (
    <>
      {
        submitting
          ?
          <CircularProgress />
          :
          <Button color="primary" onClick={onSubmit} >{actionName}</Button>
      }
    </>);
}

export default SpinnerButton;
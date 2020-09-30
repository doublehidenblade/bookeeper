import React, { useState } from 'react'
import { Button } from '@material-ui/core';
import Spinner from './Spinner';

interface Props {
  submitAction: (data: any) => Promise<any>
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
          <Spinner />
          :
          <Button color="primary" onClick={onSubmit} >{actionName}</Button>
      }
    </>);
}

export default SpinnerButton;
import React, { useState, useMemo } from 'react'
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';

type fieldSpec<T> = {
  key: string,
  label: string,
  type: string,
  required: boolean,
  value?: T,
  defaultValue?: T,
}

interface Props {
  action: string,
  title: string,
  options: fieldSpec<number | string>[],
  onSubmit: Function,
}

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

export default function FormComponent(props: Props) {
  const classes = useStyles();
  const { action, title, options, onSubmit } = props;
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const initialEntries = useMemo(() => {
    const obj = {};
    options.forEach(option => {
      obj[option.key] = option.value;
    })
    return obj;
  }, [options]);

  const [entries, setEntries] = useState(initialEntries);
  const updateValue = (key, value) => {
    setEntries(Object.assign({}, entries, { [key]: value }));
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const checkForm = () => {
    return options.every(option => {
      if (option.required && entries[option.key] == null) {
        return false;
      }
      return true;
    });
  }

  const handleSubmit = async () => {
    const allGood = checkForm();
    if (allGood) {
      setSubmitting(true);
      const ref = await onSubmit(entries);
      setSubmitting(false);
      if (ref == null) {
        // add error
        alert('Failed to add, please check network connection');
        return;
      }
      handleClose();
    } else {
      alert('Please fill out all required fields');
    }
  }

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        {action}
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          {
            options.map(spec => (
              <TextField
                key={spec.key}
                id={spec.key}
                label={spec.label}
                value={spec.value}
                type={spec.type}
                defaultValue={spec.defaultValue}
                onChange={(event) => updateValue(spec.key, event.target.value)}
                variant="filled"
                required={spec.required}
              />
            ))
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          {
            submitting
              ?
              (
                <CircularProgress
                  variant="determinate"
                  size={40}
                  thickness={4}
                  value={100}
                />
              )
              :
              (
                <Button onClick={handleSubmit} color="primary">
                  Submit
                </Button>
              )
          }
        </DialogActions>
      </Dialog>
    </div>
  );
}

import React, { useState, useMemo } from 'react'
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Button, InputLabel, Select, MenuItem } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import SpinnerButton from './SpinnerButton';
import { Entries, FieldTypes } from '../../utils/types';
import { isValidCurrency, isValidInteger } from '../../utils/helpers';

type fieldSpec<T> = {
  key: string,
  label: string,
  type: FieldTypes,
  required: boolean,
  value?: T,
  defaultValue?: T,
  selectOptions?: { label: string, value: string | number }[]
}

interface Props {
  action: string,
  title: string,
  options: fieldSpec<number | string>[],
  onSubmit: (formData: Entries) => any,
  text?: string,
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
  const { action, title, options, onSubmit, text } = props;
  const [open, setOpen] = useState(false);

  const initialEntries = useMemo(() => {
    const obj = {};
    options.forEach(option => {
      obj[option.key] = option.value;
    })
    return obj;
  }, [options]);

  const [entries, setEntries] = useState(initialEntries);
  const updateValue = (key: string, value) => {
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
      const value = entries[option.key];
      if (option.required && value == null) {
        alert(option.label + ' is required');
        return false;
      }
      if (option.type === FieldTypes.currency) {
        if (!isValidCurrency(value)) {
          alert(option.label + ' needs valid currency value');
          return false;
        }
      } else if (option.type === FieldTypes.integer) {
        if (!isValidInteger(value)) {
          alert(option.label + ' needs valid integer value');
          return false;
        }
      }
      return true;
    });
  }

  const handleSubmit = async () => {
    const allGood = checkForm();
    if (!allGood) {
      return;
    }
    const ref = await onSubmit(entries);
    setEntries(initialEntries);
    if (ref == null) {
      // add error
      alert('Action failed');
      return;
    }
    handleClose();
    return ref;
  }

  const handleChange = (event: any, spec: fieldSpec<string | number>) => {
    const value = event.target.value.trim();
    updateValue(spec.key, value);
  }

  return (
    <div>
      <Button color="primary" onClick={handleClickOpen}>
        {action}
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="form-dialog-description">
            {text}
          </DialogContentText>
          {
            options.map(spec => {
              if (spec.type === FieldTypes.selector) {
                return (
                  <div>
                    <InputLabel id={spec.label}>{spec.label}</InputLabel>
                    <Select
                      labelId={spec.label}
                      value={spec.value}
                      onChange={event => handleChange(event, spec)}
                    >
                      {
                        spec.selectOptions?.map(option => <MenuItem value={option.value}>{option.label}</MenuItem>)
                      }
                    </Select>
                  </div>
                )
              }
              return (
                <TextField
                  key={spec.key}
                  id={spec.key}
                  label={spec.label}
                  value={spec.value}
                  type={spec.type}
                  defaultValue={spec.defaultValue}
                  onChange={event => handleChange(event, spec)}
                  variant="filled"
                  required={spec.required}
                />
              )
            })
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          {
            <SpinnerButton submitAction={handleSubmit} actionName="submit" />
          }
        </DialogActions>
      </Dialog>
    </div>
  );
}

import { makeStyles } from '@material-ui/core/styles';
import firebase from 'firebase/app';
import React from 'react';
import Form from './common/Form';
import { useSelector } from 'react-redux';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import {
  Redirect,
} from 'react-router-dom';
import Spinner from './common/Spinner';
import { Entries } from '../utils/types';

const useStyles = makeStyles(theme => ({
  forgotPass: {
    color: `${theme.palette.primary.main}`,
    fontSize: '0.5em',
    width: 'fit-content'
  }
}));

const loginFormOptions = [
  {
    key: 'email',
    label: 'email',
    type: 'email',
    required: true,
  },
  {
    key: 'password',
    label: 'password',
    type: 'password',
    required: true,
  },
]

type EntryType = {
  email: string,
  password: string,
}

export default function Login(props) {
  const classes = useStyles();
  const auth = useSelector((state: { firebase: { auth: any; }; }) => state.firebase.auth);

  const signIn = async (entry: Entries) => {
    const { email, password } = entry;
    if (email === '' || password === '') {
      alert('email and password cannot be empty');
      return;
    }
    const ref = await firebase.auth().signInWithEmailAndPassword(email, password).catch(err => alert(err.message));
    props.history.push('/');
    return ref;
  };

  if (!isLoaded(auth)) {
    return <Spinner />
  }

  if (!isEmpty(auth)) {
    return (<Redirect
      to={{
        pathname: '/',
      }}
    />);
  }

  return (<>
    <Form
      action="login"
      title="login"
      options={loginFormOptions}
      onSubmit={signIn}
    />
  </>);
}
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import firebase from 'firebase/app';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }),
);

const Home: React.FunctionComponent<RouteComponentProps> = (props) => {
  const classes = useStyles();
  const redirectTo = (path) => {
    props.history.push({
      pathname: '/',
      search: '?redirect=' + path
    });
  }

  const signout = () => {
    firebase
      .auth()
      .signOut()
      .then(
        function () {
          console.log('signed out');
          props.history.push({
            pathname: '/'
          });
        },
        function (error) {
          console.log('sign out error: ', error.message);
        }
      );
  };

  return (
    <div className={classes.root}>
      <ButtonGroup size="small" aria-label="small outlined button group">
        <Button onClick={() => redirectTo('employees')}>Employees</Button>
        <Button>Customers</Button>
        <Button>Vendors</Button>
      </ButtonGroup>
      <ButtonGroup size="small" aria-label="small outlined button group">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
      <ButtonGroup size="small" aria-label="small outlined button group">
        <Button onClick={signout}>sign out</Button>
      </ButtonGroup>
    </div>
  );
}

export default Home;
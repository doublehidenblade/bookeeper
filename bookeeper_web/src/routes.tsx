import React, { Suspense } from 'react'
import { CircularProgress } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { isEmpty, isLoaded } from 'react-redux-firebase';
import BKErrorBoundary from './pages/common/BKErrorBoundary';
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch,
  Link,
} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import history from './history';

const Employees = React.lazy(() => import('./pages/employees/EmployeesContainer'));
// const Vendors = React.lazy(() => import('./pages/vendors/VendorsContainer'));
// const Customers = React.lazy(() => import('./pages/customers/CustomersContainer'));
// const Inventory = React.lazy(() => import('./pages/inventory/InventoryContainer'));

function PrivateRoute(args: { path?: string, render: (props: any) => JSX.Element, exact?: boolean }) {
  const auth = useSelector((state: { firebase: { auth: any; }; }) => state.firebase.auth);
  return (isLoaded(auth) && !isEmpty(auth) ? <Route {...args} /> :
    <Route
      render={() => {
        return (<Redirect
          to={{
            pathname: '/login',
          }}
        />);
      }}
    />);
}

function RedirectRoute(args: any) {
  const str = window.location.search;
  const urlParams = new URLSearchParams(str);
  const redirect = urlParams.get('redirect');
  if (!redirect) {
    return <PrivateRoute exact path="/" render={(props) => (<BKErrorBoundary><Home {...props} /></BKErrorBoundary>)} />;
  }
  return (<PrivateRoute
    render={() => (
      <Redirect
        to={{
          pathname: '/' + redirect,
        }}
      />)}
  />);

}

interface Props { }

const RouteComponent: React.FC<Props> = () => (
  <BrowserRouter history={history}>
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></div>}>
      <Link to="/">Home</Link>
      <Switch>
        <RedirectRoute exact path='/' />
        <Route exact path="/login" render={(props) => (<BKErrorBoundary><Login {...props} /></BKErrorBoundary>)} />
        <PrivateRoute path="/employees" render={(props) => (<BKErrorBoundary><Employees {...props} /></BKErrorBoundary>)} />
      </Switch>
    </Suspense>
  </BrowserRouter>
);

export default RouteComponent;
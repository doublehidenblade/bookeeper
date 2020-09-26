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
} from 'react-router-dom';
import Navbar from './pages/Navbar';
import Home from './pages/Home';
const Employees = React.lazy(() => import('./pages/employees/EmployeesContainer'));
// const Vendors = React.lazy(() => import('./pages/vendors/VendorsContainer'));
// const Customers = React.lazy(() => import('./pages/customers/CustomersContainer'));
// const Inventory = React.lazy(() => import('./pages/inventory/InventoryContainer'));

function PrivateRoute(args: { component: JSX.Element, path: string }) {
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
    return <Route exact component={Home} path='/' />;
  }

  return (<PrivateRoute
    render={() => (
      <Redirect
        to={{
          pathname: '/' + redirect,
        }}
      />)}
    {...args}
  />);

}

interface Props { }

function ErrorWrap(component: {} | null | undefined) {
  return (
    <BKErrorBoundary>
      {component}
    </BKErrorBoundary>
  )
}

const RouteComponent: React.FC<Props> = () => (
  <BrowserRouter>
    <Navbar />
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></div>}>
      <Switch>
        {/* <RedirectRoute path='/' /> */}
        <Route exact component={Employees} path="/employees" />
        {/* <PrivateRoute component={ErrorWrap(Vendors)} path="/vendors" />
        <PrivateRoute component={ErrorWrap(Customers)} path="/customers" />
        <PrivateRoute component={ErrorWrap(Inventory)} path="/inventory" /> */}
      </Switch>
    </Suspense>
  </BrowserRouter>
);

export default RouteComponent;
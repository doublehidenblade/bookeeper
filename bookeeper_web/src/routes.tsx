import React, { Suspense } from 'react'
import Spinner from './pages/common/Spinner';
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
import { Button } from '@material-ui/core';

const Employees = React.lazy(() => import('./pages/employees/EmployeesContainer'));
const Vendors = React.lazy(() => import('./pages/vendors/VendorsContainer'));
const Customers = React.lazy(() => import('./pages/customers/CustomersContainer'));
const Payrolls = React.lazy(() => import('./pages/payrolls/PayrollsContainer'));
const Purchases = React.lazy(() => import('./pages/purchases/PurchasesContainer'));
const Invoices = React.lazy(() => import('./pages/invoices/InvoicesContainer'));
const Parts = React.lazy(() => import('./pages/parts/PartsContainer'));
const IncomeStatementContainer = React.lazy(() => import('./pages/IncomeStatement/IncomeStatementContainer'));
const BalanceSheetContainer = React.lazy(() => import('./pages/BalanceSheet/BalanceSheetContainer'));


function PrivateRoute(args: { path?: string, render: (props: any) => JSX.Element, exact?: boolean }) {
  const auth = useSelector((state: { firebase: { auth: any; }; }) => state.firebase.auth);
  if (!isLoaded(auth)) {
    return <Spinner />;
  };
  return (!isEmpty(auth)
    ?
    <Route {...args} />
    :
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
    <Suspense fallback={<Spinner />}>
      <Link to="/" style={{ textDecoration: 'none' }}><Button>Home</Button></Link>
      <Switch>
        <RedirectRoute exact path='/' />
        <Route exact path="/login" render={(props) => (<BKErrorBoundary><Login {...props} /></BKErrorBoundary>)} />
        <PrivateRoute path="/employees" render={(props) => (<BKErrorBoundary><Employees {...props} /></BKErrorBoundary>)} />
        <PrivateRoute path="/payrolls" render={(props) => (<BKErrorBoundary><Payrolls {...props} /></BKErrorBoundary>)} />
        <PrivateRoute path="/purchases" render={(props) => (<BKErrorBoundary><Purchases {...props} /></BKErrorBoundary>)} />
        <PrivateRoute path="/vendors" render={(props) => (<BKErrorBoundary><Vendors {...props} /></BKErrorBoundary>)} />
        <PrivateRoute path="/customers" render={(props) => (<BKErrorBoundary><Customers {...props} /></BKErrorBoundary>)} />
        <PrivateRoute path="/inventory" render={(props) => (<BKErrorBoundary><Parts {...props} /></BKErrorBoundary>)} />
        <PrivateRoute path="/invoices" render={(props) => (<BKErrorBoundary><Invoices {...props} /></BKErrorBoundary>)} />
        <PrivateRoute path="/incomestatement" render={(props) => (<BKErrorBoundary><IncomeStatementContainer {...props} /></BKErrorBoundary>)} />
        <PrivateRoute path="/balancesheet" render={(props) => (<BKErrorBoundary><BalanceSheetContainer {...props} /></BKErrorBoundary>)} />
      </Switch>
    </Suspense>
  </BrowserRouter>
);

export default RouteComponent;
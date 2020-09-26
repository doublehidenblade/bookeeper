import React from 'react';
import RouteComponent from './routes';
import * as firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/firestore';
import { Provider } from 'react-redux';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { createFirestoreInstance } from 'redux-firestore';

import firebaseStore from './firebaseStore';

const store = firebaseStore();

const rrfConfig = {
  presence: 'presence',
  sessions: 'sessions', // where list of online users is stored in database
  useFirestoreForProfile: true, // where list of user sessions is stored in database (presence must be enabled)
  userProfile: 'users' // Firestore for Profile instead of Realtime DB
};

const rrfProps = {
  config: rrfConfig,
  createFirestoreInstance,
  dispatch: store.dispatch,
  firebase // <- needed if using firestore
};

function App() {
  return (
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <RouteComponent />
      </ReactReduxFirebaseProvider>
    </Provider>
  );
}

export default App;

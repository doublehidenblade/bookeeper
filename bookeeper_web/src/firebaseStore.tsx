import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/analytics';
import 'firebase/functions';

import * as firebase from 'firebase/app';
import { firebaseReducer } from 'react-redux-firebase';
import { createStore } from 'redux';
import { combineReducers } from 'redux';
import { firestoreReducer } from 'redux-firestore';

export default function firebaseStore() {
  const firebaseConfig = {
    apiKey: "AIzaSyA4xraxwdEXUtIFtNDkArkRQFwHOo34KAI",
    authDomain: "bookeeper-b579b.firebaseapp.com",
    databaseURL: "https://bookeeper-b579b.firebaseio.com",
    projectId: "bookeeper-b579b",
    storageBucket: "bookeeper-b579b.appspot.com",
    messagingSenderId: "715498937850",
    appId: "1:715498937850:web:d5b17f6957fd6a1a685843"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const firebase_analytics = firebase.analytics();
  firebase_analytics.logEvent('init');

  const rootReducer = combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer
  });

  const initialState = {};
  const store = createStore(rootReducer, initialState);

  return store;
}
import React, { useState, useEffect, Component } from 'react'
import { LoadState } from '../../utils/types';
import ErrorPage from './ErrorPage';
import Spinner from './Spinner';

interface Props {
  dataLoadState: LoadState,
  children: JSX.Element
}

const LazyComponent = (props: Props) => {
  const { dataLoadState, children } = props;
  const [loadState, setLoadState] = useState(dataLoadState);
  useEffect(() => {
    setLoadState(dataLoadState);
  }, [dataLoadState]);

  if (loadState === LoadState.loading) {
    return <Spinner />;
  }
  if (loadState === LoadState.error) {
    return <ErrorPage />
  }
  return children;
}

export default LazyComponent;
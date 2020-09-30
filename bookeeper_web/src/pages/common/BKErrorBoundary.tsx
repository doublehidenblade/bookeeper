import React from 'react';
import ErrorPage from './ErrorPage';

type State = {
  error: Error | null,
  errorInfo: {
    componentStack: string,
  } | null,
}

class BKErrorBoundary extends React.Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    // You can also log error messages to an error reporting service here
    console.error('Error caught: ', error);
  }

  render() {
    if (this.state.errorInfo) {
      // Error path
      return (<ErrorPage />);
    }
    // Normally, just render children
    return this.props.children;
  }
}

export default BKErrorBoundary;
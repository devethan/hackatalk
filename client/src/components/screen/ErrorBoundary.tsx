import { Component, ReactElement } from 'react';

import { RootStackNavigationProps } from '../navigation/RootStackNavigator';

interface Props {
  children?: ReactElement;
  fallback?: ReactElement;
  navigation?: RootStackNavigationProps<'default'>;
}

// Error boundaries currently have to be classes.
class ErrorBoundary extends Component<Props> {
  state = { hasError: false, error: null };
  static getDerivedStateFromError = (
    error: ErrorBoundary,
  ): Record<string, unknown> => {
    console.log('Catch Error in components', error);
    return {
      hasError: true,
      error,
    };
  };

  render(): ReactElement | null {
    if (this.state.hasError && this.props.fallback) {
      console.log('return fallback');

      return this.props.fallback;
    }
    if (this.props.children) {
      return this.props.children;
    }
    return null;
  }
}

export default ErrorBoundary;

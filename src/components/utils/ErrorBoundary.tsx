import React, { ReactNode } from 'react';

// Define the props and state interfaces
interface ErrorBoundaryProps {
  children: ReactNode; // This allows any valid React children (elements, text, etc.)
}

interface ErrorBoundaryState {
  hasError: boolean; // The state includes a hasError boolean
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = { hasError: false };
  }

  // This static method updates the state when an error is caught
  static getDerivedStateFromError(_error: any) {
    return { hasError: true };
  }

  // componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  //   // Optional: Use your own error logging service here
  //   console.log({ error, errorInfo });
  // }

  render() {
    if (this.state.hasError) {
      return (
        <div className='max-w-[100px]'>
          <h2>Oops, there is an error!</h2>
          <button
            type='button'
            onClick={() => this.setState({ hasError: false })}
            className='text-blue-500'
          >
            Try again?
          </button>
        </div>
      );
    }

    return this.props.children; // TypeScript now recognizes that children exist
  }
}

export default ErrorBoundary;

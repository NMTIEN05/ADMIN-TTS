import React from 'react';
import { Result, Button } from 'antd';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="500"
          title="Có lỗi xảy ra"
          subTitle="Xin lỗi, đã có lỗi không mong muốn xảy ra. Vui lòng thử lại."
          extra={
            <Button 
              type="primary" 
              onClick={() => window.location.reload()}
            >
              Tải lại trang
            </Button>
          }
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
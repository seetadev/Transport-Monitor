import React, { createContext, useContext } from 'react';
import StackdriverErrorReporter from 'stackdriver-errors-js';
import { getProviderName } from 'request-shared';

interface IProps {
  stackdriverErrorReporterApiKey?: string;
  projectId?: string;
  service?: string;
  component: React.FunctionComponent<any>;
}

interface IState {
  hasError: boolean;
}

const ErrorReporterContext = createContext<
  { report: (error: Error) => void } | undefined
>(undefined);

export const useErrorReporter = () => {
  const context = useContext(ErrorReporterContext);
  if (!context) {
    throw new Error('This must be used within a ErrorReporterContext provider');
  }
  return context;
};

/**
 * Limits propagation of errors, and reports error in production using GoogleStackDriver
 */
export class ErrorBoundary extends React.Component<IProps, IState> {
  private reporter: StackdriverErrorReporter;
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
    this.reporter = new StackdriverErrorReporter();
  }

  async componentDidMount() {
    await this.reporter.start({
      key: this.props.stackdriverErrorReporterApiKey,
      projectId: this.props.projectId,
      service: this.props.service,
      disabled: window.location.hostname === 'localhost',
    });
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: string | Error) {
    this.report(error);
  }

  report(error: any) {
    if (window.location.hostname === 'localhost') {
      console.log(error);
    }
    if (window.location.hostname.includes('ngrok')) {
      alert(error);
    }
    const providerName = getProviderName();
    if (providerName) {
      error.providerName = providerName;
    }
    this.reporter.report(error);
  }

  render() {
    if (this.state.hasError) {
      const Component = this.props.component;
      return <Component />;
    }
    return (
      <ErrorReporterContext.Provider value={{ report: this.report.bind(this) }}>
        {this.props.children}
      </ErrorReporterContext.Provider>
    );
  }
}

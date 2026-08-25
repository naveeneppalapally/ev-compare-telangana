import React from 'react';
import { Zap } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

const isDev = import.meta.env.DEV;

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo): void {
    if (isDev) {
      console.error('Unhandled UI error:', error, info.componentStack);
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        role="alert"
        className="min-h-screen bg-paper text-ink flex items-center justify-center px-4"
      >
        <div className="max-w-md w-full text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-ink flex items-center justify-center mb-5">
            <Zap className="w-6 h-6 fill-milestone text-milestone" />
          </div>
          <h1 className="text-lg font-bold tracking-tight">Something went wrong</h1>
          <p className="mt-2 text-sm text-stone-500 leading-relaxed">
            The comparison engine hit an unexpected error. Reloading usually fixes it — your saved
            selections will be restored automatically.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex items-center rounded-full bg-ink hover:bg-stone-800 px-5 py-2.5 text-sm font-semibold text-paper transition cursor-pointer"
          >
            Reload EV Compare TG
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;

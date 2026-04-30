import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to console for developer debugging
    // Keep output minimal so it is easy to spot in devtools
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, background: '#0b0b0d', color: '#ffdede' }}>
          <h3 style={{ margin: 0, marginBottom: 8 }}>Component failed to render</h3>
          <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{this.state.error?.message || String(this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

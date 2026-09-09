import React from 'react';
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <main className="min-h-dvh grid place-content-center p-8 text-center gap-4">
      <h1 className="font-display text-2xl">Let's get back to playing</h1>
      <p>Something interrupted the app. Your saved history is still on this device.</p>
      <button className="primary-button" onClick={() => window.location.reload()}>Reopen app</button>
    </main> : this.props.children;
  }
}

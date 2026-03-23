import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("App error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      const msg = this.state.error?.message || "";
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
            <p className="text-6xl mb-4">😵</p>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-6">
              The app encountered an error. Try refreshing the page.
            </p>
            {msg && (
              <p className="text-xs text-gray-400 mb-4 font-mono truncate" title={msg}>{msg}</p>
            )}
            <button
              onClick={() => window.location.reload()}
              className="bg-promart-red text-white px-6 py-2 rounded-xl font-semibold hover:bg-red-600"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

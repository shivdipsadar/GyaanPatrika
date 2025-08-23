import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex flex-col justify-center items-center bg-red-50 text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Something went wrong 😢
          </h1>
          <p className="text-gray-700 mb-6">
            An unexpected error has occurred. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-3 rounded-lg shadow hover:bg-red-700 transition"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

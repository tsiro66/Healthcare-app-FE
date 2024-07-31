import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    // Initialize state to track if an error has occurred
    this.state = { hasError: false };
  }

  // This method is called when an error is thrown in a component
  static getDerivedStateFromError(error) {
    // Update state so the next render will show fallback
    return { hasError: true };
  }

  // This method is called when an error is caught
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Return fallback in case of an error
      return <this.props.fallback />;
    }

    // Return the children components if there is no error
    return this.props.children;
  }
}

export default ErrorBoundary;

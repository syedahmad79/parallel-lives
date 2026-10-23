import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <main className="screen">
        <h1>This path needs a fresh start.</h1>
        <p>
          The app hit an unexpected error. Reload to try again; saved lives
          remain in browser storage.
        </p>
        <button className="primary" onClick={() => location.reload()}>
          Reload PARALLEL
        </button>
        <p>
          <a
            href="https://www.linkedin.com/in/syedahmadgeelani"
            target="_blank"
            rel="noopener noreferrer"
          >
            Made by Syed Ahmad Geelani
          </a>
        </p>
      </main>
    ) : (
      this.props.children
    );
  }
}
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);

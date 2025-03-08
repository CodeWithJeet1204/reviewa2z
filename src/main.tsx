import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add global error handler
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global error:', {
    message,
    source,
    lineno,
    colno,
    error
  });
  return false;
};

// Add unhandled promise rejection handler
window.onunhandledrejection = function(event) {
  console.error('Unhandled promise rejection:', event.reason);
};

console.log('Starting application...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

try {
  console.log('Creating root...');
  const root = createRoot(rootElement);

  console.log('Rendering app...');
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('App rendered successfully');
} catch (error) {
  console.error('Error during app initialization:', error);
  // Display a fallback UI
  rootElement.innerHTML = `
    <div style="
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      text-align: center;
      font-family: system-ui, -apple-system, sans-serif;
    ">
      <div>
        <h1 style="margin-bottom: 16px; font-size: 24px; font-weight: bold;">
          Unable to Load Application
        </h1>
        <p style="margin-bottom: 16px; color: #666;">
          There was an error initializing the application. Please try refreshing the page.
        </p>
        <button onclick="window.location.reload()" style="
          padding: 8px 16px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        ">
          Refresh Page
        </button>
      </div>
    </div>
  `;
}

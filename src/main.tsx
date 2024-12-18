import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeMonitoring } from './utils/monitoring';

// Initialize monitoring
initializeMonitoring();

// Add error handling for uncaught errors
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

createRoot(document.getElementById("root")!).render(<App />);
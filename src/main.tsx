import './lib/i18n';
import './index.css';
import { createRoot } from 'react-dom/client'
import App from './App'

console.log('Starting Shifa Care application...');

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error('Root element not found!');
  throw new Error('Root element not found');
}

console.log('Root element found, creating React root...');

const root = createRoot(rootElement);

console.log('Rendering App component...');

root.render(<App />);

console.log('App component rendered successfully!');

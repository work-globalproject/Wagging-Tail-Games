import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { hydrateDeviceData } from './lib/device';
import { ErrorBoundary } from './components/ErrorBoundary';

hydrateDeviceData().then(() => {
  createRoot(document.getElementById('root')!).render(<ErrorBoundary><App /></ErrorBoundary>);
}).catch(() => {
  document.getElementById('root')!.textContent = 'Device storage is unavailable. Close and reopen the app to try again. Your saved data has not been reset.';
});

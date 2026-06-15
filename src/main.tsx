import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
// Fontes auto-hospedadas (offline, sem CDN): Anton (títulos) + Archivo (texto).
import '@fontsource/anton';
import '@fontsource-variable/archivo';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Base relativa para funcionar tanto na web quanto empacotado no Capacitor.
export default defineConfig({
  plugins: [react()],
  base: './',
});

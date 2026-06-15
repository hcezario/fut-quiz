import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cezario.futquiz',
  appName: 'Fut Quiz',
  // O build do Vite gera em dist/. O Capacitor empacota esse diretório.
  webDir: 'dist',
};

export default config;

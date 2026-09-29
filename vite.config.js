import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración mínima: solo activa el soporte de React (JSX).
export default defineConfig({
  plugins: [react()],
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@tabler/icons-react':
        '@tabler/icons-react/dist/esm/icons/index.mjs',
      'datatables.net': 'datatables.net', // Solo la ruta del paquete
      'datatables.net-dt': 'datatables.net-dt', // Solo la ruta del paquete
    },
  },
});

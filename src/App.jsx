import { Helmet, HelmetProvider } from 'react-helmet-async';
import { RouterProvider } from 'react-router-dom';

import { ThemeProvider } from './components/theme-provider';
import { router } from './router';

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="maestro">
      <HelmetProvider>
        <Helmet title="CM Manutenção Industrial &#8482;" />
        <RouterProvider router={router} />
      </HelmetProvider>
    </ThemeProvider>
  );
}

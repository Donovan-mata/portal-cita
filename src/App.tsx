import { Suspense, lazy, useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useThemeStore } from '@/store/themeStore';

const HomePage = lazy(() => import('@/pages/HomePage'));
const BookingPage = lazy(() => import('@/pages/BookingPage'));
const MyCitasPage = lazy(() => import('@/pages/MyCitasPage'));
import CarPreloader from '@/components/CarPreloader';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/booking',
    element: <BookingPage />,
  },
  {
    path: '/mis-citas',
    element: <MyCitasPage />,
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-slate-900 dark:text-white mb-4">404</h1>
          <p className="text-xl text-slate-600 dark:text-zinc-400 mb-6 font-medium">Página no encontrada</p>
          <a href="/" className="px-8 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-lg hover:shadow-xl">
            Volver al inicio
          </a>
        </div>
      </div>
    ),
  },
]);

function App() {
  const { theme } = useThemeStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Inject theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Simular tiempo mínimo de carga para mostrar la animación "Smoke Car"
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 2000); 

    return () => clearTimeout(timer);
  }, [theme]);

  if (isInitializing) {
    return <CarPreloader />;
  }

  return (
    <Suspense fallback={<CarPreloader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;

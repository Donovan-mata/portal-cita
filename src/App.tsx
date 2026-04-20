import { Suspense, lazy, useEffect, useState } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import PrivateRoute from '@/components/PrivateRoute';

const HomePage = lazy(() => import('@/pages/HomePage'));
const BookingPage = lazy(() => import('@/pages/BookingPage'));
const MyCitasPage = lazy(() => import('@/pages/MyCitasPage'));
const AuthPage = lazy(() => import('@/pages/AuthPage'));
import CarPreloader from '@/components/CarPreloader';

const router = createHashRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    path: '/booking',
    element: (
      <PrivateRoute>
        <BookingPage />
      </PrivateRoute>
    ),
  },
  {
    path: '/mis-citas',
    element: (
      <PrivateRoute>
        <MyCitasPage />
      </PrivateRoute>
    ),
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
  const { initialize } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Inject theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Initialize auth + minimum preloader time
    const authPromise = initialize();
    const timerPromise = new Promise(resolve => setTimeout(resolve, 2000));

    Promise.all([authPromise, timerPromise]).then(() => {
      setIsInitializing(false);
    });
  }, [theme, initialize]);

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

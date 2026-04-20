// import { Navigate } from 'react-router-dom';
// import { useAuthStore } from '@/store/authStore';
// import CarPreloader from '@/components/CarPreloader';

interface PrivateRouteProps {
  children: React.ReactNode;
}

// TODO: Reactivar autenticación cuando se termine de desarrollar
export default function PrivateRoute({ children }: PrivateRouteProps) {
  // Auth desactivada temporalmente para desarrollo
  return <>{children}</>;

  // --- Descomentar para reactivar login ---
  // const { user, isLoading } = useAuthStore();
  // if (isLoading) return <CarPreloader />;
  // if (!user) return <Navigate to="/auth" replace />;
  // return <>{children}</>;
}

import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: Props) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

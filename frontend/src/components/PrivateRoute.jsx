import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoute = () => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  // Если токен есть, Outlet отрендерит вложенный Route (Dashboard или Profile)
  return token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

export default PrivateRoute;

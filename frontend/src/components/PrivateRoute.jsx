import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const token = localStorage.getItem('token');

  // Если токен есть, Outlet отрендерит вложенный Route (Dashboard или Profile)
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;

import { Outlet } from 'react-router-dom';
import { Navigate, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import {
  userDataSelector,
  authCheckedSelector
} from '../../slices/authReducer';
import { Preloader } from '../ui/preloader';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children?: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(authCheckedSelector);
  const user = useSelector(userDataSelector);

  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  if (onlyUnAuth && !user) {
    return children;
  }

  return <Outlet />;
};

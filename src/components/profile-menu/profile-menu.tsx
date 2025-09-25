import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { logoutApi } from '@api';
import { reset } from '../../slices/authReducer';
import { useDispatch } from '../../services/store';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    logoutApi().then(() => {
      navigate('/');
      dispatch(reset());
    });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};

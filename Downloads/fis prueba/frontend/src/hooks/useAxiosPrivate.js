import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/auth';

export const useAxiosPrivate = () => {
  const { token, logout } = useAuth();

  useEffect(() => {
    const requestIntercept = api.interceptors.request.use(
      (config) => {
        if (token && !config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestIntercept);
      api.interceptors.response.eject(responseIntercept);
    };
  }, [token, logout]);

  return api;
};

export default useAxiosPrivate;

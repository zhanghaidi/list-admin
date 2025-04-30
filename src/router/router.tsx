import { createBrowserRouter, Navigate } from 'react-router-dom';

import Error404 from '@/pages/exception/404';
import Home from '@/pages/home';
import Login from '@/pages/login';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },

  {
    path: '*',
    element: <Navigate to="/404" />,
  },
  {
    path: '/404',
    element: <Error404 />,
  },
]);

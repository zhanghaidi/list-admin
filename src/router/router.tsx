import { lazy } from 'react';
import { createHashRouter, Navigate } from 'react-router-dom';

import Error404 from '@/pages/exception/404';
import Home from '@/pages/home';
import Login from '@/pages/login';

import AuthLoader from './AuthLoader';
import { LayoutGuard } from './guard';
import { lazyLoad } from './LazyLoad';

export const router = createHashRouter([
  {
    path: '/',
    element: <Navigate to="/welcome" />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    id: 'layout',
    element: <LayoutGuard />,
    loader: AuthLoader,
    children: [
      {
        path: 'welcome',
        element: <Home />
      },
      {
        path: 'system',
        children: [
          {
            path: 'admin',
            element: lazyLoad(lazy(() => import('@/pages/system/admin')))
          },
          {
            path: 'menu',
            element: lazyLoad(lazy(() => import('@/pages/system/menu')))
          },
          {
            path: 'role',
            element: lazyLoad(lazy(() => import('@/pages/system/role')))
          }
        ]
      },
      {
        path: 'resource',
        children: [
          {
            path: 'model',
            element: lazyLoad(lazy(() => import('@/pages/resource/model')))
          },
          {
            path: 'specimen',
            element: lazyLoad(lazy(() => import('@/pages/resource/specimen')))
          },
          {
            path: 'slice',
            element: lazyLoad(lazy(() => import('@/pages/resource/slice')))
          },
          {
            path: 'article',
            element: lazyLoad(lazy(() => import('@/pages/resource/article')))
          },
          {
            path: 'sport',
            element: lazyLoad(lazy(() => import('@/pages/resource/sport')))
          }
        ]
      },
      {
        path: '/animal',
        children: [
          {
            path: 'category',
            element: lazyLoad(lazy(() => import('@/pages/animal/category')))
          },
          {
            path: 'animal',
            element: lazyLoad(lazy(() => import('@/pages/animal/animal')))
          }
        ]
      },

      {
        path: '/exercise',
        children: [
          {
            path: 'question',
            element: lazyLoad(lazy(() => import('@/pages/exercise/question')))
          }
        ]
      }
    ]
  },
  {
    path: '/404',
    element: <Error404 />
  },
  {
    path: '*',
    element: <Navigate to="/404" />
  }
]);

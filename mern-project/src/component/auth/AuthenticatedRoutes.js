import { lazy } from 'react';

const routes = [
  {
    path: 'home',
    component: lazy(() => import('component/auth/Home')),
    exact: true
  },
  {
    path: 'bestbuy-list',
    component: lazy(() => import('component/BB')),
    exact: true
  }
];

export default routes;
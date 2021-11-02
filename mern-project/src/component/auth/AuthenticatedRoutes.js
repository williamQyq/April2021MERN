import { lazy } from 'react';

const routes = [
  {
    path: 'app/bestbuy-list',
    component: lazy(() => import('component/BB')),
    exact: true
  },
  {
    path: 'app/bestbuy-list/item-detail',
    component: lazy(() => import('component/ItemDetail')),
    exact: true
  },
  // {
  //   path: 'app/price-alert',
  //   component: lazy(() => import('component/PriceAlert')),
  //   exact: true
  // },
];

export default routes;
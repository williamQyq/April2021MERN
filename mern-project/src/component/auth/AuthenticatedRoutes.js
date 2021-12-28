import { lazy } from 'react';

const routes = [
  {
    path: 'app/bestbuy-list',
    component: lazy(() => import('component/StoreBB')),
    exact: true
  },
  {
    path: 'app/bestbuy-list/item-detail',
    component: lazy(() => import('component/ItemDetail')),
    exact: true
  },
  {
    path: 'app/microsoft-list',
    component: lazy(() => import('component/StoreMS')),
    exact: true
  },
  {
    path: 'app/microsoft-list/item-detail',
    component: lazy(() => import('component/ItemDetail')),
    exact: true
  },
  {
    path: 'app/operation-products-list',
    component: lazy(() => import('component/OperationProductList')),
    exact: true
  }

  // {
  //   path: 'app/price-alert',
  //   component: lazy(() => import('component/PriceAlert')),
  //   exact: true
  // },
];

export default routes;
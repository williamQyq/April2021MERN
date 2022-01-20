import { lazy } from 'react';

const routes = [
  {
    path: 'app/bestbuy-list',
    component: lazy(() => import('component/SourceStore/StoreBB')),
    exact: true
  },
  {
    path: 'app/bestbuy-list/item-detail',
    component: lazy(() => import('component/ItemDetail/ItemDetail')),
    exact: true
  },
  {
    path: 'app/microsoft-list',
    component: lazy(() => import('component/SourceStore/StoreMS')),
    exact: true
  },
  {
    path: 'app/microsoft-list/item-detail',
    component: lazy(() => import('component/ItemDetail/ItemDetail')),
    exact: true
  },
  {
    path: 'app/operation-products-list',
    component: lazy(() => import('component/Operation/OperationProductList')),
    exact: true
  },
  {
    path: 'app/Inbound',
    component: lazy(() => import('component/InBound')),
    exact: true
  },

  // {
  //   path: 'app/price-alert',
  //   component: lazy(() => import('component/PriceAlert')),
  //   exact: true
  // },
];

export default routes;

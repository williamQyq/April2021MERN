import { lazy } from 'react';

const routes = [
  {
    path: 'app/bestbuy-list',
    component: lazy(() => import('component/SourceStore/StoreBB.jsx')),
    exact: true
  },
  {
    path: 'app/bestbuy-list/item-detail',
    component: lazy(() => import('component/ItemDetail/ItemDetail.jsx')),
    exact: true
  },
  {
    path: 'app/microsoft-list',
    component: lazy(() => import('component/SourceStore/StoreMS.jsx')),
    exact: true
  },
  {
    path: 'app/microsoft-list/item-detail',
    component: lazy(() => import('component/ItemDetail/ItemDetail.jsx')),
    exact: true
  },
  {
    path: 'app/walmart-list',
    component: lazy(() => import('component/SourceStore/StoreWM.jsx')),
    exact: true
  },
  {
    path: 'app/walmart-list/item-detail',
    component: lazy(() => import('component/ItemDetail/ItemDetail.jsx')),
    exact: true
  },
  {
    path: 'app/operation-products-list',
    component: lazy(() => import('component/Operation/OperationProductList.jsx')),
    exact: true
  },
  {
    path: 'app/Inbound',
    component: lazy(() => import('component/InBound')),
    exact: true
  },
  {
    path: 'app/outbound',
    component: lazy(() => import('component/OutBound/OutBound.jsx')),
    exact: true
  },
  {
    path: 'app/outbound/needToShipUpload',
    component: lazy(() => import('component/OutBound/NeedToShipUpload.jsx')),
    exact: true
  },
  {
    path: 'app/outbound/inventoryReceived',
    component: lazy(() => import('component/OutBound/InventoryReceived.jsx')),
    exact: true
  },
  {
    path: 'app/configuration',
    component: lazy(() => import('component/Operation/Configuration')),
    exact: true
  }

  // {
  //   path: 'app/price-alert',
  //   component: lazy(() => import('component/PriceAlert')),
  //   exact: true
  // },
];

export default routes;

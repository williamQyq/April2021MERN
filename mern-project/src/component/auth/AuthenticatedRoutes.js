import NotFound from 'component/utility/NotFound';
import { lazy } from 'react';

const StoreBB = lazy(() => import('component/SourceStore/StoreBB.jsx'));
const StoreMS = lazy(() => import('component/SourceStore/StoreMS.jsx'));
const StoreWM = lazy(() => import('component/SourceStore/StoreWM.jsx'));
const OperationProductList = lazy(() => import('component/Operation/OperationProductList.jsx'));
const OutBound = lazy(() => import('component/Warehouse/OutBound.jsx'));
const NeedToShip = lazy(() => import('component/Warehouse/NeedToShip.jsx'));
const InventoryReceived = lazy(() => import('component/Warehouse/InventoryReceived.jsx'));
const SearchRecords = lazy(() => import('component/Warehouse/SearchRecords.jsx'));
const Configuration = lazy(() => import('component/Operation/Configuration'));
const ItemDetail = lazy(() => import('component/ItemDetail/ItemDetail.jsx'));

const routes = [
  {
    path: "*",
    element: <NotFound />
  },
  {
    index: true,
    path: "/",
    element: <SearchRecords />
  },
  {
    path: "bestbuy-list",
    children: [
      {
        index: true,
        element: <StoreBB />
      },
      {
        path: "item-detail",
        element: <ItemDetail />
      }
    ]
  },
  {
    path: "microsoft-list",
    children: [
      {
        index: true,
        element: <StoreMS />
      },
      {
        path: "item-detail",
        element: <ItemDetail />
      }
    ]
  },
  {
    path: "walmart-list",
    children: [
      {
        index: true,
        element: <StoreWM />
      },
      {
        path: "item-detail",
        element: <ItemDetail />
      }
    ]
  },
  {
    path: "operation-products-list",
    element: <OperationProductList />
  },
  {
    path: "outbound",
    children: [
      {
        index: true,
        element: <OutBound />
      },
      {
        path: "needToShip",
        element: <NeedToShip />
      },
      {
        path: "inventoryReceived",
        element: <InventoryReceived />
      },
      {
        path: "searchRecord",
        element: <SearchRecords />
      }
    ]
  },
  {
    path: "configuration",
    element: <Configuration />
  }
];

export default routes;
import { lazy } from 'react';
import NotFound from 'component/utility/NotFound';
import ServiceMaintain from 'component/utility/ServiceMaintain.tsx';
const StoreBB = lazy(() => import('component/SourceStore/StoreBB.jsx'));
const StoreMS = lazy(() => import('component/SourceStore/StoreMS.jsx'));
const StoreWM = lazy(() => import('component/SourceStore/StoreWM.jsx'));
const OperationProductList = lazy(() => import('component/Operation/OperationProductList.jsx'));
const OutBound = lazy(() => import('component/Warehouse/OutBound.jsx'));
const NeedToShip = lazy(() => import('component/Warehouse/NeedToShip.jsx'));
const InventoryReceived = lazy(() => import('component/Warehouse/InventoryReceived.jsx'));
const SearchRecords = lazy(() => import('component/Warehouse/SearchRecords.jsx'));
// const Configuration = lazy(() => import('component/Operation/Configuration'));
const ItemDetail = lazy(() => import('component/ItemDetail/ItemDetail.jsx'));
const Operation = lazy(() => import('component/Operation/Operation.tsx'));
const Alert = lazy(() => import('component/SourceStore/Alert.tsx'));
const ProcessStreamStartUp = lazy(() => import('component/Operation/ProcessStreamStartUp.tsx'));

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
    path: "deal-alert",
    children: [
      {
        index: true,
        element: <Alert />
      },
      {
        path: "bestbuy-list",
        element: <StoreBB />,
        children: [
          {
            path: "item-detail",
            element: <ItemDetail />
          }
        ]
      },
      {
        path: "microsoft-list",
        element: <StoreMS />,
        children: [
          {
            path: "item-detail",
            element: <ItemDetail />
          }
        ]
      },
      {
        path: "walmart-list",
        element: <StoreWM />,
        children: [
          {
            path: "item-detail",
            element: <ItemDetail />
          }
        ]
      }
    ]
  },
  {
    path: "operation",
    children: [
      {
        index: true,
        element: <Operation />
      },
      {
        path: "amazon-products-list",
        element: <OperationProductList />
      },
      {
        path: "amazon-surveillance",
        element: <ServiceMaintain />
      },
      {
        path: "amazon-listing-template",
        element: <ServiceMaintain />
      },
      {
        path: "product-start-up",
        element: <ProcessStreamStartUp />
      }
    ]
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
  }
];

export default routes;
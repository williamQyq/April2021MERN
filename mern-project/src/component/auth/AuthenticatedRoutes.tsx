import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import NotFound from '@src/component/utils/NotFound';
import ServiceMaintain from '@src/component/utils/ServiceMaintain';
const Alert = lazy(() => import('@view/Bot/Alert.tsx'));
const StoreBB = lazy(() => import('@view/Bot/StoreBB.jsx'));
const StoreMS = lazy(() => import('@view/Bot/StoreMS.jsx'));
const OutBound = lazy(() => import('@src/component/Warehouse/OutBound.tsx'));
const NeedToShip = lazy(() => import('@src/component/Warehouse/NeedToShip.jsx'));
const InventoryReceived = lazy(() => import('@src/component/Warehouse/InventoryReceived.jsx'));
const SearchRecords = lazy(() => import('@src/component/Warehouse/SearchRecords.jsx'));
// const Configuration = lazy(() => import('component/Operation/Configuration'));
const ItemDetail = lazy(() => import('@src/component/ItemDetail/ItemDetail.jsx'));
const OperationCategory = lazy(() => import('@src/component/Operation/Category.tsx'));
const InitNewProdWorkflow = lazy(() => import('@src/component/Operation/InitWorkflow/InitWorkflow.tsx'));
const OperationProductList = lazy(() => import('@src/component/Operation/SkuManagement/OperationProductList.jsx'));


const routes = [
  {
    path: "*",
    element: <NotFound />
  },
  {
    index: true,
    path: "/",
    element: <Navigate to="/app/operation" replace />
  },
  {
    path: "deal-alert",
    children: [
      {
        index: true,
        element: <Alert />
      }, {
        path: "bestbuy-list",
        element: <StoreBB />,
        children: [
          {
            path: "item-detail",
            element: <ItemDetail />
          }
        ]
      }, {
        path: "microsoft-list",
        element: <StoreMS />,
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
        element: <OperationCategory />
      }, {
        path: "init-new-product",
        element: <InitNewProdWorkflow />
      }, {
        path: "amazon-products-list",
        element: <OperationProductList />
      }, {
        path: "amazon-surveillance",
        element: <ServiceMaintain />
      }, {
        path: "amazon-listing-template",
        element: <ServiceMaintain />
      }
    ]
  },
  {
    path: "outbound",
    children: [
      {
        index: true,
        element: <OutBound />
      }, {
        path: "needToShip",
        element: <NeedToShip />
      }, {
        path: "inventoryReceived",
        element: <InventoryReceived />
      }, {
        path: "searchRecord",
        element: <SearchRecords />
      }
    ]
  }
];

export default routes;
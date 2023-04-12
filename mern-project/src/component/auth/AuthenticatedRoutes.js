import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import NotFound from 'component/utility/NotFound';
import ServiceMaintain from 'component/utility/ServiceMaintain.tsx';
const Alert = lazy(() => import('component/SourceStore/Alert.tsx'));
const StoreBB = lazy(() => import('component/SourceStore/StoreBB.jsx'));
const StoreMS = lazy(() => import('component/SourceStore/StoreMS.jsx'));
const StoreWM = lazy(() => import('component/SourceStore/StoreWM.jsx'));
const OutBound = lazy(() => import('component/Warehouse/OutBound.tsx'));
const NeedToShip = lazy(() => import('component/Warehouse/NeedToShip.jsx'));
const InventoryReceived = lazy(() => import('component/Warehouse/InventoryReceived.jsx'));
const SearchRecords = lazy(() => import('component/Warehouse/SearchRecords.jsx'));
// const Configuration = lazy(() => import('component/Operation/Configuration'));
const ItemDetail = lazy(() => import('component/ItemDetail/ItemDetail.jsx'));
const OperationCategory = lazy(() => import('component/Operation/Category.tsx'));
const InitNewProdWorkflow = lazy(() => import('component/Operation/InitWorkflow/InitWorkflow.tsx'));
const OperationProductList = lazy(() => import('component/Operation/SkuManagement/OperationProductList.jsx'));


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
      }, {
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
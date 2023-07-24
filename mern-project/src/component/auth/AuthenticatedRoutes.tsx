import { lazy } from 'react';
import { Navigate, Outlet, RouteObject } from 'react-router-dom';
import NotFound from '@src/component/utils/NotFound';
import ServiceMaintain from '@src/component/utils/ServiceMaintain';
const Alert = lazy(() => import('@view/Bot/Alert.tsx'));
const BestbuyAlert = lazy(() => import('@view/Bot/Bestbuy.bot'));
const MicrosoftAlert = lazy(() => import('@view/Bot/Microsoft.bot'));
const OutBound = lazy(() => import('@view/Warehouse/OutBound.tsx'));
const NeedToShip = lazy(() => import('@view/Warehouse/NeedToShip.jsx'));
const InventoryReceived = lazy(() => import('@view/Warehouse/InventoryReceived.jsx'));
const SearchRecords = lazy(() => import('@view/Warehouse/SearchRecords'));
// const Configuration = lazy(() => import('component/Operation/Configuration'));
const DealDetail = lazy(() => import('@view/DealChart/DealDetail'));
const OperationCategory = lazy(() => import('@src/component/Operation/Category.tsx'));
const InitNewProdWorkflow = lazy(() => import('@src/component/Operation/InitWorkflow/InitWorkflow.tsx'));
const OperationProductList = lazy(() => import('@src/component/Operation/SkuManagement/OperationProductList.jsx'));


const routes: RouteObject[] = [
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
        children: [
          {
            index: true,
            element: <BestbuyAlert />,
          },
          {
            path: "detail/store/:storeId/id/:dealId/sku/:skuId",
            element: <DealDetail />
          }
        ]
      }, {
        path: "microsoft-list",
        children: [
          {
            index: true,
            element: <MicrosoftAlert />,
          }, {
            path: "detail/store/:storeId/id/:dealId/sku/:skuId",
            element: <DealDetail />
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
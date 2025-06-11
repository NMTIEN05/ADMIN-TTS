// main.route.tsx
import { createBrowserRouter } from "react-router-dom";
import Dashbroad from "../components/common/Dashbroad";
import Content from "../components/layouts/MainLayout";

import UserList from "../pages/userList";
import CategoryPage from "../pages/admin/categories";
import ProductPage from "@/pages/admin/products";
import ListOrders from "@/pages/admin/order/Listorder";
import OrderDetail from "@/pages/admin/order/OrderDetail";

export const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <Dashbroad />,
    children: [
      {
        path: "",
        element: <Content />,
        children: [
          {
            path: "users/list",
            element: <UserList />,
          },
          {
            path: "categories",
            element: <CategoryPage />,
          },
          {
            path: "products",
            element: <ProductPage />,
          },
          {
            path: "orders",
            element: <ListOrders />,
          },
          {
            path: "orders/:id",
            element: <OrderDetail />,
          },
        ],
      },
    ],
  },
]);

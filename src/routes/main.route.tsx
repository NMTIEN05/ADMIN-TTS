// main.route.tsx
import { createBrowserRouter } from "react-router-dom";
import Dashbroad from "../components/common/Layout";
import Content from "../components/layouts/MainLayout";

import UserList from "../pages/userList";
import CategoryPage from "../pages/admin/categories";
import ProductPage from "../pages/admin/products";
import AuthorPage from "../pages/admin/authors";
import CouponPage from "../pages/admin/coupons";
import OrderPage from "../pages/admin/orders";
import DashboardPage from "../pages/admin/dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashbroad />,
    children: [
      {
        path: "",
        element: <Content />,
        children: [
          {
            path: "",
            element: <DashboardPage />,
          },
          {
            path: "dashboard",
            element: <DashboardPage />,
          },
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
            path: "authors",
            element: <AuthorPage />,
          },
          {
            path: "coupons",
            element: <CouponPage />,
          },
          {
            path: "orders",
            element: <OrderPage />,
          },
        ],
      },
    ],
  },
]);
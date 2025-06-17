// main.route.tsx
import { createBrowserRouter } from "react-router-dom";
import Dashbroad from "../components/common/Dashbroad";
import Content from "../components/layouts/MainLayout";

import LoginPage from "../pages/auth/Login";
import UserList from "../pages/userList";
import UsersPage from "../pages/admin/users";
import CategoryPage from "../pages/admin/categories";
import ProductPage from "../pages/admin/products";
import AuthorsPage from "../pages/admin/authors";
import CouponsPage from "../pages/admin/coupons";
import ReviewsPage from "../pages/admin/reviews";
import CartsPage from "../pages/admin/carts";
import WishlistsPage from "../pages/admin/wishlists";
import PaymentsPage from "../pages/admin/payments";
import ListOrders from "../pages/admin/order/ListOrder";
import OrderDetail from "../pages/admin/order/OrderDetail";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
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
            path: "authors",
            element: <AuthorsPage />,
          },
          {
            path: "coupons",
            element: <CouponsPage />,
          },
          {
            path: "orders",
            element: <ListOrders />,
          },
          {
            path: "orders/:id",
            element: <OrderDetail />,
          },
          {
            path: "users",
            element: <UsersPage />,
          },
          {
            path: "reviews",
            element: <ReviewsPage />,
          },
          {
            path: "carts",
            element: <CartsPage />,
          },
          {
            path: "wishlists",
            element: <WishlistsPage />,
          },
          {
            path: "payments",
            element: <PaymentsPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/",
    element: <LoginPage />,
  },
]);
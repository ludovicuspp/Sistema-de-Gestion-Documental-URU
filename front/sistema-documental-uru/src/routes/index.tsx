import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { Layout } from "@/components/templates/Layout";
import { LoginPage } from "@/pages/auth";
import { AdminDashboardPage } from "@/pages/admin";

/**
 * Routes grouped by role/functionality:
 * - /auth/*     → Auth (login, register, forgot password)
 * - /admin/*    → Admin panel and modules
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <LoginPage />
      </Layout>
    ),
  },
  {
    path: "/admin",
    element: (
      <Layout>
        <AdminDashboardPage />
      </Layout>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;

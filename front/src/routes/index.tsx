import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { Layout } from "@/components/templates/Layout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoginPage } from "@/pages/auth";
import { AdminDashboardPage, TaskManagementPage, UserManagementPage } from "@/pages/admin";

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
    path: "/admin/users",
    element: (
      <ErrorBoundary>
        <Layout>
          <UserManagementPage />
        </Layout>
      </ErrorBoundary>
    ),
  },
  {
    path: "/admin/tasks",
    element: (
      <ErrorBoundary>
        <Layout>
          <TaskManagementPage />
        </Layout>
      </ErrorBoundary>
    ),
  },
  {
    path: "/admin",
    element: (
      <ErrorBoundary>
        <Layout>
          <AdminDashboardPage />
        </Layout>
      </ErrorBoundary>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;

import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { Layout } from "@/components/templates/Layout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoginPage } from "@/pages/auth";
import {
  AdminDashboardPage,
  TaskManagementPage,
  UserManagementPage,
  StudentManagementPage,
  ReportsPage,
  DocumentManagementPage,
  RecordManagementPage,
  RequestManagementPage,
} from "@/pages/admin";
import { VerifierDashboardPage } from "@/pages/verifier";

/**
 * Routes grouped by role/functionality:
 * - /auth/*     → Auth (login, register, forgot password)
 * - /admin/*    → Admin panel and modules
 * - /verifier   → Verifier role dashboard
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
    path: "/admin/students",
    element: (
      <ErrorBoundary>
        <Layout>
          <StudentManagementPage />
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
    path: "/verifier",
    element: (
      <ErrorBoundary>
        <Layout>
          <VerifierDashboardPage />
        </Layout>
      </ErrorBoundary>
    ),
  },
  {
    path: "/admin/reports",
    element: (
      <ErrorBoundary>
        <Layout>
          <ReportsPage />
        </Layout>
      </ErrorBoundary>
    ),
  },
  {
    path: "/admin/documents",
    element: (
      <ErrorBoundary>
        <Layout>
          <DocumentManagementPage />
        </Layout>
      </ErrorBoundary>
    ),
  },
  {
    path: "/admin/records",
    element: (
      <ErrorBoundary>
        <Layout>
          <RecordManagementPage />
        </Layout>
      </ErrorBoundary>
    ),
  },
  {
    path: "/admin/requests",
    element: (
      <ErrorBoundary>
        <Layout>
          <RequestManagementPage />
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

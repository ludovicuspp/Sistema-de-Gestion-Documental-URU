import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { Layout } from "@/components/templates/Layout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoginPage } from "@/pages/auth";
import {
  AdminDashboardPage,
  AdminConfigurationPage,
  TaskManagementPage,
  UserManagementPage,
  StudentManagementPage,
  ReportsPage,
  DocumentManagementPage,
  RecordManagementPage,
  RequestManagementPage,
} from "@/pages/admin";
import { VerifierDashboardPage, VerifierStudentManagementPage, VerifierTaskManagementPage, VerifierRecordManagementPage, VerifierDocumentManagementPage, VerifierRequestManagementPage } from "@/pages/verifier";
import {
  AssistantDashboardPage,
  AssistantRecordManagementPage,
  AssistantDocumentManagementPage,
  AssistantRequestManagementPage,
  AssistantTaskManagementPage,
  AssistantShortcutsPage,
  AssistantConfigurationPage,
} from "@/pages/assistant";

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
    path: "/verifier/students",
    element: (
      <ErrorBoundary>
        <Layout>
          <VerifierStudentManagementPage />
        </Layout>
      </ErrorBoundary>
    ),
  },
  {
    path: "/verifier/tasks",
    element: (
      <ErrorBoundary>
        <Layout>
          <VerifierTaskManagementPage />
        </Layout>
      </ErrorBoundary>
    ),
  },
  {
    path: "/verifier/records",
    element: (
      <ErrorBoundary>
        <Layout>
          <VerifierRecordManagementPage />
        </Layout>
      </ErrorBoundary>
    ),
  },
  {
    path: "/verifier/documents",
    element: (
      <ErrorBoundary>
        <Layout>
          <VerifierDocumentManagementPage />
        </Layout>
      </ErrorBoundary>
    ),
  },
  {
    path: "/verifier/requests",
    element: (
      <ErrorBoundary>
        <Layout>
          <VerifierRequestManagementPage />
        </Layout>
      </ErrorBoundary>
    ),
  },
  {
    path: "/assistant",
    element: (
      <ErrorBoundary>
        <Layout>
          <AssistantDashboardPage />
        </Layout>
      </ErrorBoundary>
    ),
  },
  {
    path: "/assistant/records",
    element: (
      <ErrorBoundary>
        <Layout>
          <AssistantRecordManagementPage />
        </Layout>
      </ErrorBoundary>
    ),
  },
  {
    path: "/assistant/documents",
    element: (
      <ErrorBoundary>
        <Layout>
          <AssistantDocumentManagementPage />
        </Layout>
      </ErrorBoundary>
    ),
  },
  {
    path: "/assistant/requests",
    element: (
      <ErrorBoundary>
        <Layout>
          <AssistantRequestManagementPage />
        </Layout>
      </ErrorBoundary>
    ),
  },
  {
    path: "/assistant/tasks",
    element: (
      <ErrorBoundary>
        <Layout>
          <AssistantTaskManagementPage />
        </Layout>
      </ErrorBoundary>
    ),
  },
  {
    path: "/assistant/shortcuts",
    element: (
      <ErrorBoundary>
        <Layout>
          <AssistantShortcutsPage />
        </Layout>
      </ErrorBoundary>
    ),
  },
  {
    path: "/assistant/config",
    element: (
      <ErrorBoundary>
        <Layout>
          <AssistantConfigurationPage />
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
    path: "/admin/config",
    element: (
      <ErrorBoundary>
        <Layout>
          <AdminConfigurationPage />
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

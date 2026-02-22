import { AdminHeader } from "@/components/organisms/AdminHeader";
import { Sidebar } from "@/components/organisms/Sidebar";
import type { SidebarNavItem, SidebarTaskItem } from "@/components/organisms/Sidebar";
import { Footer } from "@/components/organisms/Footer";
import "./DashboardTemplate.css";

export interface DashboardTemplateProps {
  children: React.ReactNode;
  /** Optional content below sidebar nav (e.g. Bandeja de verificación in Gestión de documentos). */
  sidebarContent?: React.ReactNode;
  /** Override sidebar modules (e.g. for Verifier role). */
  sidebarModules?: SidebarNavItem[];
  /** Hide "Crear usuario" in sidebar (e.g. for Verifier). Default false. */
  sidebarShowCreateUser?: boolean;
  /** Optional task items for sidebar "Tareas" section. */
  sidebarTaskItems?: SidebarTaskItem[];
  /** Sidebar section labels (e.g. for English Verifier view). */
  sidebarModulesTitle?: string;
  sidebarTasksTitle?: string;
  sidebarEmptyTasksText?: string;
  sidebarRefreshButtonText?: string;
  /** Header logo/home link path (e.g. "/assistant" for assistant role). Default: "/admin". */
  headerHomePath?: string;
  /** Header logout button label (e.g. "Log out" for English). */
  headerLogoutButtonText?: string;
  currentView?: string;
  userRole?: string;
  userEmail?: string;
  onLogout?: () => void;
  onCreateUser?: () => void;
  onRefresh?: () => void;
  onPrivacyClick?: () => void;
}

/**
 * DashboardTemplate - Template
 *
 * Layout for admin panel pages: header, sidebar, main content and footer.
 * Same structure as AuthTemplate (template + children), used for the dashboard.
 */
export const DashboardTemplate = ({
  children,
  sidebarContent,
  sidebarModules,
  sidebarShowCreateUser,
  sidebarTaskItems,
  sidebarModulesTitle,
  sidebarTasksTitle,
  sidebarEmptyTasksText,
  sidebarRefreshButtonText,
  headerHomePath,
  headerLogoutButtonText,
  currentView,
  userRole,
  userEmail,
  onLogout,
  onCreateUser,
  onRefresh,
  onPrivacyClick,
}: DashboardTemplateProps) => {
  return (
    <div className="dashboard-template">
      <AdminHeader
        currentView={currentView}
        userRole={userRole}
        userEmail={userEmail}
        homePath={headerHomePath}
        logoutButtonText={headerLogoutButtonText}
        onLogout={onLogout}
      />
      <div className="dashboard-template__body">
        <div className="dashboard-template__aside">
          <Sidebar
            modules={sidebarModules}
            showCreateUser={sidebarShowCreateUser}
            taskItems={sidebarTaskItems}
            modulesTitle={sidebarModulesTitle}
            tasksTitle={sidebarTasksTitle}
            emptyTasksText={sidebarEmptyTasksText}
            refreshButtonText={sidebarRefreshButtonText}
            onCreateUser={onCreateUser}
            onRefresh={onRefresh}
          />
          {sidebarContent != null && (
            <div className="dashboard-template__sidebar-content">
              {sidebarContent}
            </div>
          )}
        </div>
        <main className="dashboard-template__main">{children}</main>
      </div>
      <Footer onPrivacyClick={onPrivacyClick} />
    </div>
  );
};

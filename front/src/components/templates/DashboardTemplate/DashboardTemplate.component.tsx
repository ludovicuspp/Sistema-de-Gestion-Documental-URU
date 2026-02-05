import { AdminHeader } from "@/components/organisms/AdminHeader";
import { Sidebar } from "@/components/organisms/Sidebar";
import { Footer } from "@/components/organisms/Footer";
import "./DashboardTemplate.css";

export interface DashboardTemplateProps {
  children: React.ReactNode;
  /** Optional content below sidebar nav (e.g. Bandeja de verificación in Gestión de documentos). */
  sidebarContent?: React.ReactNode;
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
 * Similar a AuthTemplate en estructura (template + children), aplicado al dashboard.
 */
export const DashboardTemplate = ({
  children,
  sidebarContent,
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
        onLogout={onLogout}
      />
      <div className="dashboard-template__body">
        <div className="dashboard-template__aside">
          <Sidebar onCreateUser={onCreateUser} onRefresh={onRefresh} />
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

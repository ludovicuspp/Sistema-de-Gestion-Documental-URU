import { AdminHeader } from "@/components/organisms/AdminHeader";
import { Sidebar } from "@/components/organisms/Sidebar";
import { Footer } from "@/components/organisms/Footer";
import "./DashboardTemplate.css";

export interface DashboardTemplateProps {
  children: React.ReactNode;
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
        <Sidebar onCreateUser={onCreateUser} onRefresh={onRefresh} />
        <main className="dashboard-template__main">{children}</main>
      </div>
      <Footer onPrivacyClick={onPrivacyClick} />
    </div>
  );
};

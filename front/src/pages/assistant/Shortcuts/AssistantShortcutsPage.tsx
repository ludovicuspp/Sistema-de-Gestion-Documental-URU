import { useNavigate } from "react-router-dom";
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { Card } from "@/components/molecules/Card";
import { Button } from "@/components/atoms/Button";
import { ASSISTANT_SIDEBAR_MODULES } from "@/components/organisms/Sidebar";
import "./AssistantShortcutsPage.css";

export const AssistantShortcutsPage = () => {
  const navigate = useNavigate();

  const shortcuts = [
    { label: "Crear expediente", path: "/assistant/records" },
    { label: "Subir documento", path: "/assistant/documents" },
    { label: "Ver solicitudes", path: "/assistant/requests" },
    { label: "Mis tareas", path: "/assistant/tasks" },
  ];

  return (
    <DashboardTemplate
      currentView="Atajos"
      userRole="Asistente"
      userEmail="username@mail.co"
      onLogout={() => navigate("/")}
      onRefresh={() => globalThis.location.reload()}
      onPrivacyClick={() => {}}
      sidebarModules={ASSISTANT_SIDEBAR_MODULES}
      sidebarShowCreateUser={false}
      sidebarTaskItems={[]}
    >
      <div className="assistant-shortcuts">
        <Card variant="elevated" className="assistant-shortcuts__card">
          <h3 className="assistant-shortcuts__title">Accesos rápidos</h3>
          <p className="assistant-shortcuts__desc">Accede rápidamente a las funciones más utilizadas.</p>
          <div className="assistant-shortcuts__grid">
            {shortcuts.map((s) => (
              <Button
                key={s.path}
                variant="secondary"
                onClick={() => navigate(s.path)}
                className="assistant-shortcuts__btn"
              >
                {s.label}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </DashboardTemplate>
  );
};

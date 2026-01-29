import "./Layout.css";

export interface LayoutProps {
  /**
   * Main content of the layout
   */
  children: React.ReactNode;
  /**
   * Clase CSS adicional
   */
  className?: string;
}

/**
 * Componente Layout - Template
 *
 * Contenedor global de la aplicación que cubre toda la pantalla completa.
 * No permite scroll y mantiene el contenido dentro de los límites del viewport.
 *
 * @example
 * ```tsx
 * <Layout>
 *   <Header />
 *   <MainContent />
 *   <Footer />
 * </Layout>
 * ```
 */
export const Layout = ({ children, className = "" }: LayoutProps) => {
  const layoutClasses = ["layout", className].filter(Boolean).join(" ");

  return (
    <div className={layoutClasses}>
      <div className="layout__content">{children}</div>
    </div>
  );
};

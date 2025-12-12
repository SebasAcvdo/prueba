import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import styles from './Layout.module.css';

export const Layout = ({ children, title }) => {
  // Detectar si es desktop al cargar
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 1024);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth > 1024);

  // Actualizar cuando cambie el tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth > 1024;
      setIsDesktop(desktop);
      
      if (desktop) {
        setSidebarOpen(true); // En desktop siempre visible
      } else {
        setSidebarOpen(false); // En mobile/tablet oculta por defecto
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMenuClick = () => {
    // Solo toggle en mobile/tablet, en desktop no hacer nada
    if (!isDesktop) {
      setSidebarOpen(!sidebarOpen);
    }
  };

  return (
    <div className={styles.layout}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className={styles.main}>
        <TopBar onMenuClick={handleMenuClick} title={title} />
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
};

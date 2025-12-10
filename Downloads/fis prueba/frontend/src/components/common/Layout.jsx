import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import styles from './Layout.module.css';

export const Layout = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className={`${styles.main} ${sidebarOpen ? '' : styles.collapsed}`}>
        <TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} title={title} />
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
};

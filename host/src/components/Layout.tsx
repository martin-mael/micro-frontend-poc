import { Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import type { RemoteAppConfig } from '../types/remote-app';
import { useSpeculationRules } from '../hooks/useSpeculationRules';
import { Counter } from './Counter';
import { UserContextProvider } from '../contexts/UserContext';
import { Logout } from './Logout';
// import { usePreloadRemoteApp } from '../hooks/usePreloadRemoteApp';

interface LayoutProps {
  children: React.ReactNode;
  remoteApps: RemoteAppConfig[];
}

const Layout = ({ children, remoteApps }: LayoutProps) => {
  // const { preloadManifest } = usePreloadRemoteApp();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const rootUrls = remoteApps.map((app) => app.routes[0]);
  useSpeculationRules(rootUrls);

  return (
    <UserContextProvider>
      <div className="layout">
        <motion.aside
          initial={false}
          animate={{ width: isCollapsed ? 64 : 240 }}
          className="sidebar"
        >
          <button onClick={() => setIsCollapsed(!isCollapsed)}>{isCollapsed ? '→' : '←'}</button>
          <nav>
            {remoteApps.map((app) => (
              <NavLink
                key={app.name}
                to={app.routes[0]}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                // onMouseEnter={() => preloadManifest(app.manifestUrl)}
              >
                {app.name}
              </NavLink>
            ))}
          </nav>
          <Counter />
          <Logout />
        </motion.aside>
        <main className="content">
          <Suspense fallback={<div>Chargement...</div>}>{children}</Suspense>
        </main>
      </div>
    </UserContextProvider>
  );
};

export default Layout;

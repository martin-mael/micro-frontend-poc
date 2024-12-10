import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import type { RemoteAppConfig } from './types/remote-app';
import { PersistentRemoteApp } from './components/PersistentRemoteApp';
import { useEffect } from 'react';
import './App.css';
import { useAtomValue } from 'jotai';
import { customEventAtom } from './lib/jotai';

const remoteApps: RemoteAppConfig[] = [
  {
    name: 'Tasks',
    routes: ['/tasks', '/tasks/*'],
    manifestUrl: `https://${import.meta.env.HOST}:4173/manifest.wc.json`,
    webComponentTag: 'task-web-component',
    attributes: {
      'loading-delay': '500',
      'route-basename': '/tasks',
      'api-baseurl': `https://${import.meta.env.HOST}:4173/api`
    }
  },
  {
    name: 'Calendar',
    routes: ['/calendar', '/calendar/*'],
    manifestUrl: `https://${import.meta.env.HOST}:4174/manifest.wc.json`,
    webComponentTag: 'calendar-web-component',
    attributes: {
      'loading-delay': '1500',
      'route-basename': '/calendar',
      'api-baseurl': `https://${import.meta.env.HOST}:4174/api`
    }
  }
];

function App() {
  const customData = useAtomValue(customEventAtom);
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    if (customData) {
      customData.fn();
    }
  }, [customData]);

  useEffect(() => {
    document.startViewTransition?.(() => {
      document.documentElement.setAttribute('data-route', currentPath);
    });
  }, [currentPath]);

  return (
    <>
      <div id="additionnal-content" />
      <Layout remoteApps={remoteApps}>
        {remoteApps.map((app) => (
          <PersistentRemoteApp
            key={app.name}
            config={app}
            isActive={app.routes.some((route) => currentPath.startsWith(route.replace('/*', '')))}
            style={{
              viewTransitionName: `remote-app-${app.name.toLowerCase()}`
            }}
          />
        ))}
        <Routes location={location}>
          <Route path="/" element={<Navigate to="/tasks" replace />} />
          {remoteApps.map((app) => (
            <Route
              key={app.name}
              path={`${app.routes[0]}/*`}
              element={<div />} // Empty element to capture sub-routes
            />
          ))}
        </Routes>
      </Layout>
    </>
  );
}

export default function WrappedApp() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </BrowserRouter>
  );
}

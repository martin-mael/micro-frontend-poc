import { ReactNode, useEffect } from 'react';

import Authentication, { IEDUser } from '@fulll/mui-auth';

import { createContext } from './createContext';
import { useAtom, useAtomValue } from 'jotai';
import { loadedRemotesAtom, userAtom } from '../lib/jotai';
import usePrevious from '../hooks/usePrevious';

type UserContextType = {
  user: IEDUser | null;
};

const authConfig = {
  mediaBackground: '/images/auth-bg.png',
  logo: '/images/fulll.png',
  api: 'https://auth-fulll.fulll.ninja',
  defaultLocale: 'fr',
  entityName: 'fulll',
  portal: 'https://www-fulll.fulll.ninja/'
} as const;

const [userContextHook, UserContextProviderComponent] = createContext<UserContextType>();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = userContextHook;

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const loadedRemotes = useAtomValue(loadedRemotesAtom);

  const loadedRemotesCount = Object.values(loadedRemotes).filter(Boolean).length;
  const previousLoadedRemotesCount = usePrevious(loadedRemotesCount) ?? 0;

  const [user, setUser] = useAtom(userAtom);

  const trackingEnv = 'dev';
  const afterLogin = (user: IEDUser) => {
    setUser(user);
  };

  const afterLogout = () => {
    setUser(null);
  };

  useEffect(() => {
    if (loadedRemotesCount > previousLoadedRemotesCount) {
      setUser(user);
    }
  }, [loadedRemotesCount, previousLoadedRemotesCount, setUser, user]);

  return (
    <UserContextProviderComponent value={{ user }}>
      <Authentication
        afterLogin={afterLogin}
        blur
        configuration={authConfig}
        afterLogout={afterLogout}
        translate={(str: string) => str}
        trackingClientParameters={{
          environment: trackingEnv,
          platform: 'fulll',
          appSlug: 'ibiza-accounting',
          trackLogin: false
        }}
      >
        {user && children}
      </Authentication>
    </UserContextProviderComponent>
  );
};

import { IEDUser } from '@fulll/mui-auth';
import { atomWithBroadcast, atomWithCustomEvent } from '@micro-frontend/shared';
import { useAtom } from 'jotai';

export const [userAtom, useUserListener] = atomWithBroadcast<IEDUser | null>('user', null);

export const [countAtom, useCountListener] = atomWithBroadcast('count', {
  value: 0,
  sentAt: new Date()
});

export const [loadedRemotesAtom, useLoadedRemotesListener] = atomWithBroadcast<{
  task: boolean;
  calendar: boolean;
}>('loadedRemotes', { task: false, calendar: false });

export const [componentAtom] = atomWithBroadcast('component-test', {
  component: function () {
    console.log('component');
  }
});

export const [customEventAtom] = atomWithCustomEvent('custom-event', {
  fn: () => {
    console.log('custom event defined in host');
  }
});

export const useUser = () => {
  return useAtom(userAtom);
};

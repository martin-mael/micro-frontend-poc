import { IEDUser } from '@fulll/mui-auth';
import { atomWithBroadcast, atomWithCustomEvent } from '@micro-frontend/shared';
import { atomWithStorage } from 'jotai/utils';
export const [userAtom] = atomWithBroadcast<IEDUser | null>('user', null);

export const [loadedRemotesAtom, useLoaderRemotesListener] = atomWithBroadcast<{
  task: boolean;
  calendar: boolean;
}>('loadedRemotes', { task: false, calendar: false });

export const [componentAtom] = atomWithBroadcast<{ component: () => void }>('component-test', {
  component: () => {
    console.log('running function');
  }
});

export const [customEventAtom] = atomWithCustomEvent('custom-event', {
  fn: () => {
    console.log('custom event defined in task');
  }
});

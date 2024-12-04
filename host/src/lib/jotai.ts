import { IEDUser } from '@fulll/mui-auth';
import { atomWithBroadcast } from '@micro-frontend/shared';

export const userAtom = atomWithBroadcast<IEDUser | null>('user', null);

export const loadedRemotesAtom = atomWithBroadcast<{
  task: boolean;
  calendar: boolean;
}>('loadedRemotes', { task: false, calendar: false });

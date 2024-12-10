import { atomWithBroadcast } from '@micro-frontend/shared';

export const [loadedRemotesAtom, useLoaderRemotesListener] = atomWithBroadcast<{
  task: boolean;
  calendar: boolean;
}>('loadedRemotes', { task: false, calendar: false });

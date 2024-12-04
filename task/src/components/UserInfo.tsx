import { useAtom } from 'jotai';
import { userAtom } from '../lib/jotai';

export const UserInfo = () => {
  const [user] = useAtom(userAtom);
  console.log('user', user);

  return (
    <div>
      {user?.firstname} {user?.lastname}
    </div>
  );
};

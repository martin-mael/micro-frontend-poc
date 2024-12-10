import { useAtom } from 'jotai';
import { userAtom } from '../lib/jotai';
import { useLocation } from 'react-router-dom';

export const UserInfo = () => {
  useLocation();

  const [user] = useAtom(userAtom);
  console.log('user', user);

  return (
    <div>
      user: {user?.firstname} {user?.lastname}
    </div>
  );
};

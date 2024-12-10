import { atomWithBroadcast } from '@micro-frontend/shared';
import { useAtom } from 'jotai';
import { useLocation } from 'react-router-dom';

const [countAtom] = atomWithBroadcast('count', { value: 0, sentAt: new Date() });

export const Counter = () => {
  const { pathname } = useLocation();
  const [count, setCount] = useAtom(countAtom);

  console.log('pathname', pathname);

  return (
    <button
      onClick={() => {
        setCount((v) => ({ value: v.value + 1, sentAt: new Date() }));
      }}
    >
      Count is :{count.value}
    </button>
  );
};

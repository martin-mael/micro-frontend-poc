import { useAtom } from 'jotai';
import { countAtom } from '../lib/jotai';

export const Counter = () => {
  const [count, setCount] = useAtom(countAtom);

  console.log('count', count);

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

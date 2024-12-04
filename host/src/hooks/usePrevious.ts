import { useRef, useEffect, useState } from 'react';

/**
 * A custom React hook that stores and returns the previous value of a given state.
 *
 * @template T - The type of the value being tracked
 * @param value - The current value to track
 * @returns The previous value of type T or undefined if there was no previous value
 *
 * @example
 * ```typescript
 * const [count, setCount] = useState(0);
 * const previousCount = usePrevious(count);
 * // When count changes from 0 to 1, previousCount will be 0
 * ```
 */
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T | undefined>(undefined);
  const [previous, setPrevious] = useState<T | undefined>(undefined);
  useEffect(() => {
    setPrevious(ref.current);
    ref.current = value;
  }, [value]);
  return previous;
};

export default usePrevious;

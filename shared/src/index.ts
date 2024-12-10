import { atom, Getter, Setter, useSetAtom, type SetStateAction } from 'jotai';
import { useEffect } from 'react';

type Callback<Value> = (get: Getter, set: Setter, newVal: Value) => void;

export function atomWithBroadcast<Value>(key: string, initialValue: Value) {
  const baseAtom = atom(initialValue);
  const listeners = new Set<(event: MessageEvent<any>) => void>();
  const updateObservers = atom<Callback<Value>[]>([]);
  const channel = new BroadcastChannel(key);

  channel.onmessage = (event) => {
    listeners.forEach((l) => l(event));
  };

  const broadcastAtom = atom(
    (get) => get(baseAtom),
    (get, set, update: { isEvent: boolean; value: SetStateAction<Value> }) => {
      set(baseAtom, update.value);
      const newVal = get(baseAtom);
      get(updateObservers).forEach((callback) => {
        callback(get, set, newVal);
      });
      if (!update.isEvent) {
        channel.postMessage(newVal);
      }
    }
  );

  broadcastAtom.onMount = (setAtom) => {
    const listener = (event: MessageEvent<any>) => {
      setAtom({ isEvent: true, value: event.data });
    };

    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  };

  const returnedAtom = atom(
    (get) => get(broadcastAtom),
    (_get, set, update: SetStateAction<Value>) => {
      set(broadcastAtom, { isEvent: false, value: update });
    }
  );

  const useObserver = (callback: Callback<Value>) => {
    const setObservers = useSetAtom(updateObservers);
    useEffect(() => {
      setObservers((prev) => [...prev, callback]);
      return () =>
        setObservers((prev) => {
          const index = prev.indexOf(callback);
          return [...prev.slice(0, index), ...prev.slice(index + 1)];
        });
    }, [setObservers, callback]);
  };

  return [returnedAtom, useObserver] as const;
}

export function atomWithCustomEvent<Value>(key: string, initialValue: Value) {
  const baseAtom = atom(initialValue);
  const updateObservers = atom<Callback<Value>[]>([]);

  const customAtom = atom(
    (get) => get(baseAtom),
    (get, set, update: { isEvent: boolean; value: SetStateAction<Value> }) => {
      set(baseAtom, update.value);
      const newVal = get(baseAtom);
      get(updateObservers).forEach((callback) => {
        callback(get, set, newVal);
      });
      if (!update.isEvent) {
        window.dispatchEvent(new CustomEvent(key, { detail: newVal }));
      }
    }
  );

  customAtom.onMount = (setAtom) => {
    const listener = (event: CustomEvent<any>) => {
      setAtom({ isEvent: true, value: event.detail });
    };

    window.addEventListener(key, listener as EventListener);

    return () => {
      window.removeEventListener(key, listener as EventListener);
    };
  };

  const returnedAtom = atom(
    (get) => get(customAtom),
    (_get, set, update: SetStateAction<Value>) => {
      set(customAtom, { isEvent: false, value: update });
    }
  );

  const useObserver = (callback: Callback<Value>) => {
    const setObservers = useSetAtom(updateObservers);
    useEffect(() => {
      setObservers((prev) => [...prev, callback]);
      return () =>
        setObservers((prev) => {
          const index = prev.indexOf(callback);
          return [...prev.slice(0, index), ...prev.slice(index + 1)];
        });
    }, [setObservers, callback]);
  };

  return [returnedAtom, useObserver] as const;
}

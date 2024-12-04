import { createContext as createReactContext, useContext as useReactContext } from 'react';

export function createContext<A extends object | null>() {
  const context = createReactContext<A | undefined>(undefined);

  const useContext = () => {
    const _context = useReactContext(context);
    if (_context === undefined)
      throw new Error('useContext must be inside a Provider with a value');
    return _context;
  };
  return [useContext, context.Provider] as const;
}

import { createContext, useContext, useState, ReactNode } from 'react';
import { mockNetworks } from '../data/networks';

// ─── Types ────────────────────────────────────────────────────────────────────

export type AppContextValue =
  | { type: 'network'; networkId: string }
  | { type: 'group'; networkId: string; groupId: string };

type GlideContextType = {
  context: AppContextValue;
  setContext: (ctx: AppContextValue) => void;
  isNetworkView: boolean;
  isGroupView: boolean;
};

// ─── Context ──────────────────────────────────────────────────────────────────

const GlideContext = createContext<GlideContextType | null>(null);

// Default: first group of first network
const DEFAULT_CONTEXT: AppContextValue = {
  type: 'group',
  networkId: mockNetworks[0].id,
  groupId: mockNetworks[0].groups[0].id,
};

export function GlideProvider({ children }: { children: ReactNode }) {
  const [context, setContext] = useState<AppContextValue>(DEFAULT_CONTEXT);

  return (
    <GlideContext.Provider
      value={{
        context,
        setContext,
        isNetworkView: context.type === 'network',
        isGroupView: context.type === 'group',
      }}
    >
      {children}
    </GlideContext.Provider>
  );
}

export function useGlide(): GlideContextType {
  const ctx = useContext(GlideContext);
  if (!ctx) throw new Error('useGlide must be used inside <GlideProvider>');
  return ctx;
}

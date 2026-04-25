import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Globe, Check, Plus } from 'lucide-react';
import { useGlide } from '../context/GlideContext';
import { mockNetworks, getInitials, getNetworkById, getGroupById } from '../data/networks';

// ─── GroupAvatar ──────────────────────────────────────────────────────────────
function Avatar({ name, size = 'sm' }: { name: string; size?: 'sm' | 'xs' }) {
  const dim = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-5 h-5 text-[10px]';
  return (
    <div className={`${dim} rounded-md bg-gradient-to-br from-primary/60 to-accent/60 flex items-center justify-center font-semibold text-white shrink-0`}>
      {getInitials(name)}
    </div>
  );
}

// ─── Current label ────────────────────────────────────────────────────────────
function CurrentLabel({ collapsed }: { collapsed: boolean }) {
  const { context } = useGlide();

  if (context.type === 'network') {
    const network = getNetworkById(context.networkId);
    if (!network) return null;
    return (
      <div className={`flex items-center gap-2.5 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-indigo-500/70 to-cyan-500/70 flex items-center justify-center shrink-0">
          <Globe className="w-3.5 h-3.5 text-white" />
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-text-primary truncate">{network.name}</div>
            <div className="text-[11px] text-text-muted leading-none mt-0.5">
              Network · {network.groups.length} groups
            </div>
          </div>
        )}
      </div>
    );
  }

  // group view
  const group = getGroupById((context as { type: 'group'; groupId: string }).groupId);
  const network = getNetworkById(context.networkId);
  if (!group || !network) return null;

  return (
    <div className={`flex items-center gap-2.5 ${collapsed ? 'justify-center' : ''}`}>
      <Avatar name={group.name} />
      {!collapsed && (
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-text-primary truncate">{group.name}</div>
          <div className="text-[11px] text-text-muted leading-none mt-0.5 truncate">
            Group · {network.name}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ContextSwitcher({ collapsed }: { collapsed: boolean }) {
  const { context, setContext } = useGlide();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  function switchToNetwork(networkId: string) {
    setContext({ type: 'network', networkId });
    navigate('/network');
    setOpen(false);
  }

  function switchToGroup(networkId: string, groupId: string) {
    setContext({ type: 'group', networkId, groupId });
    navigate('/dashboard');
    setOpen(false);
  }

  function isCurrentNetwork(networkId: string) {
    return context.type === 'network' && context.networkId === networkId;
  }

  function isCurrentGroup(groupId: string) {
    return context.type === 'group' && (context as { groupId: string }).groupId === groupId;
  }

  return (
    <div ref={ref} className="relative px-3 pb-2 pt-1">
      <button
        onClick={() => !collapsed && setOpen((o) => !o)}
        title={collapsed ? 'Switch context' : undefined}
        className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border hover:border-primary/40 hover:bg-surface transition-all ${
          open ? 'border-primary/40 bg-surface' : ''
        }`}
      >
        <CurrentLabel collapsed={collapsed} />
        {!collapsed && (
          <ChevronDown
            className={`w-3.5 h-3.5 text-text-muted shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        )}
      </button>

      {/* Dropdown */}
      {open && !collapsed && (
        <div className="absolute left-3 right-3 top-full mt-1 z-50 bg-surface-2 border border-border rounded-xl shadow-[0_25px_50px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* Networks + Groups tree */}
          <div className="py-1.5">
            <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
              Your Networks
            </div>

            {mockNetworks.map((network) => (
              <div key={network.id}>
                {/* Network row */}
                <button
                  onClick={() => switchToNetwork(network.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 hover:bg-sidebar-accent transition-colors ${
                    isCurrentNetwork(network.id) ? 'bg-primary/10' : ''
                  }`}
                >
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500/60 to-cyan-500/60 flex items-center justify-center shrink-0">
                    <Globe className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="text-sm font-semibold text-text-primary truncate">{network.name}</div>
                    <div className="text-[10px] text-text-muted">{network.groups.length} groups</div>
                  </div>
                  {isCurrentNetwork(network.id) && (
                    <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                  )}
                </button>

                {/* Group rows — indented */}
                {network.groups.map((group, idx) => (
                  <button
                    key={group.id}
                    onClick={() => switchToGroup(network.id, group.id)}
                    className={`w-full flex items-center gap-2.5 pl-8 pr-3 py-1.5 hover:bg-sidebar-accent transition-colors ${
                      isCurrentGroup(group.id) ? 'bg-primary/10' : ''
                    }`}
                  >
                    {/* Tree line visual */}
                    <div className="relative flex items-center shrink-0">
                      <div className={`absolute -left-4 w-3 border-l border-b border-border rounded-bl ${idx === network.groups.length - 1 ? 'h-3' : 'h-full'}`} style={{ top: idx === 0 ? '50%' : 0 }} />
                    </div>
                    <Avatar name={group.name} size="xs" />
                    <div className="flex-1 text-left min-w-0">
                      <div className="text-sm text-text-secondary truncate">{group.name}</div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`w-1.5 h-1.5 rounded-full ${group.botActive ? 'bg-success' : 'bg-text-muted'}`} />
                      {isCurrentGroup(group.id) && (
                        <Check className="w-3.5 h-3.5 text-primary" />
                      )}
                    </div>
                  </button>
                ))}

                {/* Divider between networks */}
                <div className="my-1 mx-3 h-px bg-border" />
              </div>
            ))}
          </div>

          {/* Footer action */}
          <div className="border-t border-border">
            <button className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-sidebar-accent transition-colors">
              <Plus className="w-3.5 h-3.5" />
              Create new network
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

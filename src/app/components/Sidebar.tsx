import {
  LayoutDashboard, BarChart3, Users, History, AlertTriangle,
  Zap, Filter, Bolt, MessageSquare, Clock,
  Trophy, Share2, Link2, ClipboardList,
  Settings, Shield, Command,
  ChevronLeft, ChevronRight, ChevronDown,
  Globe, GitCompare, Radio, BookUser, ScrollText,
  Layers, SlidersHorizontal, UserCog, LogOut,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useGlide } from '../context/GlideContext';
import ContextSwitcher from './ContextSwitcher';

// ─── Types ────────────────────────────────────────────────────────────────────
type NavChild = { name: string; icon: React.ElementType; href: string };
type NavItem  = { name: string; icon: React.ElementType; href: string; badge?: string; children?: NavChild[] };
type NavSection = { section: string; items: NavItem[] };

// ─── Group-level navigation ───────────────────────────────────────────────────
const groupNav: NavSection[] = [
  {
    section: 'Overview',
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
      { name: 'Statistics', icon: BarChart3, href: '/statistics' },
    ],
  },
  {
    section: 'Moderation',
    items: [
      { name: 'Members', icon: Users, href: '/members' },
      { name: 'Mod History', icon: History, href: '/mod-history' },
      { name: 'Warnings', icon: AlertTriangle, href: '/warnings' },
    ],
  },
  {
    section: 'Automation',
    items: [
      {
        name: 'Modules',
        icon: Zap,
        href: '/modules',
        badge: '18',
        children: [
          { name: 'Filters',        icon: Filter,       href: '/filters' },
          { name: 'Triggers',       icon: Bolt,         href: '/triggers' },
          { name: 'Auto-Replies',   icon: MessageSquare, href: '/auto-replies' },
          { name: 'Scheduled Jobs', icon: Clock,        href: '/scheduled-jobs' },
        ],
      },
    ],
  },
  {
    section: 'Engagement',
    items: [
      { name: 'Rank System',    icon: Trophy,       href: '/rank-system' },
      { name: 'Referrals',      icon: Share2,        href: '/referrals' },
      { name: 'Invite Links',   icon: Link2,         href: '/invite-links' },
      { name: 'Forms & Surveys',icon: ClipboardList, href: '/forms' },
    ],
  },
  {
    section: 'Settings',
    items: [
      { name: 'Group Settings',   icon: Settings, href: '/settings' },
      { name: 'Permissions',      icon: Shield,   href: '/permissions' },
      { name: 'Command Aliases',  icon: Command,  href: '/aliases' },
    ],
  },
];

// ─── Network-level navigation ─────────────────────────────────────────────────
const networkNav: NavSection[] = [
  {
    section: 'Overview',
    items: [
      { name: 'Network Dashboard', icon: Globe,       href: '/network' },
      { name: 'Analytics',         icon: BarChart3,   href: '/network/analytics' },
    ],
  },
  {
    section: 'Groups',
    items: [
      { name: 'Manage Groups',    icon: Layers,      href: '/network/groups' },
      { name: 'Group Comparison', icon: GitCompare,  href: '/network/comparison' },
    ],
  },
  {
    section: 'Cross-Group',
    items: [
      { name: 'Broadcast',         icon: Radio,     href: '/network/broadcast' },
      { name: 'Member Directory',  icon: BookUser,  href: '/network/members' },
      { name: 'Moderation Log',    icon: ScrollText,href: '/network/mod-log' },
    ],
  },
  {
    section: 'Shared Config',
    items: [
      { name: 'Shared Modules', icon: Zap,               href: '/network/shared-modules' },
      { name: 'Shared Filters', icon: SlidersHorizontal, href: '/network/shared-filters' },
    ],
  },
  {
    section: 'Settings',
    items: [
      { name: 'Network Settings', icon: Settings, href: '/network/settings' },
      { name: 'Admin Team',       icon: UserCog,  href: '/network/admins' },
    ],
  },
];

const MODULE_CHILD_ROUTES = ['/filters', '/triggers', '/auto-replies', '/scheduled-jobs'];

// ─── NavTree ──────────────────────────────────────────────────────────────────
function NavTree({ nav, collapsed }: { nav: NavSection[]; collapsed: boolean }) {
  const location = useLocation();
  const isOnChildRoute = MODULE_CHILD_ROUTES.includes(location.pathname);
  const [modulesExpanded, setModulesExpanded] = useState(isOnChildRoute);

  useEffect(() => {
    if (isOnChildRoute) setModulesExpanded(true);
  }, [isOnChildRoute]);

  return (
    <div className="space-y-6">
      {nav.map((section) => (
        <div key={section.section}>
          {!collapsed && (
            <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
              {section.section}
            </div>
          )}
          <div className="space-y-0.5">
            {section.items.map((item) => {
              const isActive = location.pathname === item.href;
              const hasChildren = !!item.children?.length;
              const isExpanded = item.name === 'Modules' ? modulesExpanded : false;
              const Icon = item.icon;

              return (
                <div key={item.name}>
                  <div className="flex items-center gap-1">
                    <Link
                      to={item.href}
                      className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm ${
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-primary border-l-2 border-sidebar-primary ml-[-2px] pl-[10px]'
                          : 'text-text-secondary hover:bg-sidebar-accent hover:text-sidebar-foreground'
                      }`}
                      title={collapsed ? item.name : undefined}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="flex-1">{item.name}</span>
                          {item.badge && (
                            <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-primary text-primary-foreground">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>

                    {hasChildren && !collapsed && (
                      <button
                        onClick={() => setModulesExpanded((p) => !p)}
                        className="p-1.5 rounded-md hover:bg-sidebar-accent text-text-muted hover:text-sidebar-foreground transition-all shrink-0"
                        aria-label={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Children (expanded sidebar) */}
                  {hasChildren && !collapsed && (
                    <div
                      className={`overflow-hidden transition-all duration-200 ${
                        isExpanded ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="ml-[22px] mt-0.5 mb-1 relative">
                        <div className="absolute left-0 top-1 bottom-1 w-px bg-border" />
                        <div className="space-y-0.5 pl-4">
                          {item.children!.map((child) => {
                            const isChildActive = location.pathname === child.href;
                            const ChildIcon = child.icon;
                            return (
                              <Link
                                key={child.name}
                                to={child.href}
                                className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-all text-sm ${
                                  isChildActive
                                    ? 'bg-sidebar-accent text-sidebar-primary border-l-2 border-sidebar-primary ml-[-2px] pl-[8px]'
                                    : 'text-text-muted hover:bg-sidebar-accent hover:text-sidebar-foreground'
                                }`}
                              >
                                <ChildIcon className="w-3.5 h-3.5 shrink-0" />
                                <span>{child.name}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Children (collapsed sidebar) */}
                  {hasChildren && collapsed && (
                    <div className="space-y-0.5 mt-0.5">
                      {item.children!.map((child) => {
                        const isChildActive = location.pathname === child.href;
                        const ChildIcon = child.icon;
                        return (
                          <Link
                            key={child.name}
                            to={child.href}
                            title={child.name}
                            className={`flex items-center justify-center w-10 h-8 mx-auto rounded-md transition-all ${
                              isChildActive
                                ? 'bg-sidebar-accent text-sidebar-primary'
                                : 'text-text-muted hover:bg-sidebar-accent hover:text-sidebar-foreground'
                            }`}
                          >
                            <ChildIcon className="w-3.5 h-3.5" />
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Network Badge ────────────────────────────────────────────────────────────
function NetworkBadge({ collapsed }: { collapsed: boolean }) {
  if (collapsed) {
    return (
      <div className="mx-auto mb-3 w-8 flex items-center justify-center">
        <span className="w-6 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" />
      </div>
    );
  }
  return (
    <div className="mx-3 mb-3 px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-500/10 to-cyan-400/10 border border-indigo-500/20 flex items-center gap-2">
      <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
      <span className="text-xs font-medium text-indigo-300">Network View</span>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
export default function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const { isNetworkView } = useGlide();
  const activeNav = isNetworkView ? networkNav : groupNav;

  return (
    <div
      className={`${collapsed ? 'w-16' : 'w-60'} bg-sidebar border-r border-sidebar-border h-screen flex flex-col transition-all duration-200 shrink-0`}
    >
      {/* Logo header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-sidebar-border shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
                <path d="M8 24L16 8L24 24L20 22L16 14L12 22L8 24Z" fill="white" opacity="0.9" />
              </svg>
            </div>
            <span className="font-semibold text-sidebar-foreground">GlideOne</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground transition-colors ml-auto"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Context Switcher */}
      <div className="pt-2 shrink-0">
        <ContextSwitcher collapsed={collapsed} />
      </div>

      {/* Network mode indicator */}
      {isNetworkView && <NetworkBadge collapsed={collapsed} />}

      {/* Divider */}
      <div className="mx-3 mb-3 h-px bg-border shrink-0" />

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <NavTree nav={activeNav} collapsed={collapsed} />
      </div>

      {/* User footer */}
      <div className="border-t border-sidebar-border p-3 shrink-0">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-semibold shrink-0">
            A
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-sidebar-foreground truncate">Admin</div>
                <div className="text-xs text-text-muted truncate">admin@glideone.app</div>
              </div>
              <button
                className="p-1.5 rounded-md hover:bg-sidebar-accent text-text-muted hover:text-sidebar-foreground transition-colors shrink-0"
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

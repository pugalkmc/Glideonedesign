import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GlideProvider } from './context/GlideContext';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ModulesPage from './components/ModulesPage';
import FiltersPage from './components/FiltersPage';
import NetworkDashboard from './components/NetworkDashboard';
import AnalyticsPage from './components/AnalyticsPage';
import MembersPage from './components/MembersPage';
import ModHistoryPage from './components/ModHistoryPage';
import WarningsPage from './components/WarningsPage';
import ManageGroupsPage from './components/ManageGroupsPage';
import GroupComparisonPage from './components/GroupComparisonPage';
import BroadcastPage from './components/BroadcastPage';
import MemberDirectoryPage from './components/MemberDirectoryPage';

// ─── Placeholder page ─────────────────────────────────────────────────────────
function PlaceholderPage({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-[1280px] mx-auto p-8">
        <h1 className="text-[28px] font-bold text-text-primary">{title}</h1>
        {description && <p className="text-text-secondary mt-1 text-sm">{description}</p>}
        <div className="mt-8 p-16 bg-surface border border-border rounded-[var(--radius-md)] flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
            <span className="text-2xl">🚧</span>
          </div>
          <p className="text-text-muted text-sm">Coming soon</p>
        </div>
      </div>
    </div>
  );
}

// ─── App shell (authenticated) ────────────────────────────────────────────────
function AppShell({
  theme,
  onThemeToggle,
}: {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
      />

      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* ── Group-level routes ── */}
        <Route path="/dashboard"     element={<Dashboard theme={theme} onThemeToggle={onThemeToggle} />} />
        <Route path="/statistics"    element={<AnalyticsPage />} />
        <Route path="/members"       element={<MembersPage />} />
        <Route path="/mod-history"   element={<ModHistoryPage />} />
        <Route path="/warnings"      element={<WarningsPage />} />
        <Route path="/modules"       element={<ModulesPage />} />
        <Route path="/filters"       element={<FiltersPage />} />
        <Route path="/triggers"      element={<PlaceholderPage title="Triggers" description="Custom automation rules" />} />
        <Route path="/auto-replies"  element={<PlaceholderPage title="Auto-Replies" description="Automated message responses" />} />
        <Route path="/scheduled-jobs" element={<PlaceholderPage title="Scheduled Jobs" description="Recurring automated tasks" />} />
        <Route path="/rank-system"   element={<PlaceholderPage title="Rank System" description="XP and rank tier configuration" />} />
        <Route path="/referrals"     element={<PlaceholderPage title="Referrals" description="Member referral tracking" />} />
        <Route path="/invite-links"  element={<PlaceholderPage title="Invite Links" description="Manage invite links" />} />
        <Route path="/forms"         element={<PlaceholderPage title="Forms & Surveys" description="Group forms and surveys" />} />
        <Route path="/settings"      element={<PlaceholderPage title="Group Settings" description="Configure this group's settings" />} />
        <Route path="/permissions"   element={<PlaceholderPage title="Permissions" description="Role and permission configuration" />} />
        <Route path="/aliases"       element={<PlaceholderPage title="Command Aliases" description="Custom command shortcuts" />} />

        {/* ── Network-level routes ── */}
        <Route path="/network"                element={<NetworkDashboard theme={theme} onThemeToggle={onThemeToggle} />} />
        <Route path="/network/analytics"      element={<PlaceholderPage title="Network Analytics" description="Cross-group statistics and trends" />} />
        <Route path="/network/groups"         element={<ManageGroupsPage />} />
        <Route path="/network/comparison"     element={<GroupComparisonPage />} />
        <Route path="/network/broadcast"      element={<BroadcastPage />} />
        <Route path="/network/members"        element={<MemberDirectoryPage />} />
        <Route path="/network/mod-log"        element={<PlaceholderPage title="Moderation Log" description="Network-wide moderation history" />} />
        <Route path="/network/shared-modules" element={<PlaceholderPage title="Shared Modules" description="Modules applied to every group in this network" />} />
        <Route path="/network/shared-filters" element={<PlaceholderPage title="Shared Filters" description="Filter rules inherited by all groups" />} />
        <Route path="/network/settings"       element={<PlaceholderPage title="Network Settings" description="Configure this network's global settings" />} />
        <Route path="/network/admins"         element={<PlaceholderPage title="Admin Team" description="Manage network administrators" />} />
      </Routes>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <BrowserRouter>
      <GlideProvider>
        {!isLoggedIn ? (
          <LoginPage onLogin={() => setIsLoggedIn(true)} />
        ) : (
          <AppShell theme={theme} onThemeToggle={toggleTheme} />
        )}
      </GlideProvider>
    </BrowserRouter>
  );
}

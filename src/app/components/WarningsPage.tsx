import { useState } from 'react';
import {
  Search, Filter, Download, AlertTriangle, X, ChevronDown, Clock,
  TrendingUp, Users, Shield, Ban, Volume2, Eye, Trash2, CheckCircle2,
  XCircle, MoreVertical, Calendar, MessageSquare,
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell,
} from 'recharts';

// ─── Types ────────────────────────────────────────────────────────────────────

type WarningSeverity = 'low' | 'medium' | 'high' | 'critical';

type Warning = {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  reason: string;
  severity: WarningSeverity;
  issuedBy: string;
  issuedAt: string;
  expiresAt?: string;
  status: 'active' | 'expired' | 'cleared';
  notes?: string;
  category: string;
  evidenceLink?: string;
};

type UserWithWarnings = {
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  activeWarnings: number;
  totalWarnings: number;
  lastWarningDate: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  nextAction?: string;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockWarnings: Warning[] = [
  {
    id: 'w-1',
    userId: 'u-101',
    username: '@spammer123',
    displayName: 'Spammer123',
    reason: 'Posting promotional links without permission',
    severity: 'high',
    category: 'Spam',
    issuedBy: '@moderator_jane',
    issuedAt: '2024-04-25T14:30:00Z',
    expiresAt: '2024-05-25T14:30:00Z',
    status: 'active',
    evidenceLink: 'https://t.me/group/msg123',
  },
  {
    id: 'w-2',
    userId: 'u-102',
    username: '@newbie99',
    displayName: 'Newbie99',
    reason: 'Using inappropriate language in general chat',
    severity: 'low',
    category: 'Language',
    issuedBy: '@moderator_jane',
    issuedAt: '2024-04-25T12:15:00Z',
    expiresAt: '2024-05-25T12:15:00Z',
    status: 'active',
    notes: 'First offense, user apologized',
  },
  {
    id: 'w-3',
    userId: 'u-103',
    username: '@cryptowhale',
    displayName: 'Crypto Whale',
    reason: 'Price speculation in wrong channel',
    severity: 'low',
    category: 'Off-topic',
    issuedBy: '@techguru',
    issuedAt: '2024-04-24T18:45:00Z',
    expiresAt: '2024-05-24T18:45:00Z',
    status: 'active',
  },
  {
    id: 'w-4',
    userId: 'u-101',
    username: '@spammer123',
    displayName: 'Spammer123',
    reason: 'Repeated spam after first warning',
    severity: 'critical',
    category: 'Spam',
    issuedBy: '@admin_bob',
    issuedAt: '2024-04-24T16:00:00Z',
    status: 'active',
    notes: 'Third warning - next offense will result in ban',
    evidenceLink: 'https://t.me/group/msg456',
  },
  {
    id: 'w-5',
    userId: 'u-104',
    username: '@toxicuser',
    displayName: 'ToxicUser',
    reason: 'Personal attacks on other members',
    severity: 'high',
    category: 'Harassment',
    issuedBy: '@moderator_jane',
    issuedAt: '2024-04-24T14:20:00Z',
    expiresAt: '2024-05-24T14:20:00Z',
    status: 'active',
  },
  {
    id: 'w-6',
    userId: 'u-105',
    username: '@reformed_user',
    displayName: 'Reformed User',
    reason: 'Posting scam links',
    severity: 'high',
    category: 'Scam',
    issuedBy: '@admin_bob',
    issuedAt: '2024-03-15T10:00:00Z',
    status: 'cleared',
    notes: 'Warning cleared after good behavior period',
  },
  {
    id: 'w-7',
    userId: 'u-106',
    username: '@caps_lock_kid',
    displayName: 'Caps Lock Kid',
    reason: 'Excessive caps lock and spam behavior',
    severity: 'medium',
    category: 'Spam',
    issuedBy: '@moderator_jane',
    issuedAt: '2024-04-23T09:30:00Z',
    expiresAt: '2024-05-23T09:30:00Z',
    status: 'active',
  },
  {
    id: 'w-8',
    userId: 'u-107',
    username: '@fud_spreader',
    displayName: 'FUD Spreader',
    reason: 'Spreading misinformation about project',
    severity: 'high',
    category: 'Misinformation',
    issuedBy: '@techguru',
    issuedAt: '2024-04-22T15:45:00Z',
    expiresAt: '2024-05-22T15:45:00Z',
    status: 'active',
  },
  {
    id: 'w-9',
    userId: 'u-104',
    username: '@toxicuser',
    displayName: 'ToxicUser',
    reason: 'Continued hostile behavior',
    severity: 'critical',
    category: 'Harassment',
    issuedBy: '@admin_bob',
    issuedAt: '2024-04-21T11:00:00Z',
    status: 'active',
    notes: 'Second warning - user on final warning',
  },
  {
    id: 'w-10',
    userId: 'u-108',
    username: '@old_timer',
    displayName: 'Old Timer',
    reason: 'Mild inappropriate joke',
    severity: 'low',
    category: 'Language',
    issuedBy: '@moderator_jane',
    issuedAt: '2024-03-10T08:00:00Z',
    status: 'expired',
  },
];

const usersWithWarnings: UserWithWarnings[] = [
  {
    userId: 'u-101',
    username: '@spammer123',
    displayName: 'Spammer123',
    avatar: 'S1',
    activeWarnings: 2,
    totalWarnings: 3,
    lastWarningDate: '2024-04-25T14:30:00Z',
    riskLevel: 'critical',
    nextAction: 'Ban on next offense',
  },
  {
    userId: 'u-104',
    username: '@toxicuser',
    displayName: 'ToxicUser',
    avatar: 'TU',
    activeWarnings: 2,
    totalWarnings: 2,
    lastWarningDate: '2024-04-24T14:20:00Z',
    riskLevel: 'high',
    nextAction: 'Mute on next offense',
  },
  {
    userId: 'u-102',
    username: '@newbie99',
    displayName: 'Newbie99',
    avatar: 'N9',
    activeWarnings: 1,
    totalWarnings: 1,
    lastWarningDate: '2024-04-25T12:15:00Z',
    riskLevel: 'low',
  },
  {
    userId: 'u-103',
    username: '@cryptowhale',
    displayName: 'Crypto Whale',
    avatar: 'CW',
    activeWarnings: 1,
    totalWarnings: 1,
    lastWarningDate: '2024-04-24T18:45:00Z',
    riskLevel: 'low',
  },
  {
    userId: 'u-106',
    username: '@caps_lock_kid',
    displayName: 'Caps Lock Kid',
    avatar: 'CK',
    activeWarnings: 1,
    totalWarnings: 1,
    lastWarningDate: '2024-04-23T09:30:00Z',
    riskLevel: 'medium',
  },
  {
    userId: 'u-107',
    username: '@fud_spreader',
    displayName: 'FUD Spreader',
    avatar: 'FS',
    activeWarnings: 1,
    totalWarnings: 1,
    lastWarningDate: '2024-04-22T15:45:00Z',
    riskLevel: 'high',
  },
];

// Chart data
const warningTrend = [
  { date: 'Apr 19', warnings: 8, cleared: 2 },
  { date: 'Apr 20', warnings: 12, cleared: 1 },
  { date: 'Apr 21', warnings: 10, cleared: 3 },
  { date: 'Apr 22', warnings: 14, cleared: 2 },
  { date: 'Apr 23', warnings: 9, cleared: 4 },
  { date: 'Apr 24', warnings: 16, cleared: 1 },
  { date: 'Apr 25', warnings: 11, cleared: 2 },
];

const warningsByCategory = [
  { category: 'Spam', count: 45, color: '#EF4444' },
  { category: 'Language', count: 32, color: '#F59E0B' },
  { category: 'Harassment', count: 28, color: '#EC4899' },
  { category: 'Off-topic', count: 18, color: '#94A3B8' },
  { category: 'Scam', count: 12, color: '#DC2626' },
  { category: 'Misinformation', count: 9, color: '#FBBF24' },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

function getTimeAgo(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

const severityConfig = {
  low: {
    label: 'Low',
    color: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
    dotColor: 'bg-blue-400',
  },
  medium: {
    label: 'Medium',
    color: 'text-warning bg-warning/10 border-warning/30',
    dotColor: 'bg-warning',
  },
  high: {
    label: 'High',
    color: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
    dotColor: 'bg-orange-400',
  },
  critical: {
    label: 'Critical',
    color: 'text-destructive bg-destructive/10 border-destructive/30',
    dotColor: 'bg-destructive',
  },
};

const riskConfig = {
  low: { label: 'Low Risk', color: 'text-success bg-success/10 border-success/30' },
  medium: { label: 'Medium Risk', color: 'text-warning bg-warning/10 border-warning/30' },
  high: { label: 'High Risk', color: 'text-orange-400 bg-orange-400/10 border-orange-400/30' },
  critical: { label: 'Critical Risk', color: 'text-destructive bg-destructive/10 border-destructive/30' },
};

// ─── Components ───────────────────────────────────────────────────────────────

function WarningCard({ warning, onAction }: { warning: Warning; onAction: (action: string, warning: Warning) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const severity = severityConfig[warning.severity];

  return (
    <div className="bg-surface border border-border rounded-lg p-4 hover:border-primary/30 transition-all">
      <div className="flex items-start justify-between gap-4">
        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-1 rounded-md border text-xs font-semibold ${severity.color}`}>
                {severity.label}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-muted text-text-muted text-xs font-medium">
                {warning.category}
              </span>
              {warning.status === 'expired' && (
                <span className="px-2.5 py-1 rounded-md bg-text-muted/10 text-text-muted text-xs font-medium">
                  Expired
                </span>
              )}
              {warning.status === 'cleared' && (
                <span className="px-2.5 py-1 rounded-md bg-success/10 text-success border border-success/30 text-xs font-medium">
                  Cleared
                </span>
              )}
            </div>
            <span className="text-xs text-text-muted whitespace-nowrap">{getTimeAgo(warning.issuedAt)}</span>
          </div>

          {/* User & Reason */}
          <div>
            <div className="text-sm text-text-primary mb-1">
              <span className="font-semibold">{warning.displayName}</span>
              <span className="text-text-muted"> ({warning.username})</span>
            </div>
            <div className="text-sm text-text-secondary bg-background/50 border border-border rounded-lg p-3">
              <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Reason</div>
              {warning.reason}
            </div>
          </div>

          {/* Notes */}
          {warning.notes && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
              <div className="text-xs text-primary uppercase tracking-wider mb-1">Moderator Notes</div>
              <div className="text-sm text-text-secondary">{warning.notes}</div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-text-muted">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                {warning.issuedBy}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDate(warning.issuedAt)}
              </span>
              {warning.evidenceLink && (
                <a
                  href={warning.evidenceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:text-primary-glow transition-colors"
                >
                  <MessageSquare className="w-3 h-3" />
                  Evidence
                </a>
              )}
            </div>
            {warning.expiresAt && warning.status === 'active' && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Expires {getTimeAgo(warning.expiresAt)}
              </span>
            )}
          </div>
        </div>

        {/* Actions Menu */}
        {warning.status === 'active' && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded hover:bg-surface-2 text-text-muted hover:text-text-primary transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-48 bg-surface-2 border border-border rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.4)] z-20 overflow-hidden">
                  <button
                    onClick={() => { onAction('view', warning); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-sidebar-accent transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Details
                  </button>
                  <button
                    onClick={() => { onAction('clear', warning); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-success hover:bg-success/10 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Clear Warning
                  </button>
                  <div className="h-px bg-border my-1" />
                  <button
                    onClick={() => { onAction('delete', warning); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Warning
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function UserRiskCard({ user, onAction }: { user: UserWithWarnings; onAction: (action: string, user: UserWithWarnings) => void }) {
  const risk = riskConfig[user.riskLevel];

  return (
    <div className={`bg-surface border rounded-lg p-4 hover:border-primary/30 transition-all ${risk.color.includes('destructive') ? 'border-destructive/30' : 'border-border'}`}>
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/60 to-accent/60 flex items-center justify-center text-sm font-bold text-white shrink-0">
          {user.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <div className="font-semibold text-text-primary truncate">{user.displayName}</div>
              <div className="text-xs text-text-muted truncate">{user.username}</div>
            </div>
            <span className={`px-2 py-0.5 rounded-md border text-xs font-medium whitespace-nowrap ${risk.color}`}>
              {risk.label}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
            <div className="bg-background/50 border border-border rounded p-2">
              <div className="text-text-muted">Active</div>
              <div className="font-bold text-text-primary">{user.activeWarnings}</div>
            </div>
            <div className="bg-background/50 border border-border rounded p-2">
              <div className="text-text-muted">Total</div>
              <div className="font-bold text-text-primary">{user.totalWarnings}</div>
            </div>
          </div>

          {user.nextAction && (
            <div className="bg-destructive/10 border border-destructive/30 rounded p-2 mb-2">
              <div className="text-xs text-destructive font-medium">⚠️ {user.nextAction}</div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">Last: {getTimeAgo(user.lastWarningDate)}</span>
            <button
              onClick={() => onAction('view-user', user)}
              className="text-xs text-primary hover:text-primary-glow font-medium transition-colors"
            >
              View All →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  trend?: { value: string; direction: 'up' | 'down' };
}) {
  const TrendIcon = trend?.direction === 'up' ? TrendingUp : AlertTriangle;
  const trendColor = trend?.direction === 'down' ? 'text-success' : 'text-destructive';

  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-text-muted uppercase tracking-wider">{label}</span>
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="text-2xl font-bold text-text-primary mb-1">{value}</div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs ${trendColor}`}>
          <TrendIcon className="w-3 h-3" />
          {trend.value}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function WarningsPage() {
  const [warnings] = useState<Warning[]>(mockWarnings);
  const [usersAtRisk] = useState<UserWithWarnings[]>(usersWithWarnings);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<WarningSeverity | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired' | 'cleared'>('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'warnings' | 'users'>('warnings');

  // Filtering
  const filteredWarnings = warnings.filter((warning) => {
    const matchesSearch =
      warning.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warning.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warning.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || warning.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || warning.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || warning.category === filterCategory;

    return matchesSearch && matchesSeverity && matchesStatus && matchesCategory;
  });

  const activeFiltersCount = [filterSeverity, filterStatus, filterCategory].filter(f => f !== 'all').length;

  const clearFilters = () => {
    setFilterSeverity('all');
    setFilterStatus('all');
    setFilterCategory('all');
  };

  const handleWarningAction = (action: string, warning: Warning) => {
    console.log(`Action: ${action} on warning`, warning);
    alert(`${action} warning for ${warning.displayName}`);
  };

  const handleUserAction = (action: string, user: UserWithWarnings) => {
    console.log(`Action: ${action} on user`, user);
    alert(`View warnings for ${user.displayName}`);
  };

  // Stats
  const totalWarnings = warnings.length;
  const activeWarnings = warnings.filter(w => w.status === 'active').length;
  const criticalWarnings = warnings.filter(w => w.severity === 'critical' && w.status === 'active').length;
  const usersWithActiveWarnings = usersAtRisk.filter(u => u.activeWarnings > 0).length;

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-[1280px] mx-auto p-8 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-[28px] font-bold text-text-primary">Warnings</h1>
          <p className="text-sm text-text-muted mt-1">Track and manage member warnings and escalations</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Warnings"
            value={totalWarnings}
            icon={AlertTriangle}
            trend={{ value: '8% vs last week', direction: 'down' }}
          />
          <StatCard
            label="Active Warnings"
            value={activeWarnings}
            icon={Shield}
          />
          <StatCard
            label="Critical"
            value={criticalWarnings}
            icon={Ban}
          />
          <StatCard
            label="Users at Risk"
            value={usersWithActiveWarnings}
            icon={Users}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Warning Trend */}
          <div className="lg:col-span-2 bg-surface border border-border rounded-lg p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-text-primary">Warning Trend</h2>
              <p className="text-xs text-text-muted mt-0.5">Warnings issued and cleared over the last 7 days</p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={warningTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(42,42,56)" />
                <XAxis dataKey="date" stroke="rgb(148,163,184)" fontSize={11} />
                <YAxis stroke="rgb(148,163,184)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(17,17,24)',
                    border: '1px solid rgb(42,42,56)',
                    borderRadius: '8px',
                  }}
                />
                <Line type="monotone" dataKey="warnings" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="cleared" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* By Category */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-text-primary">By Category</h2>
              <p className="text-xs text-text-muted mt-0.5">All time</p>
            </div>
            <div className="space-y-2">
              {warningsByCategory.map((cat) => (
                <div key={cat.category}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-text-secondary">{cat.category}</span>
                    <span className="font-semibold text-text-primary">{cat.count}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(cat.count / 144) * 100}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-border">
          <button
            onClick={() => setActiveTab('warnings')}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === 'warnings'
                ? 'text-primary'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            All Warnings
            {activeTab === 'warnings' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === 'users'
                ? 'text-primary'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Users at Risk
            {activeTab === 'users' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>

        {/* Toolbar */}
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search warnings by user or reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <button
                onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:border-primary transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-primary text-white rounded-full text-xs min-w-[20px] text-center">
                    {activeFiltersCount}
                  </span>
                )}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {filterMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setFilterMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-72 bg-surface-2 border border-border rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.4)] z-20 p-4 space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-2 block">Severity</label>
                      <select
                        value={filterSeverity}
                        onChange={(e) => setFilterSeverity(e.target.value as any)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary"
                      >
                        <option value="all">All Severities</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-2 block">Status</label>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary"
                      >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="expired">Expired</option>
                        <option value="cleared">Cleared</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-2 block">Category</label>
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary"
                      >
                        <option value="all">All Categories</option>
                        <option value="Spam">Spam</option>
                        <option value="Language">Language</option>
                        <option value="Harassment">Harassment</option>
                        <option value="Off-topic">Off-topic</option>
                        <option value="Scam">Scam</option>
                        <option value="Misinformation">Misinformation</option>
                      </select>
                    </div>

                    {activeFiltersCount > 0 && (
                      <button
                        onClick={() => { clearFilters(); setFilterMenuOpen(false); }}
                        className="w-full px-3 py-2 bg-destructive/10 text-destructive rounded-lg text-sm font-medium hover:bg-destructive/20 transition-colors"
                      >
                        Clear All Filters
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Export */}
            <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:border-primary transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'warnings' ? (
          <div className="space-y-3">
            {filteredWarnings.length > 0 ? (
              filteredWarnings.map((warning) => (
                <WarningCard key={warning.id} warning={warning} onAction={handleWarningAction} />
              ))
            ) : (
              <div className="bg-surface border border-border rounded-lg p-12 text-center">
                <AlertTriangle className="w-12 h-12 text-text-muted mx-auto mb-3" />
                <p className="text-text-secondary">No warnings found</p>
                <p className="text-sm text-text-muted mt-1">Try adjusting your search or filters</p>
              </div>
            )}
            <div className="text-sm text-text-muted text-center">
              Showing {filteredWarnings.length} of {totalWarnings} warnings
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {usersAtRisk.map((user) => (
              <UserRiskCard key={user.userId} user={user} onAction={handleUserAction} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

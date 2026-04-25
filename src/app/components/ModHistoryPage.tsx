import { useState } from 'react';
import {
  Search, Filter, Download, Calendar, Clock, Shield, Ban, Volume2,
  AlertTriangle, UserX, ChevronDown, RotateCcw, CheckCircle2, XCircle,
  User, MessageSquare, ExternalLink, TrendingDown, TrendingUp,
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell,
} from 'recharts';

// ─── Types ────────────────────────────────────────────────────────────────────

type ActionType = 'ban' | 'mute' | 'kick' | 'warn' | 'unban' | 'unmute' | 'note';

type ModAction = {
  id: string;
  actionType: ActionType;
  targetUser: string;
  targetUserId: string;
  moderator: string;
  moderatorId: string;
  reason: string;
  timestamp: string;
  duration?: string; // For temporary actions
  status: 'active' | 'expired' | 'reversed';
  reversedBy?: string;
  reversedAt?: string;
  evidence?: string; // Message link or screenshot
  appealStatus?: 'none' | 'pending' | 'approved' | 'denied';
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockActions: ModAction[] = [
  {
    id: '1',
    actionType: 'ban',
    targetUser: '@spammer123',
    targetUserId: 'u-234',
    moderator: '@moderator_jane',
    moderatorId: 'm-456',
    reason: 'Repeated spam links after multiple warnings',
    timestamp: '2024-04-25T14:23:00Z',
    status: 'active',
    evidence: 'https://t.me/group/12345',
    appealStatus: 'none',
  },
  {
    id: '2',
    actionType: 'mute',
    targetUser: '@flooder99',
    targetUserId: 'u-567',
    moderator: '@techguru',
    moderatorId: 'm-789',
    reason: 'Flooding chat with off-topic messages',
    timestamp: '2024-04-25T13:45:00Z',
    duration: '24 hours',
    status: 'active',
    appealStatus: 'pending',
  },
  {
    id: '3',
    actionType: 'warn',
    targetUser: '@newbie99',
    targetUserId: 'u-890',
    moderator: '@moderator_jane',
    moderatorId: 'm-456',
    reason: 'Posting referral links (first offense)',
    timestamp: '2024-04-25T12:15:00Z',
    status: 'active',
    appealStatus: 'none',
  },
  {
    id: '4',
    actionType: 'kick',
    targetUser: '@toxicuser',
    targetUserId: 'u-111',
    moderator: '@admin_bob',
    moderatorId: 'm-222',
    reason: 'Harassment and personal attacks',
    timestamp: '2024-04-25T11:30:00Z',
    status: 'active',
    evidence: 'https://t.me/group/67890',
    appealStatus: 'none',
  },
  {
    id: '5',
    actionType: 'unban',
    targetUser: '@reformed_user',
    targetUserId: 'u-333',
    moderator: '@admin_bob',
    moderatorId: 'm-222',
    reason: 'Appeal approved - user showed understanding of rules',
    timestamp: '2024-04-25T10:00:00Z',
    status: 'active',
    appealStatus: 'approved',
  },
  {
    id: '6',
    actionType: 'mute',
    targetUser: '@caps_lock_kid',
    targetUserId: 'u-444',
    moderator: '@moderator_jane',
    moderatorId: 'm-456',
    reason: 'Excessive caps lock and shouting',
    timestamp: '2024-04-25T09:20:00Z',
    duration: '2 hours',
    status: 'expired',
    appealStatus: 'none',
  },
  {
    id: '7',
    actionType: 'ban',
    targetUser: '@scammer_alert',
    targetUserId: 'u-555',
    moderator: '@techguru',
    moderatorId: 'm-789',
    reason: 'Phishing attempt - fake admin impersonation',
    timestamp: '2024-04-25T08:45:00Z',
    status: 'active',
    evidence: 'https://t.me/group/11111',
    appealStatus: 'denied',
  },
  {
    id: '8',
    actionType: 'warn',
    targetUser: '@cryptowhale',
    targetUserId: 'u-666',
    moderator: '@moderator_jane',
    moderatorId: 'm-456',
    reason: 'Price speculation in general chat (should use price-talk)',
    timestamp: '2024-04-24T18:30:00Z',
    status: 'active',
    appealStatus: 'none',
  },
  {
    id: '9',
    actionType: 'mute',
    targetUser: '@debate_lord',
    targetUserId: 'u-777',
    moderator: '@admin_bob',
    moderatorId: 'm-222',
    reason: 'Derailing conversation, ignoring moderator requests',
    timestamp: '2024-04-24T16:10:00Z',
    duration: '12 hours',
    status: 'expired',
    appealStatus: 'none',
  },
  {
    id: '10',
    actionType: 'note',
    targetUser: '@watchlist_user',
    targetUserId: 'u-888',
    moderator: '@moderator_jane',
    moderatorId: 'm-456',
    reason: 'Multiple borderline messages - added to watchlist',
    timestamp: '2024-04-24T14:00:00Z',
    status: 'active',
    appealStatus: 'none',
  },
];

// Stats data
const actionsByType = [
  { type: 'Bans', count: 28, color: '#EF4444' },
  { type: 'Mutes', count: 67, color: '#F59E0B' },
  { type: 'Kicks', count: 19, color: '#94A3B8' },
  { type: 'Warns', count: 142, color: '#FBBF24' },
];

const actionsTimeline = [
  { date: 'Apr 19', bans: 3, mutes: 8, kicks: 2, warns: 18 },
  { date: 'Apr 20', bans: 2, mutes: 11, kicks: 1, warns: 22 },
  { date: 'Apr 21', bans: 5, mutes: 9, kicks: 3, warns: 19 },
  { date: 'Apr 22', bans: 4, mutes: 12, kicks: 2, warns: 24 },
  { date: 'Apr 23', bans: 6, mutes: 10, kicks: 4, warns: 21 },
  { date: 'Apr 24', bans: 3, mutes: 8, kicks: 3, warns: 17 },
  { date: 'Apr 25', bans: 5, mutes: 9, kicks: 4, warns: 21 },
];

const topModerators = [
  { name: '@moderator_jane', actions: 142, accuracy: 96 },
  { name: '@techguru', actions: 98, accuracy: 94 },
  { name: '@admin_bob', actions: 76, accuracy: 98 },
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

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

const actionConfig = {
  ban: {
    label: 'Ban',
    color: 'text-destructive bg-destructive/10 border-destructive/30',
    icon: Ban,
    borderColor: 'border-destructive',
  },
  mute: {
    label: 'Mute',
    color: 'text-warning bg-warning/10 border-warning/30',
    icon: Volume2,
    borderColor: 'border-warning',
  },
  kick: {
    label: 'Kick',
    color: 'text-text-muted bg-muted border-border',
    icon: UserX,
    borderColor: 'border-text-muted',
  },
  warn: {
    label: 'Warn',
    color: 'text-warning bg-warning/10 border-warning/30',
    icon: AlertTriangle,
    borderColor: 'border-warning/50',
  },
  unban: {
    label: 'Unban',
    color: 'text-success bg-success/10 border-success/30',
    icon: CheckCircle2,
    borderColor: 'border-success',
  },
  unmute: {
    label: 'Unmute',
    color: 'text-success bg-success/10 border-success/30',
    icon: CheckCircle2,
    borderColor: 'border-success',
  },
  note: {
    label: 'Note',
    color: 'text-primary bg-primary/10 border-primary/30',
    icon: MessageSquare,
    borderColor: 'border-primary',
  },
};

const appealConfig = {
  none: { label: '', color: '' },
  pending: { label: 'Appeal Pending', color: 'text-warning bg-warning/10 border-warning/20' },
  approved: { label: 'Appeal Approved', color: 'text-success bg-success/10 border-success/20' },
  denied: { label: 'Appeal Denied', color: 'text-destructive bg-destructive/10 border-destructive/20' },
};

// ─── Components ───────────────────────────────────────────────────────────────

function ActionRow({ action }: { action: ModAction }) {
  const config = actionConfig[action.actionType];
  const Icon = config.icon;
  const appeal = appealConfig[action.appealStatus || 'none'];

  return (
    <div className={`flex items-start gap-4 p-4 border-l-2 ${config.borderColor} bg-surface-2 rounded-r-lg hover:bg-surface transition-colors`}>
      {/* Icon */}
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${config.color}`}>
        <Icon className="w-5 h-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded-md border text-xs font-semibold ${config.color}`}>
                {config.label}
              </span>
              {action.duration && (
                <span className="px-2 py-0.5 rounded-md bg-muted text-text-muted text-xs font-medium">
                  {action.duration}
                </span>
              )}
              {action.status === 'expired' && (
                <span className="px-2 py-0.5 rounded-md bg-text-muted/10 text-text-muted text-xs font-medium">
                  Expired
                </span>
              )}
              {appeal.label && (
                <span className={`px-2 py-0.5 rounded-md border text-xs font-medium ${appeal.color}`}>
                  {appeal.label}
                </span>
              )}
            </div>
            <div className="text-sm text-text-primary mt-2">
              <span className="font-semibold">{action.targetUser}</span>
              <span className="text-text-muted"> was {action.actionType}ed by </span>
              <span className="font-semibold text-primary">{action.moderator}</span>
            </div>
          </div>
          <span className="text-xs text-text-muted whitespace-nowrap">{getTimeAgo(action.timestamp)}</span>
        </div>

        {/* Reason */}
        <div className="bg-background/50 border border-border rounded-lg p-3">
          <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Reason</div>
          <div className="text-sm text-text-secondary">{action.reason}</div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTimestamp(action.timestamp)}
            </span>
            {action.evidence && (
              <a href={action.evidence} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:text-primary-glow transition-colors">
                <ExternalLink className="w-3 h-3" />
                View Evidence
              </a>
            )}
          </div>
          {action.reversedBy && (
            <span className="text-xs text-text-muted">
              Reversed by {action.reversedBy}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  trend,
  icon: Icon
}: {
  label: string;
  value: string | number;
  trend?: { value: string; direction: 'up' | 'down' };
  icon: React.ElementType;
}) {
  const TrendIcon = trend?.direction === 'up' ? TrendingUp : TrendingDown;
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

export default function ModHistoryPage() {
  const [actions] = useState<ModAction[]>(mockActions);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState<ActionType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired' | 'reversed'>('all');
  const [filterModerator, setFilterModerator] = useState('all');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  // Filtering
  const filteredActions = actions.filter((action) => {
    const matchesSearch =
      action.targetUser.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.moderator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = filterAction === 'all' || action.actionType === filterAction;
    const matchesStatus = filterStatus === 'all' || action.status === filterStatus;
    const matchesModerator = filterModerator === 'all' || action.moderator === filterModerator;

    return matchesSearch && matchesAction && matchesStatus && matchesModerator;
  });

  const activeFiltersCount = [filterAction, filterStatus, filterModerator].filter(f => f !== 'all').length;

  const clearFilters = () => {
    setFilterAction('all');
    setFilterStatus('all');
    setFilterModerator('all');
  };

  // Stats
  const totalActions = actions.length;
  const actionsLast24h = actions.filter(a => {
    const actionTime = new Date(a.timestamp);
    const dayAgo = new Date();
    dayAgo.setDate(dayAgo.getDate() - 1);
    return actionTime > dayAgo;
  }).length;
  const activeActions = actions.filter(a => a.status === 'active').length;
  const appealsPending = actions.filter(a => a.appealStatus === 'pending').length;

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-[1280px] mx-auto p-8 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-[28px] font-bold text-text-primary">Moderation History</h1>
          <p className="text-sm text-text-muted mt-1">Complete audit log of all moderation actions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Actions"
            value={totalActions}
            trend={{ value: '12% vs last week', direction: 'down' }}
            icon={Shield}
          />
          <StatCard
            label="Last 24 Hours"
            value={actionsLast24h}
            icon={Clock}
          />
          <StatCard
            label="Active Actions"
            value={activeActions}
            icon={AlertTriangle}
          />
          <StatCard
            label="Pending Appeals"
            value={appealsPending}
            icon={RotateCcw}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Actions Timeline */}
          <div className="lg:col-span-2 bg-surface border border-border rounded-lg p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-text-primary">Action Timeline</h2>
              <p className="text-xs text-text-muted mt-0.5">Last 7 days</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={actionsTimeline}>
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
                <Line type="monotone" dataKey="bans" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="mutes" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="kicks" stroke="#94A3B8" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="warns" stroke="#FBBF24" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Actions by Type */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-text-primary">Actions by Type</h2>
              <p className="text-xs text-text-muted mt-0.5">Last 30 days</p>
            </div>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={actionsByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="count"
                  >
                    {actionsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgb(17,17,24)',
                      border: '1px solid rgb(42,42,56)',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {actionsByType.map((item) => (
                <div key={item.type} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                  <div className="text-xs text-text-secondary">
                    {item.type} <span className="font-semibold text-text-primary">({item.count})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Moderators */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-text-primary">Top Moderators</h2>
            <p className="text-xs text-text-muted mt-0.5">Most active moderators by action count</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topModerators.map((mod, idx) => (
              <div key={mod.name} className="bg-surface-2 border border-border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/60 to-accent/60 flex items-center justify-center text-sm font-bold text-white">
                    #{idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-text-primary truncate">{mod.name}</div>
                    <div className="text-xs text-text-muted">Moderator</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">Actions</span>
                  <span className="font-bold text-text-primary">{mod.actions}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-text-muted">Accuracy</span>
                  <span className="font-bold text-success">{mod.accuracy}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search by user, moderator, or reason..."
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
                    {/* Action Type */}
                    <div>
                      <label className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-2 block">Action Type</label>
                      <select
                        value={filterAction}
                        onChange={(e) => setFilterAction(e.target.value as any)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary"
                      >
                        <option value="all">All Actions</option>
                        <option value="ban">Bans</option>
                        <option value="mute">Mutes</option>
                        <option value="kick">Kicks</option>
                        <option value="warn">Warns</option>
                        <option value="unban">Unbans</option>
                        <option value="unmute">Unmutes</option>
                        <option value="note">Notes</option>
                      </select>
                    </div>

                    {/* Status */}
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
                        <option value="reversed">Reversed</option>
                      </select>
                    </div>

                    {/* Moderator */}
                    <div>
                      <label className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-2 block">Moderator</label>
                      <select
                        value={filterModerator}
                        onChange={(e) => setFilterModerator(e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary"
                      >
                        <option value="all">All Moderators</option>
                        {topModerators.map(mod => (
                          <option key={mod.name} value={mod.name}>{mod.name}</option>
                        ))}
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

        {/* Actions List */}
        <div className="space-y-3">
          {filteredActions.length > 0 ? (
            filteredActions.map((action) => (
              <ActionRow key={action.id} action={action} />
            ))
          ) : (
            <div className="bg-surface border border-border rounded-lg p-12 text-center">
              <Shield className="w-12 h-12 text-text-muted mx-auto mb-3" />
              <p className="text-text-secondary">No moderation actions found</p>
              <p className="text-sm text-text-muted mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="text-sm text-text-muted text-center">
          Showing {filteredActions.length} of {totalActions} actions
        </div>

      </div>
    </div>
  );
}

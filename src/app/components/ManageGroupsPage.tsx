import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Plus, MoreVertical, Settings, Eye, Trash2, AlertTriangle,
  CheckCircle2, XCircle, Users, MessageSquare, Shield, Activity,
  ArrowUpRight, Globe, Link2, Copy, Check, ChevronDown, Filter,
  TrendingUp, TrendingDown, Calendar, Zap, Power, PowerOff,
} from 'lucide-react';
import { useGlide } from '../context/GlideContext';
import { mockNetworks, getNetworkById, getInitials, type Group } from '../data/networks';

// ─── Helper Functions ─────────────────────────────────────────────────────────

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return String(n);
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const healthConfig = {
  healthy: {
    label: 'Healthy',
    color: 'text-success bg-success/10 border-success/30',
    icon: CheckCircle2,
    dotColor: 'bg-success',
  },
  warning: {
    label: 'Warning',
    color: 'text-warning bg-warning/10 border-warning/30',
    icon: AlertTriangle,
    dotColor: 'bg-warning',
  },
  critical: {
    label: 'Critical',
    color: 'text-destructive bg-destructive/10 border-destructive/30',
    icon: XCircle,
    dotColor: 'bg-destructive',
  },
};

// ─── Components ───────────────────────────────────────────────────────────────

function GroupCard({
  group,
  onAction,
  onSelect,
  selected,
}: {
  group: Group;
  onAction: (action: string, group: Group) => void;
  onSelect: (id: string) => void;
  selected: boolean;
}) {
  const navigate = useNavigate();
  const { setContext } = useGlide();
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const health = healthConfig[group.health];
  const HealthIcon = health.icon;
  const modulePercent = Math.round((group.activeModules / group.totalModules) * 100);

  const handleViewDashboard = () => {
    setContext({ type: 'group', networkId: group.networkId, groupId: group.id });
    navigate('/dashboard');
  };

  const handleCopyUsername = () => {
    navigator.clipboard.writeText(group.username);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`bg-surface border rounded-lg p-5 hover:border-primary/40 transition-all ${selected ? 'border-primary' : 'border-border'}`}>
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* Checkbox */}
        <button
          onClick={() => onSelect(group.id)}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
            selected ? 'bg-primary border-primary' : 'border-border hover:border-primary'
          }`}
        >
          {selected && <Check className="w-3 h-3 text-white" />}
        </button>

        {/* Avatar & Info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-base font-bold text-text-primary shrink-0">
            {getInitials(group.name)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-semibold text-text-primary truncate">{group.name}</h3>
              <HealthIcon className={`w-4 h-4 ${health.color.split(' ')[0]}`} />
            </div>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <button
                onClick={handleCopyUsername}
                className="flex items-center gap-1 hover:text-text-primary transition-colors"
              >
                <span className="font-mono">{group.username}</span>
                {copied ? (
                  <Check className="w-3 h-3 text-success" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Health Badge & Menu */}
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-md border text-xs font-medium ${health.color}`}>
            {health.label}
          </span>

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
                    onClick={() => { handleViewDashboard(); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-sidebar-accent transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Dashboard
                  </button>
                  <button
                    onClick={() => { onAction('settings', group); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-sidebar-accent transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    Group Settings
                  </button>
                  <button
                    onClick={() => { onAction('modules', group); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-sidebar-accent transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Manage Modules
                  </button>
                  <button
                    onClick={() => { onAction('toggle-bot', group); setMenuOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                      group.botActive
                        ? 'text-warning hover:bg-warning/10'
                        : 'text-success hover:bg-success/10'
                    }`}
                  >
                    {group.botActive ? (
                      <>
                        <PowerOff className="w-3.5 h-3.5" />
                        Disable Bot
                      </>
                    ) : (
                      <>
                        <Power className="w-3.5 h-3.5" />
                        Enable Bot
                      </>
                    )}
                  </button>
                  <div className="h-px bg-border my-1" />
                  <button
                    onClick={() => { onAction('remove', group); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove from Network
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-background/50 border border-border rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-xs text-text-muted mb-1">
            <Users className="w-3 h-3" />
            Members
          </div>
          <div className="text-lg font-bold text-text-primary">{formatNumber(group.memberCount)}</div>
          <div className="text-xs text-text-muted mt-0.5">{group.online} online</div>
        </div>
        <div className="bg-background/50 border border-border rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-xs text-text-muted mb-1">
            <MessageSquare className="w-3 h-3" />
            Messages
          </div>
          <div className="text-lg font-bold text-text-primary">{formatNumber(group.messagesToday)}</div>
          <div className="text-xs text-text-muted mt-0.5">today</div>
        </div>
        <div className="bg-background/50 border border-border rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-xs text-text-muted mb-1">
            <Shield className="w-3 h-3" />
            Actions
          </div>
          <div className={`text-lg font-bold ${group.actionsToday > 15 ? 'text-warning' : 'text-text-primary'}`}>
            {group.actionsToday}
          </div>
          <div className="text-xs text-text-muted mt-0.5">today</div>
        </div>
      </div>

      {/* Module Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-text-muted mb-2">
          <span>Modules Active</span>
          <span className="font-medium text-text-secondary">
            {group.activeModules} / {group.totalModules}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${modulePercent}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-4 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Joined {formatDate(group.joinedAt)}
          </span>
          <span className={`flex items-center gap-1.5 ${group.botActive ? 'text-success' : 'text-destructive'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${group.botActive ? 'bg-success' : 'bg-destructive'}`} />
            {group.botActive ? 'Bot Active' : 'Bot Offline'}
          </span>
        </div>
        <button
          onClick={handleViewDashboard}
          className="flex items-center gap-1 text-xs text-primary hover:text-primary-glow font-medium transition-colors"
        >
          View <ArrowUpRight className="w-3 h-3" />
        </button>
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
  const TrendIcon = trend?.direction === 'up' ? TrendingUp : TrendingDown;
  const trendColor = trend?.direction === 'up' ? 'text-success' : 'text-destructive';

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

export default function ManageGroupsPage() {
  const navigate = useNavigate();
  const { context } = useGlide();
  const networkId = context.type === 'network' ? context.networkId : mockNetworks[0].id;
  const network = getNetworkById(networkId) ?? mockNetworks[0];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
  const [filterHealth, setFilterHealth] = useState<'all' | 'healthy' | 'warning' | 'critical'>('all');
  const [filterBotStatus, setFilterBotStatus] = useState<'all' | 'active' | 'offline'>('all');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);

  // Filtering
  const filteredGroups = network.groups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesHealth = filterHealth === 'all' || group.health === filterHealth;
    const matchesBotStatus =
      filterBotStatus === 'all' ||
      (filterBotStatus === 'active' && group.botActive) ||
      (filterBotStatus === 'offline' && !group.botActive);

    return matchesSearch && matchesHealth && matchesBotStatus;
  });

  const activeFiltersCount = [filterHealth, filterBotStatus].filter(f => f !== 'all').length;

  const clearFilters = () => {
    setFilterHealth('all');
    setFilterBotStatus('all');
  };

  // Selection
  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedGroups);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedGroups(newSet);
  };

  const selectAll = () => {
    if (selectedGroups.size === filteredGroups.length) {
      setSelectedGroups(new Set());
    } else {
      setSelectedGroups(new Set(filteredGroups.map(g => g.id)));
    }
  };

  const handleGroupAction = (action: string, group: Group) => {
    console.log(`Action: ${action} on group`, group);
    alert(`${action} on ${group.name}`);
  };

  const handleBulkAction = (action: string) => {
    if (selectedGroups.size === 0) {
      alert('Please select at least one group');
      return;
    }
    console.log(`Bulk action: ${action} on`, Array.from(selectedGroups));
    alert(`Bulk ${action} on ${selectedGroups.size} group(s)`);
    setSelectedGroups(new Set());
  };

  // Stats
  const totalGroups = network.groups.length;
  const healthyGroups = network.groups.filter(g => g.health === 'healthy').length;
  const activeBotsCount = network.groups.filter(g => g.botActive).length;
  const totalMembers = network.groups.reduce((sum, g) => sum + g.memberCount, 0);
  const totalMessagesToday = network.groups.reduce((sum, g) => sum + g.messagesToday, 0);
  const groupsWithIssues = network.groups.filter(g => g.health !== 'healthy').length;

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-[1440px] mx-auto p-8 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => navigate('/network')}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                <Globe className="w-5 h-5" />
              </button>
              <span className="text-text-muted">/</span>
              <h1 className="text-[28px] font-bold text-text-primary">Manage Groups</h1>
            </div>
            <p className="text-sm text-text-muted">
              {network.name} · {totalGroups} group{totalGroups !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => setShowAddGroupModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-glow text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Group
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard label="Total Groups" value={totalGroups} icon={Globe} />
          <StatCard label="Healthy" value={healthyGroups} icon={CheckCircle2} />
          <StatCard label="Issues" value={groupsWithIssues} icon={AlertTriangle} />
          <StatCard label="Active Bots" value={activeBotsCount} icon={Activity} />
          <StatCard
            label="Total Members"
            value={formatNumber(totalMembers)}
            icon={Users}
            trend={{ value: '+12%', direction: 'up' }}
          />
          <StatCard
            label="Messages Today"
            value={formatNumber(totalMessagesToday)}
            icon={MessageSquare}
            trend={{ value: '+8%', direction: 'up' }}
          />
        </div>

        {/* Toolbar */}
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search groups by name or username..."
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
                  <div className="absolute right-0 top-full mt-2 w-64 bg-surface-2 border border-border rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.4)] z-20 p-4 space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-2 block">
                        Health Status
                      </label>
                      <select
                        value={filterHealth}
                        onChange={(e) => setFilterHealth(e.target.value as any)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary"
                      >
                        <option value="all">All Groups</option>
                        <option value="healthy">Healthy</option>
                        <option value="warning">Warning</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-2 block">
                        Bot Status
                      </label>
                      <select
                        value={filterBotStatus}
                        onChange={(e) => setFilterBotStatus(e.target.value as any)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary"
                      >
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="offline">Offline</option>
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

            {/* Select All */}
            <button
              onClick={selectAll}
              className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:border-primary transition-colors"
            >
              <Check className="w-4 h-4" />
              {selectedGroups.size === filteredGroups.length && filteredGroups.length > 0
                ? 'Deselect All'
                : 'Select All'}
            </button>
          </div>

          {/* Bulk Actions */}
          {selectedGroups.size > 0 && (
            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
              <span className="text-sm text-text-secondary">
                {selectedGroups.size} group{selectedGroups.size !== 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBulkAction('enable-modules')}
                  className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
                >
                  Enable Modules
                </button>
                <button
                  onClick={() => handleBulkAction('sync-settings')}
                  className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
                >
                  Sync Settings
                </button>
                <button
                  onClick={() => handleBulkAction('remove')}
                  className="px-3 py-1.5 bg-destructive/10 text-destructive rounded-lg text-sm font-medium hover:bg-destructive/20 transition-colors"
                >
                  Remove
                </button>
                <button
                  onClick={() => setSelectedGroups(new Set())}
                  className="px-3 py-1.5 bg-muted text-text-muted rounded-lg text-sm font-medium hover:bg-surface-2 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Groups Grid */}
        {filteredGroups.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredGroups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onAction={handleGroupAction}
                  onSelect={toggleSelect}
                  selected={selectedGroups.has(group.id)}
                />
              ))}
            </div>

            <div className="text-sm text-text-muted text-center">
              Showing {filteredGroups.length} of {totalGroups} groups
            </div>
          </>
        ) : (
          <div className="bg-surface border border-border rounded-lg p-12 text-center">
            <Globe className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary">No groups found</p>
            <p className="text-sm text-text-muted mt-1">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Add Group Modal */}
        {showAddGroupModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-surface-2 border border-border rounded-xl max-w-md w-full p-6 shadow-[0_25px_50px_rgba(0,0,0,0.6)]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-text-primary">Add Group to Network</h2>
                <button
                  onClick={() => setShowAddGroupModal(false)}
                  className="p-1 rounded hover:bg-surface transition-colors text-text-muted hover:text-text-primary"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-text-primary mb-2 block">
                    Group Link or Username
                  </label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="text"
                      placeholder="https://t.me/yourgroup or @yourgroup"
                      className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
                    />
                  </div>
                  <p className="text-xs text-text-muted mt-1">
                    Make sure the bot is already added as admin to the group
                  </p>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                  <p className="text-xs text-text-secondary">
                    ℹ️ The bot must have admin permissions in the group before you can add it to this network.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowAddGroupModal(false)}
                    className="flex-1 px-4 py-2 bg-muted text-text-secondary rounded-lg text-sm font-medium hover:bg-surface-2 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      alert('Group added to network!');
                      setShowAddGroupModal(false);
                    }}
                    className="flex-1 px-4 py-2 bg-primary hover:bg-primary-glow text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Add Group
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

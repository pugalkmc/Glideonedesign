import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GitCompare, Plus, X, Users, MessageSquare, Shield, Activity,
  TrendingUp, TrendingDown, ArrowUpRight, CheckCircle2, AlertTriangle,
  XCircle, Zap, Calendar, Crown, Medal, Award, Target, Eye,
} from 'lucide-react';
import {
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, LineChart, Line, Legend,
} from 'recharts';
import { useGlide } from '../context/GlideContext';
import { mockNetworks, getNetworkById, getInitials, type Group } from '../data/networks';

// ─── Helper Functions ─────────────────────────────────────────────────────────

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return String(n);
}

function calculateEngagementRate(group: Group): number {
  // Engagement = (messages today / total members) * 100
  return Math.round((group.messagesToday / group.memberCount) * 100 * 10) / 10;
}

function calculateModRatio(group: Group): number {
  // Mod actions per 1000 messages
  return Math.round((group.actionsToday / group.messagesToday) * 1000 * 10) / 10;
}

function calculateHealthScore(group: Group): number {
  const engagementRate = calculateEngagementRate(group);
  const modulePercent = (group.activeModules / group.totalModules) * 100;
  const healthBonus = group.health === 'healthy' ? 20 : group.health === 'warning' ? 10 : 0;
  const botBonus = group.botActive ? 10 : 0;

  return Math.min(100, Math.round(engagementRate * 2 + modulePercent * 0.3 + healthBonus + botBonus));
}

const healthConfig = {
  healthy: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
  warning: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10' },
  critical: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

// 7-day trend data for selected groups
const getTrendData = (groups: Group[]) => {
  return [
    { day: 'Mon', ...groups.reduce((acc, g, i) => ({ ...acc, [g.name]: 900 + i * 200 }), {}) },
    { day: 'Tue', ...groups.reduce((acc, g, i) => ({ ...acc, [g.name]: 1100 + i * 250 }), {}) },
    { day: 'Wed', ...groups.reduce((acc, g, i) => ({ ...acc, [g.name]: 1000 + i * 220 }), {}) },
    { day: 'Thu', ...groups.reduce((acc, g, i) => ({ ...acc, [g.name]: 1300 + i * 280 }), {}) },
    { day: 'Fri', ...groups.reduce((acc, g, i) => ({ ...acc, [g.name]: 1500 + i * 320 }), {}) },
    { day: 'Sat', ...groups.reduce((acc, g, i) => ({ ...acc, [g.name]: 1600 + i * 350 }), {}) },
    { day: 'Sun', ...groups.reduce((acc, g, i) => ({ ...acc, [g.name]: g.messagesToday }), {}) },
  ];
};

const colors = ['#6366F1', '#06B6D4', '#F59E0B', '#EC4899', '#10B981', '#8B5CF6'];

// ─── Components ───────────────────────────────────────────────────────────────

function GroupSelector({
  selectedGroups,
  onAdd,
  onRemove,
  allGroups,
}: {
  selectedGroups: Group[];
  onAdd: (group: Group) => void;
  onRemove: (groupId: string) => void;
  allGroups: Group[];
}) {
  const [showPicker, setShowPicker] = useState(false);
  const availableGroups = allGroups.filter(
    g => !selectedGroups.find(sg => sg.id === g.id)
  );

  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <div className="flex items-center gap-3 flex-wrap">
        {selectedGroups.map((group) => (
          <div
            key={group.id}
            className="flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/30 rounded-lg"
          >
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary/60 to-accent/60 flex items-center justify-center text-xs font-bold text-white">
              {getInitials(group.name)}
            </div>
            <span className="text-sm font-medium text-text-primary">{group.name}</span>
            <button
              onClick={() => onRemove(group.id)}
              className="p-0.5 rounded hover:bg-destructive/20 text-text-muted hover:text-destructive transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {selectedGroups.length < 6 && (
          <div className="relative">
            <button
              onClick={() => setShowPicker(!showPicker)}
              className="flex items-center gap-2 px-3 py-2 border-2 border-dashed border-border hover:border-primary rounded-lg text-sm font-medium text-text-muted hover:text-primary transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Group
            </button>

            {showPicker && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowPicker(false)} />
                <div className="absolute left-0 top-full mt-2 w-64 bg-surface-2 border border-border rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.4)] z-20 max-h-80 overflow-auto">
                  {availableGroups.length > 0 ? (
                    availableGroups.map((group) => (
                      <button
                        key={group.id}
                        onClick={() => {
                          onAdd(group);
                          setShowPicker(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-sidebar-accent transition-colors"
                      >
                        <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary/60 to-accent/60 flex items-center justify-center text-xs font-bold text-white">
                          {getInitials(group.name)}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="text-sm font-medium text-text-primary truncate">
                            {group.name}
                          </div>
                          <div className="text-xs text-text-muted truncate">{group.username}</div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-4 text-center text-sm text-text-muted">
                      No more groups available
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {selectedGroups.length < 2 && (
        <p className="text-xs text-text-muted mt-3">
          Select at least 2 groups to compare
        </p>
      )}
    </div>
  );
}

function ComparisonCard({ group, rank }: { group: Group; rank: number }) {
  const navigate = useNavigate();
  const { setContext } = useGlide();
  const health = healthConfig[group.health];
  const HealthIcon = health.icon;
  const engagementRate = calculateEngagementRate(group);
  const healthScore = calculateHealthScore(group);

  const RankIcon = rank === 1 ? Crown : rank === 2 ? Medal : rank === 3 ? Award : Target;
  const rankColor = rank === 1 ? 'text-yellow-400' : rank === 2 ? 'text-gray-400' : rank === 3 ? 'text-orange-400' : 'text-text-muted';

  const handleViewDashboard = () => {
    setContext({ type: 'group', networkId: group.networkId, groupId: group.id });
    navigate('/dashboard');
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-5 space-y-4 hover:border-primary/30 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-base font-bold text-text-primary shrink-0">
            {getInitials(group.name)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-text-primary truncate">{group.name}</h3>
            <p className="text-xs text-text-muted font-mono truncate">{group.username}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <RankIcon className={`w-5 h-5 ${rankColor}`} />
          <HealthIcon className={`w-4 h-4 ${health.color}`} />
        </div>
      </div>

      {/* Health Score */}
      <div className="bg-background/50 border border-border rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-muted uppercase tracking-wider">Health Score</span>
          <span className="text-xl font-bold text-text-primary">{healthScore}</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
            style={{ width: `${healthScore}%` }}
          />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-background/50 border border-border rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-xs text-text-muted mb-1">
            <Users className="w-3 h-3" />
            Members
          </div>
          <div className="text-lg font-bold text-text-primary">{formatNumber(group.memberCount)}</div>
          <div className="text-xs text-text-muted">{group.online} online</div>
        </div>

        <div className="bg-background/50 border border-border rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-xs text-text-muted mb-1">
            <MessageSquare className="w-3 h-3" />
            Messages
          </div>
          <div className="text-lg font-bold text-text-primary">{formatNumber(group.messagesToday)}</div>
          <div className="text-xs text-text-muted">today</div>
        </div>

        <div className="bg-background/50 border border-border rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-xs text-text-muted mb-1">
            <Activity className="w-3 h-3" />
            Engagement
          </div>
          <div className="text-lg font-bold text-text-primary">{engagementRate}%</div>
          <div className="text-xs text-text-muted">msg/member</div>
        </div>

        <div className="bg-background/50 border border-border rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-xs text-text-muted mb-1">
            <Shield className="w-3 h-3" />
            Actions
          </div>
          <div className={`text-lg font-bold ${group.actionsToday > 15 ? 'text-warning' : 'text-text-primary'}`}>
            {group.actionsToday}
          </div>
          <div className="text-xs text-text-muted">today</div>
        </div>
      </div>

      {/* Modules & Bot Status */}
      <div className="space-y-2">
        <div>
          <div className="flex items-center justify-between text-xs text-text-muted mb-1">
            <span>Modules Active</span>
            <span className="font-medium text-text-secondary">
              {group.activeModules} / {group.totalModules}
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${(group.activeModules / group.totalModules) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className={`flex items-center gap-1.5 text-xs ${group.botActive ? 'text-success' : 'text-destructive'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${group.botActive ? 'bg-success' : 'bg-destructive'}`} />
            {group.botActive ? 'Bot Active' : 'Bot Offline'}
          </span>
          <button
            onClick={handleViewDashboard}
            className="flex items-center gap-1 text-xs text-primary hover:text-primary-glow font-medium transition-colors"
          >
            View <Eye className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricComparison({ label, groups, getValue, icon: Icon }: {
  label: string;
  groups: Group[];
  getValue: (group: Group) => number;
  icon: React.ElementType;
}) {
  const values = groups.map(g => ({ name: g.name, value: getValue(g) }));
  const max = Math.max(...values.map(v => v.value));

  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-text-primary">{label}</h3>
      </div>
      <div className="space-y-3">
        {values.map((item, idx) => (
          <div key={item.name}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-text-secondary truncate">{item.name}</span>
              <span className="font-bold text-text-primary ml-2">
                {typeof item.value === 'number' && item.value > 100 ? formatNumber(item.value) : item.value}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(item.value / max) * 100}%`,
                  backgroundColor: colors[idx % colors.length],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GroupComparisonPage() {
  const navigate = useNavigate();
  const { context } = useGlide();
  const networkId = context.type === 'network' ? context.networkId : mockNetworks[0].id;
  const network = getNetworkById(networkId) ?? mockNetworks[0];

  const [selectedGroups, setSelectedGroups] = useState<Group[]>(
    network.groups.slice(0, 3) // Pre-select first 3 groups
  );

  const handleAddGroup = (group: Group) => {
    if (selectedGroups.length < 6) {
      setSelectedGroups([...selectedGroups, group]);
    }
  };

  const handleRemoveGroup = (groupId: string) => {
    setSelectedGroups(selectedGroups.filter(g => g.id !== groupId));
  };

  // Rankings by health score
  const rankedGroups = [...selectedGroups].sort((a, b) => {
    return calculateHealthScore(b) - calculateHealthScore(a);
  });

  // Radar chart data
  const radarData = selectedGroups.length > 0 ? [
    {
      metric: 'Members',
      ...selectedGroups.reduce((acc, g, i) => ({
        ...acc,
        [g.name]: Math.min(100, (g.memberCount / 15000) * 100)
      }), {})
    },
    {
      metric: 'Messages',
      ...selectedGroups.reduce((acc, g, i) => ({
        ...acc,
        [g.name]: Math.min(100, (g.messagesToday / 2000) * 100)
      }), {})
    },
    {
      metric: 'Engagement',
      ...selectedGroups.reduce((acc, g) => ({
        ...acc,
        [g.name]: Math.min(100, calculateEngagementRate(g) * 10)
      }), {})
    },
    {
      metric: 'Modules',
      ...selectedGroups.reduce((acc, g) => ({
        ...acc,
        [g.name]: (g.activeModules / g.totalModules) * 100
      }), {})
    },
    {
      metric: 'Health',
      ...selectedGroups.reduce((acc, g) => ({
        ...acc,
        [g.name]: calculateHealthScore(g)
      }), {})
    },
  ] : [];

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
                <GitCompare className="w-5 h-5" />
              </button>
              <span className="text-text-muted">/</span>
              <h1 className="text-[28px] font-bold text-text-primary">Group Comparison</h1>
            </div>
            <p className="text-sm text-text-muted">
              {network.name} · Compare up to 6 groups side-by-side
            </p>
          </div>
        </div>

        {/* Group Selector */}
        <GroupSelector
          selectedGroups={selectedGroups}
          onAdd={handleAddGroup}
          onRemove={handleRemoveGroup}
          allGroups={network.groups}
        />

        {selectedGroups.length >= 2 ? (
          <>
            {/* Rankings */}
            <div className="bg-surface border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Performance Ranking</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rankedGroups.map((group, idx) => (
                  <ComparisonCard key={group.id} group={group} rank={idx + 1} />
                ))}
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Message Trend */}
              <div className="bg-surface border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4">Message Activity Trend</h2>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={getTrendData(selectedGroups)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgb(42,42,56)" />
                    <XAxis dataKey="day" stroke="rgb(148,163,184)" fontSize={11} />
                    <YAxis stroke="rgb(148,163,184)" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgb(17,17,24)',
                        border: '1px solid rgb(42,42,56)',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    {selectedGroups.map((group, idx) => (
                      <Line
                        key={group.id}
                        type="monotone"
                        dataKey={group.name}
                        stroke={colors[idx % colors.length]}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Radar Chart */}
              <div className="bg-surface border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4">Overall Performance</h2>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgb(42,42,56)" />
                    <PolarAngleAxis dataKey="metric" stroke="rgb(148,163,184)" fontSize={11} />
                    <PolarRadiusAxis stroke="rgb(148,163,184)" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgb(17,17,24)',
                        border: '1px solid rgb(42,42,56)',
                        borderRadius: '8px',
                      }}
                    />
                    {selectedGroups.map((group, idx) => (
                      <Radar
                        key={group.id}
                        name={group.name}
                        dataKey={group.name}
                        stroke={colors[idx % colors.length]}
                        fill={colors[idx % colors.length]}
                        fillOpacity={0.2}
                      />
                    ))}
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Metric Comparisons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricComparison
                label="Total Members"
                groups={selectedGroups}
                getValue={(g) => g.memberCount}
                icon={Users}
              />
              <MetricComparison
                label="Messages Today"
                groups={selectedGroups}
                getValue={(g) => g.messagesToday}
                icon={MessageSquare}
              />
              <MetricComparison
                label="Engagement Rate"
                groups={selectedGroups}
                getValue={(g) => calculateEngagementRate(g)}
                icon={Activity}
              />
              <MetricComparison
                label="Mod Actions"
                groups={selectedGroups}
                getValue={(g) => g.actionsToday}
                icon={Shield}
              />
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-text-primary mb-2">Key Insights</h3>
                  <ul className="space-y-2 text-sm text-text-secondary">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                      <span>
                        <strong>{rankedGroups[0]?.name}</strong> leads with a health score of{' '}
                        {calculateHealthScore(rankedGroups[0])} - highest engagement and module adoption
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                      <span>
                        {selectedGroups.filter(g => !g.botActive).length > 0
                          ? `${selectedGroups.filter(g => !g.botActive).map(g => g.name).join(', ')} ${
                              selectedGroups.filter(g => !g.botActive).length === 1 ? 'has' : 'have'
                            } bot offline - enable to improve moderation`
                          : 'All bots are active across selected groups'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>
                        Average engagement rate: {(selectedGroups.reduce((sum, g) => sum + calculateEngagementRate(g), 0) / selectedGroups.length).toFixed(1)}%
                        - groups with higher engagement tend to have better member retention
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </>
        ) : (
          <div className="bg-surface border border-border rounded-lg p-16 text-center">
            <GitCompare className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">Select Groups to Compare</h3>
            <p className="text-sm text-text-muted max-w-md mx-auto">
              Choose at least 2 groups from the selector above to see side-by-side comparisons,
              performance rankings, and actionable insights.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

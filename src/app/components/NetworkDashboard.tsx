import { useNavigate } from 'react-router-dom';
import {
  Globe, Radio, Sun, Moon, Bell, Users, Activity, MessageSquare, Shield,
  Layers, GitCompare, Zap, ArrowRight, TrendingUp, TrendingDown,
  CheckCircle2, AlertCircle, XCircle,
} from 'lucide-react';
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useGlide } from '../context/GlideContext';
import {
  mockNetworks, getNetworkById, getNetworkTotals,
  getInitials, type Group,
} from '../data/networks';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return String(n);
}

const healthConfig = {
  healthy: { label: 'Healthy', color: 'text-success', bg: 'bg-success/10 border-success/20', dot: 'bg-success', Icon: CheckCircle2 },
  warning: { label: 'Warning', color: 'text-warning', bg: 'bg-warning/10 border-warning/20', dot: 'bg-warning', Icon: AlertCircle },
  critical: { label: 'Critical', color: 'text-destructive', bg: 'bg-destructive/10 border-destructive/20', dot: 'bg-destructive', Icon: XCircle },
};

// ─── Cross-group activity feed (mock) ─────────────────────────────────────────
const crossActivity = [
  { group: 'CryptoTalk Main', user: 'Spammer99', action: 'banned', reason: 'Spam links', time: '2m ago', type: 'ban' },
  { group: 'NFT Collectors', user: 'FloodBot', action: 'muted for 24h', reason: 'Flooding', time: '11m ago', type: 'mute' },
  { group: 'CryptoTalk Alt', user: 'PriceAlert', action: 'warned', reason: 'Off-topic', time: '34m ago', type: 'warn' },
  { group: 'GamersHub', user: 'ToxicUser', action: 'kicked', reason: 'Harassment', time: '1h ago', type: 'kick' },
  { group: 'CryptoTalk Main', user: 'ScamBot', action: 'banned', reason: 'Phishing link', time: '2h ago', type: 'ban' },
  { group: 'NFT Collectors', user: 'Lurker42', action: 'warned', reason: 'NSFW', time: '3h ago', type: 'warn' },
];

const actBorder: Record<string, string> = {
  ban: 'border-destructive',
  mute: 'border-warning',
  kick: 'border-text-muted',
  warn: 'border-warning/50',
};
const actBadge: Record<string, string> = {
  ban: 'bg-destructive/10 text-destructive border-destructive/20',
  mute: 'bg-warning/10 text-warning border-warning/20',
  kick: 'bg-muted text-text-muted border-border',
  warn: 'bg-warning/10 text-warning border-warning/20',
};

// 7-day mock message trend per network
const networkTrend = [
  { day: 'Mon', 'Crypto Hub': 3200, 'Gaming Network': 2900 },
  { day: 'Tue', 'Crypto Hub': 4100, 'Gaming Network': 3400 },
  { day: 'Wed', 'Crypto Hub': 3700, 'Gaming Network': 3800 },
  { day: 'Thu', 'Crypto Hub': 4500, 'Gaming Network': 4100 },
  { day: 'Fri', 'Crypto Hub': 5200, 'Gaming Network': 4800 },
  { day: 'Sat', 'Crypto Hub': 5800, 'Gaming Network': 5100 },
  { day: 'Sun', 'Crypto Hub': 2666, 'Gaming Network': 3232 },
];

// ─── GroupCard ────────────────────────────────────────────────────────────────
function GroupCard({ group, onClick }: { group: Group; onClick: () => void }) {
  const h = healthConfig[group.health];
  const HIcon = h.Icon;
  const modulePercent = Math.round((group.activeModules / group.totalModules) * 100);

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-surface border border-border rounded-[var(--radius-md)] p-5 hover:border-primary/40 hover:bg-surface-2 transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-sm font-bold text-text-primary">
            {getInitials(group.name)}
          </div>
          <div>
            <div className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
              {group.name}
            </div>
            <div className="text-xs text-text-muted font-mono mt-0.5">{group.username}</div>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs font-medium ${h.bg} ${h.color}`}>
          <HIcon className="w-3 h-3" />
          {h.label}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <div className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">Members</div>
          <div className="text-base font-bold text-text-primary">{fmt(group.memberCount)}</div>
        </div>
        <div>
          <div className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">Msgs Today</div>
          <div className="text-base font-bold text-text-primary">{fmt(group.messagesToday)}</div>
        </div>
        <div>
          <div className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">Actions</div>
          <div className={`text-base font-bold ${group.actionsToday > 15 ? 'text-warning' : 'text-text-primary'}`}>
            {group.actionsToday}
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>Modules active</span>
          <span className="font-medium text-text-secondary">{group.activeModules} / {group.totalModules}</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: `${modulePercent}%` }}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className={`flex items-center gap-1.5 text-xs ${group.botActive ? 'text-success' : 'text-destructive'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${group.botActive ? 'bg-success' : 'bg-destructive'}`} />
          {group.botActive ? 'Bot Active' : 'Bot Offline'}
        </div>
        <div className="flex items-center gap-1 text-xs text-text-muted group-hover:text-primary transition-colors">
          Manage <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </button>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
function StatCard({
  label, value, sub, subPositive, icon: Icon, accent,
}: {
  label: string;
  value: string;
  sub?: string;
  subPositive?: boolean;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <div className={`bg-surface border rounded-[var(--radius-md)] p-5 space-y-3 ${accent ? 'border-primary/30 bg-primary/5' : 'border-border'}`}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-text-muted uppercase tracking-wider">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent ? 'bg-primary/20' : 'bg-surface-2'}`}>
          <Icon className={`w-4 h-4 ${accent ? 'text-primary' : 'text-text-secondary'}`} />
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold text-text-primary">{value}</div>
        {sub && (
          <div className={`text-xs mt-1 flex items-center gap-1 ${subPositive ? 'text-success' : 'text-text-muted'}`}>
            {subPositive !== undefined && (subPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />)}
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── NetworkDashboard ─────────────────────────────────────────────────────────
export default function NetworkDashboard({
  theme,
  onThemeToggle,
}: {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}) {
  const { context, setContext } = useGlide();
  const navigate = useNavigate();

  // In network view, context.networkId is the selected network
  const networkId = context.type === 'network' ? context.networkId : mockNetworks[0].id;
  const network = getNetworkById(networkId) ?? mockNetworks[0];
  const totals = getNetworkTotals(network);

  function switchToGroup(groupId: string) {
    setContext({ type: 'group', networkId: network.id, groupId });
    navigate('/dashboard');
  }

  // Bar chart data: groups comparison
  const groupBarData = network.groups.map((g) => ({
    name: g.name.split(' ')[0], // first word for space
    Messages: g.messagesToday,
    Members: Math.round(g.memberCount / 100), // scale for display
    Actions: g.actionsToday * 10,
  }));

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-[1280px] mx-auto p-8 space-y-8">

        {/* ── Top bar ── */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500/70 to-cyan-500/70 flex items-center justify-center">
                <Globe className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Network View</span>
            </div>
            <h1 className="text-[28px] font-bold text-text-primary">{network.name}</h1>
            <p className="text-sm text-text-muted mt-1">{network.description} · {totals.totalGroups} groups</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick actions */}
            <button
              onClick={() => navigate('/network/broadcast')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-glow text-white text-sm font-medium transition-colors"
            >
              <Radio className="w-4 h-4" />
              Broadcast to All
            </button>
            <button
              onClick={onThemeToggle}
              className="p-2.5 rounded-lg hover:bg-surface border border-border transition-colors text-text-secondary"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button className="p-2.5 rounded-lg hover:bg-surface border border-border relative transition-colors text-text-secondary">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </button>
          </div>
        </div>

        {/* ── KPI Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard label="Total Members"     value={fmt(totals.totalMembers)}      sub="across all groups"       icon={Users}          />
          <StatCard label="Online Now"        value={fmt(totals.totalOnline)}        sub="+3.2% vs yesterday"     subPositive icon={Activity}        />
          <StatCard label="Messages Today"    value={fmt(totals.totalMessagesToday)} sub="+12% vs yesterday"      subPositive icon={MessageSquare}   />
          <StatCard label="Actions Today"     value={String(totals.totalActionsToday)} sub="across network"       icon={Shield}          />
          <StatCard label="Active Groups"     value={`${totals.activeGroups} / ${totals.totalGroups}`} sub="bot online" icon={Globe} accent />
        </div>

        {/* ── Quick network actions ── */}
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Manage Groups',    icon: Layers,      href: '/network/groups' },
            { label: 'Group Comparison', icon: GitCompare,  href: '/network/comparison' },
            { label: 'Member Directory', icon: Users,       href: '/network/members' },
            { label: 'Shared Modules',   icon: Zap,         href: '/network/shared-modules' },
            { label: 'Network Settings', icon: Shield,      href: '/network/settings' },
          ].map(({ label, icon: Icon, href }) => (
            <button
              key={label}
              onClick={() => navigate(href)}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface hover:border-primary/30 transition-all"
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* ── Groups overview ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">Groups in this Network</h2>
            <button
              onClick={() => navigate('/network/groups')}
              className="text-sm text-primary hover:text-primary-glow flex items-center gap-1 transition-colors"
            >
              Manage groups <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {network.groups.map((group) => (
              <GroupCard key={group.id} group={group} onClick={() => switchToGroup(group.id)} />
            ))}

            {/* Add group placeholder */}
            <button
              onClick={() => navigate('/network/groups')}
              className="border-2 border-dashed border-border rounded-[var(--radius-md)] p-5 flex flex-col items-center justify-center gap-3 hover:border-primary/40 hover:bg-primary/5 transition-all text-text-muted hover:text-primary min-h-[200px]"
            >
              <div className="w-10 h-10 rounded-xl border-2 border-dashed border-current flex items-center justify-center">
                <span className="text-xl leading-none">+</span>
              </div>
              <span className="text-sm font-medium">Add a group</span>
            </button>
          </div>
        </div>

        {/* ── Charts row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Messages per group — bar chart (3/5) */}
          <div className="lg:col-span-3 bg-surface border border-border rounded-[var(--radius-md)] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-primary">Message Volume by Group</h2>
              <span className="text-xs text-text-muted">Today</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={groupBarData} barCategoryGap="30%">
                <XAxis dataKey="name" stroke="rgb(148,163,184)" fontSize={12} />
                <YAxis stroke="rgb(148,163,184)" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgb(17,17,24)', border: '1px solid rgb(42,42,56)', borderRadius: '8px' }}
                  labelStyle={{ color: 'rgb(241,245,249)' }}
                />
                <Bar dataKey="Messages" fill="rgb(99,102,241)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Network trend area chart (2/5) */}
          <div className="lg:col-span-2 bg-surface border border-border rounded-[var(--radius-md)] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-primary">Network Activity</h2>
              <span className="text-xs text-text-muted">7 days</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={networkTrend}>
                <defs>
                  <linearGradient id="cryptoGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="rgb(99,102,241)"  stopOpacity={0.35} />
                    <stop offset="95%" stopColor="rgb(99,102,241)"  stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gamingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="rgb(6,182,212)"   stopOpacity={0.35} />
                    <stop offset="95%" stopColor="rgb(6,182,212)"   stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="rgb(148,163,184)" fontSize={11} />
                <YAxis stroke="rgb(148,163,184)" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgb(17,17,24)', border: '1px solid rgb(42,42,56)', borderRadius: '8px' }}
                  labelStyle={{ color: 'rgb(241,245,249)' }}
                />
                <Area type="monotone" dataKey="Crypto Hub"    stroke="rgb(99,102,241)" fill="url(#cryptoGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="Gaming Network" stroke="rgb(6,182,212)"  fill="url(#gamingGrad)"  strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <span className="w-3 h-0.5 bg-primary rounded-full inline-block" />
                Crypto Hub
              </div>
              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <span className="w-3 h-0.5 bg-accent rounded-full inline-block" />
                Gaming Network
              </div>
            </div>
          </div>
        </div>

        {/* ── Cross-group activity ── */}
        <div className="bg-surface border border-border rounded-[var(--radius-md)] p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Cross-Group Activity</h2>
              <p className="text-xs text-text-muted mt-0.5">Recent moderation actions across all groups in this network</p>
            </div>
            <button className="text-sm text-primary hover:text-primary-glow flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {crossActivity.map((a, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 p-3 border-l-2 ${actBorder[a.type]} bg-surface-2 rounded-r-lg`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xs font-bold text-text-primary shrink-0">
                  {a.user[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm">
                    <span className="font-medium text-text-primary">@{a.user}</span>
                    <span className="text-text-secondary"> was {a.action}</span>
                  </div>
                  <div className="text-xs text-text-muted mt-0.5">{a.reason}</div>
                </div>
                {/* Group badge */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2 py-0.5 rounded-md bg-surface border border-border text-xs text-text-muted">
                    {a.group}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md border text-xs font-medium ${actBadge[a.type]}`}>
                    {a.type}
                  </span>
                  <span className="text-xs text-text-muted w-12 text-right">{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Shared config banner ── */}
        <div className="rounded-[var(--radius-md)] border border-indigo-500/20 bg-gradient-to-r from-indigo-500/5 to-cyan-500/5 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <div className="text-base font-semibold text-text-primary">Shared Modules</div>
              <div className="text-sm text-text-muted mt-0.5">
                <span className="text-indigo-400 font-medium">{network.sharedModulesCount} modules</span> are currently applied across all groups in this network
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/network/shared-modules')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-sm font-medium transition-colors border border-indigo-500/30"
          >
            Configure <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
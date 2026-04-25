import { useState } from 'react';
import {
  TrendingUp, TrendingDown, Users, MessageSquare, Clock, Shield,
  Target, Lightbulb, Calendar, ArrowUpRight, ArrowDownRight,
  Activity, UserPlus, UserMinus, Zap, AlertTriangle, CheckCircle2,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

// ─── Mock Analytics Data ──────────────────────────────────────────────────────

const growthData = [
  { date: 'Week 1', members: 2420, messages: 5200, engagement: 68 },
  { date: 'Week 2', members: 2568, messages: 6100, engagement: 71 },
  { date: 'Week 3', members: 2701, messages: 6800, engagement: 73 },
  { date: 'Week 4', members: 2847, messages: 8432, engagement: 76 },
];

const hourlyActivity = [
  { hour: '00:00', messages: 120, members: 45 },
  { hour: '03:00', messages: 80, members: 30 },
  { hour: '06:00', messages: 200, members: 85 },
  { hour: '09:00', messages: 450, members: 180 },
  { hour: '12:00', messages: 680, members: 280 },
  { hour: '15:00', messages: 720, members: 310 },
  { hour: '18:00', messages: 890, members: 350 },
  { hour: '21:00', messages: 650, members: 290 },
];

const memberSegments = [
  { name: 'Highly Active', value: 342, color: '#6366F1', description: '5+ msg/day' },
  { name: 'Active', value: 856, color: '#06B6D4', description: '1-5 msg/day' },
  { name: 'Occasional', value: 1124, color: '#F59E0B', description: 'Few msg/week' },
  { name: 'Lurkers', value: 525, color: '#94A3B8', description: 'Read only' },
];

const retentionData = [
  { week: 'Week 1', newMembers: 156, retained: 156, churnRate: 0 },
  { week: 'Week 2', newMembers: 148, retained: 142, churnRate: 4 },
  { week: 'Week 3', newMembers: 133, retained: 119, churnRate: 11 },
  { week: 'Week 4', newMembers: 146, retained: 128, churnRate: 12 },
];

const moderationMetrics = [
  { metric: 'Avg Response Time', value: '2.3 min', trend: 'down', change: '-18%', good: true },
  { metric: 'False Positives', value: '3.2%', trend: 'down', change: '-1.1%', good: true },
  { metric: 'Appeal Rate', value: '8.5%', trend: 'neutral', change: '+0.2%', good: true },
  { metric: 'Repeat Offenders', value: '12%', trend: 'down', change: '-5%', good: true },
];

// ─── Insights & Recommendations ───────────────────────────────────────────────

const insights = [
  {
    type: 'success',
    icon: CheckCircle2,
    title: 'Peak Engagement Time Identified',
    description: 'Activity peaks at 6-9 PM. Schedule important announcements during this window for maximum reach.',
    action: 'Schedule posts strategically',
  },
  {
    type: 'warning',
    icon: AlertTriangle,
    title: 'Lurker Percentage Rising',
    description: '18% of members are inactive lurkers (up 3%). Consider engagement campaigns or polls to activate them.',
    action: 'Run engagement campaign',
  },
  {
    type: 'info',
    icon: Lightbulb,
    title: 'Weekend Activity Opportunity',
    description: 'Saturday shows highest message volume but lowest member participation. Your active users are highly engaged.',
    action: 'Incentivize weekend participation',
  },
  {
    type: 'success',
    icon: Target,
    title: 'Retention Improving',
    description: 'Week 4 retention is 87.7% (up from 82%). Your recent welcome flow changes are working.',
    action: 'Continue current onboarding',
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  change,
  trend,
  icon: Icon,
}: {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
}) {
  const trendColor = trend === 'up' ? 'text-success' : trend === 'down' ? 'text-destructive' : 'text-text-muted';
  const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Activity;

  return (
    <div className="bg-surface border border-border rounded-[var(--radius-md)] p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-text-muted uppercase tracking-wider">{label}</span>
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
      </div>
      <div className="text-2xl font-bold text-text-primary mb-1">{value}</div>
      <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
        <TrendIcon className="w-3.5 h-3.5" />
        {change}
      </div>
    </div>
  );
}

function InsightCard({ insight }: { insight: typeof insights[0] }) {
  const Icon = insight.icon;
  const colors = {
    success: 'border-success/30 bg-success/5',
    warning: 'border-warning/30 bg-warning/5',
    info: 'border-primary/30 bg-primary/5',
  };
  const iconColors = {
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    info: 'text-primary bg-primary/10',
  };

  return (
    <div className={`border rounded-[var(--radius-md)] p-5 ${colors[insight.type]}`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${iconColors[insight.type]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-text-primary mb-1">{insight.title}</h3>
          <p className="text-sm text-text-secondary mb-3">{insight.description}</p>
          <button className="text-xs font-medium text-primary hover:text-primary-glow transition-colors flex items-center gap-1">
            {insight.action} <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-[1280px] mx-auto p-8 space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-text-primary">Analytics & Insights</h1>
            <p className="text-sm text-text-muted mt-1">Data-driven insights to grow and improve your community</p>
          </div>
          <div className="flex items-center gap-2 bg-surface border border-border rounded-lg p-1">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="Member Growth" value="+427" change="+17.6% vs last period" trend="up" icon={UserPlus} />
          <MetricCard label="Engagement Rate" value="76%" change="+8% vs last period" trend="up" icon={Activity} />
          <MetricCard label="Avg Daily Messages" value="8,432" change="+12.3% vs last period" trend="up" icon={MessageSquare} />
          <MetricCard label="Churn Rate" value="12%" change="-5% vs last period" trend="down" icon={UserMinus} />
        </div>

        {/* Growth Trends */}
        <div className="bg-surface border border-border rounded-[var(--radius-md)] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Growth Trends</h2>
              <p className="text-xs text-text-muted mt-0.5">Member count and message volume over time</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-primary rounded-full" />
                <span className="text-xs text-text-muted">Members</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-accent rounded-full" />
                <span className="text-xs text-text-muted">Messages</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="memberGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(99,102,241)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="rgb(99,102,241)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="messageGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(6,182,212)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="rgb(6,182,212)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(42,42,56)" />
              <XAxis dataKey="date" stroke="rgb(148,163,184)" fontSize={12} />
              <YAxis stroke="rgb(148,163,184)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgb(17,17,24)',
                  border: '1px solid rgb(42,42,56)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'rgb(241,245,249)' }}
              />
              <Area type="monotone" dataKey="members" stroke="rgb(99,102,241)" fill="url(#memberGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="messages" stroke="rgb(6,182,212)" fill="url(#messageGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Patterns & Member Segments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Peak Activity Times */}
          <div className="bg-surface border border-border rounded-[var(--radius-md)] p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-text-primary">Peak Activity Times</h2>
              <p className="text-xs text-text-muted mt-0.5">Message volume throughout the day</p>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={hourlyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(42,42,56)" />
                <XAxis dataKey="hour" stroke="rgb(148,163,184)" fontSize={11} />
                <YAxis stroke="rgb(148,163,184)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(17,17,24)',
                    border: '1px solid rgb(42,42,56)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="messages" fill="rgb(99,102,241)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Member Segmentation */}
          <div className="bg-surface border border-border rounded-[var(--radius-md)] p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-text-primary">Member Segmentation</h2>
              <p className="text-xs text-text-muted mt-0.5">Activity distribution across your community</p>
            </div>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={memberSegments}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {memberSegments.map((entry, index) => (
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
            <div className="grid grid-cols-2 gap-3 mt-4">
              {memberSegments.map((seg) => (
                <div key={seg.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: seg.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-text-primary">{seg.name}</div>
                    <div className="text-[10px] text-text-muted">{seg.value} · {seg.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Retention Analysis */}
        <div className="bg-surface border border-border rounded-[var(--radius-md)] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Member Retention</h2>
              <p className="text-xs text-text-muted mt-0.5">New member retention and churn rate</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={retentionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(42,42,56)" />
              <XAxis dataKey="week" stroke="rgb(148,163,184)" fontSize={12} />
              <YAxis stroke="rgb(148,163,184)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgb(17,17,24)',
                  border: '1px solid rgb(42,42,56)',
                  borderRadius: '8px',
                }}
              />
              <Line type="monotone" dataKey="newMembers" stroke="rgb(6,182,212)" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="retained" stroke="rgb(99,102,241)" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Moderation Effectiveness */}
        <div className="bg-surface border border-border rounded-[var(--radius-md)] p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-text-primary">Moderation Effectiveness</h2>
            <p className="text-xs text-text-muted mt-0.5">Key metrics showing how well your moderation system is performing</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {moderationMetrics.map((metric) => {
              const isGood = metric.good;
              const TrendIcon = metric.trend === 'up' ? TrendingUp : metric.trend === 'down' ? TrendingDown : Activity;
              return (
                <div key={metric.metric} className="bg-surface-2 border border-border rounded-lg p-4">
                  <div className="text-xs text-text-muted mb-2">{metric.metric}</div>
                  <div className="text-xl font-bold text-text-primary mb-1">{metric.value}</div>
                  <div className={`flex items-center gap-1 text-xs ${isGood ? 'text-success' : 'text-warning'}`}>
                    <TrendIcon className="w-3 h-3" />
                    {metric.change}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actionable Insights */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-text-primary">Actionable Insights</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, idx) => (
              <InsightCard key={idx} insight={insight} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

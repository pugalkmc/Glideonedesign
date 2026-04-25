import { Users, MessageSquare, Shield, Zap, Bell, Sun, Moon } from 'lucide-react';
import { AreaChart, Area, DonutChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

const stats = [
  { label: 'Total Members', value: '2,847', change: '+12 today', trend: 'up', icon: Users },
  { label: 'Messages Today', value: '8,432', change: '+5.2%', trend: 'up', icon: MessageSquare },
  { label: 'Actions Taken', value: '47', change: '+8 today', trend: 'neutral', icon: Shield },
  { label: 'Active Modules', value: '18 / 32', progress: 56, icon: Zap },
];

const messageData = [
  { day: 'Mon', messages: 6400 },
  { day: 'Tue', messages: 7200 },
  { day: 'Wed', messages: 6800 },
  { day: 'Thu', messages: 8100 },
  { day: 'Fri', messages: 8900 },
  { day: 'Sat', messages: 9200 },
  { day: 'Sun', messages: 8432 },
];

const moderationData = [
  { name: 'Bans', value: 12, color: '#EF4444' },
  { name: 'Mutes', value: 23, color: '#F59E0B' },
  { name: 'Kicks', value: 8, color: '#94A3B8' },
  { name: 'Warns', value: 34, color: '#FBBF24' },
];

const recentActivity = [
  { user: 'User123', action: 'banned', reason: 'Spam', time: '2m ago', type: 'ban' },
  { user: 'TechGuru', action: 'muted for 1h', reason: 'Flooding', time: '15m ago', type: 'mute' },
  { user: 'NewUser99', action: 'warned', reason: 'Off-topic', time: '23m ago', type: 'warn' },
  { user: 'Spammer42', action: 'kicked', reason: 'Advertising', time: '1h ago', type: 'kick' },
  { user: 'BadActor', action: 'banned', reason: 'Harassment', time: '2h ago', type: 'ban' },
];

const modules = [
  { name: 'AttackMode', active: true }, { name: 'AntiBot', active: true },
  { name: 'Captcha', active: true }, { name: 'AutoFilter', active: true },
  { name: 'Welcome', active: true }, { name: 'XP System', active: true },
  { name: 'Reputation', active: true }, { name: 'RateLimit', active: true },
  { name: 'Lockdown', active: false }, { name: 'NSFW Detection', active: false },
  { name: 'FormVerification', active: true }, { name: 'Triggers', active: true },
];

export default function Dashboard({ theme, onThemeToggle }: { theme: 'light' | 'dark'; onThemeToggle: () => void }) {
  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-[1280px] mx-auto p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[32px] font-bold text-text-primary">Dashboard</h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-md">
                <Send className="w-3.5 h-3.5 text-accent" />
                <span className="text-sm text-text-secondary">Tech Community</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-success/10 border border-success/20 rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                <span className="text-xs font-medium text-success">Bot Active</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onThemeToggle}
              className="p-2.5 rounded-lg hover:bg-surface border border-border transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button className="p-2.5 rounded-lg hover:bg-surface border border-border relative transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-surface border border-border rounded-[var(--radius-md)] p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary uppercase tracking-wider">{stat.label}</span>
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
                  {stat.change && (
                    <div className={`text-sm mt-1 ${stat.trend === 'up' ? 'text-success' : 'text-text-secondary'}`}>
                      {stat.change}
                    </div>
                  )}
                  {stat.progress !== undefined && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${stat.progress}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-3">
          {['Ban Member', 'Mute Member', 'Purge Messages', 'Broadcast'].map((action) => (
            <button key={action} className="px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-surface transition-colors">
              {action}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-surface border border-border rounded-[var(--radius-md)] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-primary">Recent Activity</h2>
              <button className="text-sm text-primary hover:text-primary-glow">View All</button>
            </div>
            <div className="space-y-3">
              {recentActivity.map((activity, i) => {
                const borderColors = {
                  ban: 'border-destructive',
                  mute: 'border-warning',
                  kick: 'border-text-muted',
                  warn: 'border-warning/60'
                };
                return (
                  <div key={i} className={`flex items-center gap-4 p-3 border-l-2 ${borderColors[activity.type as keyof typeof borderColors]} bg-muted/30 rounded-r`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xs font-medium">
                      {activity.user[0]}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm">
                        <span className="font-medium text-text-primary">@{activity.user}</span>
                        <span className="text-text-secondary"> was {activity.action}</span>
                      </div>
                      <div className="text-xs text-text-muted mt-0.5">{activity.reason}</div>
                    </div>
                    <div className="text-xs text-text-muted">{activity.time}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-surface border border-border rounded-[var(--radius-md)] p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Active Modules</h2>
            <div className="grid grid-cols-1 gap-2">
              {modules.map((module) => (
                <div key={module.name} className="flex items-center gap-2 text-sm">
                  <span className={`w-2 h-2 rounded-full ${module.active ? 'bg-success' : 'bg-text-muted'}`}></span>
                  <span className={module.active ? 'text-text-primary' : 'text-text-muted'}>{module.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface border border-border rounded-[var(--radius-md)] p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Message Activity</h2>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={messageData}>
                <defs>
                  <linearGradient id="messageGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(99, 102, 241)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="rgb(99, 102, 241)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="rgb(148, 163, 184)" fontSize={12} />
                <YAxis stroke="rgb(148, 163, 184)" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgb(17, 17, 24)', border: '1px solid rgb(42, 42, 56)', borderRadius: '8px' }}
                  labelStyle={{ color: 'rgb(241, 245, 249)' }}
                />
                <Area type="monotone" dataKey="messages" stroke="rgb(99, 102, 241)" fill="url(#messageGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-surface border border-border rounded-[var(--radius-md)] p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Moderation Breakdown</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={moderationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {moderationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgb(17, 17, 24)', border: '1px solid rgb(42, 42, 56)', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {moderationData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }}></span>
                  <span className="text-sm text-text-secondary">{item.name}</span>
                  <span className="text-sm font-medium text-text-primary ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Send(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

import { useState } from 'react';
import {
  Search, Filter, Download, UserPlus, MoreVertical, Shield, Ban,
  Volume2, AlertTriangle, Eye, Crown, Star, TrendingUp, Clock,
  MessageSquare, ChevronDown, X, Check, Users, UserX, Calendar,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type MemberRole = 'owner' | 'admin' | 'moderator' | 'member';
type MemberStatus = 'active' | 'muted' | 'warned' | 'banned';
type ActivityLevel = 'highly_active' | 'active' | 'occasional' | 'lurker' | 'new';

type Member = {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  role: MemberRole;
  status: MemberStatus;
  activityLevel: ActivityLevel;
  joinedAt: string;
  lastSeen: string;
  messageCount: number;
  messagesLast7d: number;
  warningCount: number;
  xp: number;
  level: number;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockMembers: Member[] = [
  {
    id: '1',
    username: '@techguru',
    displayName: 'Tech Guru',
    avatar: 'TG',
    role: 'admin',
    status: 'active',
    activityLevel: 'highly_active',
    joinedAt: '2024-01-15',
    lastSeen: '5 min ago',
    messageCount: 3421,
    messagesLast7d: 142,
    warningCount: 0,
    xp: 18420,
    level: 28,
  },
  {
    id: '2',
    username: '@cryptowhale',
    displayName: 'Crypto Whale',
    avatar: 'CW',
    role: 'member',
    status: 'active',
    activityLevel: 'active',
    joinedAt: '2024-02-20',
    lastSeen: '23 min ago',
    messageCount: 1847,
    messagesLast7d: 67,
    warningCount: 0,
    xp: 9234,
    level: 18,
  },
  {
    id: '3',
    username: '@newbie99',
    displayName: 'Newbie99',
    avatar: 'N9',
    role: 'member',
    status: 'active',
    activityLevel: 'new',
    joinedAt: '2024-04-20',
    lastSeen: '2 hours ago',
    messageCount: 34,
    messagesLast7d: 28,
    warningCount: 0,
    xp: 340,
    level: 3,
  },
  {
    id: '4',
    username: '@spammer123',
    displayName: 'Spammer123',
    avatar: 'S1',
    role: 'member',
    status: 'warned',
    activityLevel: 'active',
    joinedAt: '2024-03-10',
    lastSeen: '1 day ago',
    messageCount: 892,
    messagesLast7d: 12,
    warningCount: 2,
    xp: 4460,
    level: 12,
  },
  {
    id: '5',
    username: '@silentbob',
    displayName: 'Silent Bob',
    avatar: 'SB',
    role: 'member',
    status: 'active',
    activityLevel: 'lurker',
    joinedAt: '2024-01-28',
    lastSeen: '3 days ago',
    messageCount: 12,
    messagesLast7d: 0,
    warningCount: 0,
    xp: 120,
    level: 1,
  },
  {
    id: '6',
    username: '@moderator_jane',
    displayName: 'Moderator Jane',
    avatar: 'MJ',
    role: 'moderator',
    status: 'active',
    activityLevel: 'highly_active',
    joinedAt: '2024-01-18',
    lastSeen: '12 min ago',
    messageCount: 2156,
    messagesLast7d: 98,
    warningCount: 0,
    xp: 12890,
    level: 22,
  },
  {
    id: '7',
    username: '@toxicuser',
    displayName: 'ToxicUser',
    avatar: 'TU',
    role: 'member',
    status: 'muted',
    activityLevel: 'occasional',
    joinedAt: '2024-03-05',
    lastSeen: '4 hours ago',
    messageCount: 456,
    messagesLast7d: 3,
    warningCount: 3,
    xp: 2280,
    level: 8,
  },
  {
    id: '8',
    username: '@banned_user',
    displayName: 'Banned User',
    avatar: 'BU',
    role: 'member',
    status: 'banned',
    activityLevel: 'active',
    joinedAt: '2024-02-14',
    lastSeen: '1 week ago',
    messageCount: 234,
    messagesLast7d: 0,
    warningCount: 5,
    xp: 1170,
    level: 5,
  },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const roleConfig = {
  owner: { label: 'Owner', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30', icon: Crown },
  admin: { label: 'Admin', color: 'text-red-400 bg-red-400/10 border-red-400/30', icon: Shield },
  moderator: { label: 'Mod', color: 'text-primary bg-primary/10 border-primary/30', icon: Shield },
  member: { label: 'Member', color: 'text-text-muted bg-muted border-border', icon: Users },
};

const statusConfig = {
  active: { label: 'Active', color: 'text-success bg-success/10 border-success/30' },
  warned: { label: 'Warned', color: 'text-warning bg-warning/10 border-warning/30' },
  muted: { label: 'Muted', color: 'text-warning bg-warning/10 border-warning/30' },
  banned: { label: 'Banned', color: 'text-destructive bg-destructive/10 border-destructive/30' },
};

const activityConfig = {
  highly_active: { label: 'Highly Active', color: 'text-success', icon: TrendingUp },
  active: { label: 'Active', color: 'text-primary', icon: MessageSquare },
  occasional: { label: 'Occasional', color: 'text-warning', icon: Clock },
  lurker: { label: 'Lurker', color: 'text-text-muted', icon: Eye },
  new: { label: 'New', color: 'text-accent', icon: Star },
};

// ─── Components ───────────────────────────────────────────────────────────────

function MemberRow({
  member,
  selected,
  onSelect,
  onAction,
}: {
  member: Member;
  selected: boolean;
  onSelect: (id: string) => void;
  onAction: (action: string, member: Member) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const roleConf = roleConfig[member.role];
  const statusConf = statusConfig[member.status];
  const activityConf = activityConfig[member.activityLevel];
  const RoleIcon = roleConf.icon;
  const ActivityIcon = activityConf.icon;

  return (
    <div className={`flex items-center gap-4 p-4 border-b border-border hover:bg-surface-2 transition-colors ${selected ? 'bg-primary/5' : ''}`}>
      {/* Checkbox */}
      <button
        onClick={() => onSelect(member.id)}
        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
          selected ? 'bg-primary border-primary' : 'border-border hover:border-primary'
        }`}
      >
        {selected && <Check className="w-3 h-3 text-white" />}
      </button>

      {/* Avatar & Name */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/60 to-accent/60 flex items-center justify-center text-sm font-bold text-white shrink-0">
          {member.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-text-primary truncate">{member.displayName}</span>
            {member.role !== 'member' && <RoleIcon className={`w-3.5 h-3.5 ${roleConf.color.split(' ')[0]}`} />}
          </div>
          <div className="text-xs text-text-muted truncate">{member.username}</div>
        </div>
      </div>

      {/* Role */}
      <div className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium ${roleConf.color}`}>
        <RoleIcon className="w-3 h-3" />
        {roleConf.label}
      </div>

      {/* Status */}
      <div className={`hidden lg:flex px-2.5 py-1 rounded-md border text-xs font-medium ${statusConf.color}`}>
        {statusConf.label}
      </div>

      {/* Activity Level */}
      <div className={`hidden xl:flex items-center gap-1.5 text-xs ${activityConf.color}`}>
        <ActivityIcon className="w-3.5 h-3.5" />
        <span className="w-20">{activityConf.label}</span>
      </div>

      {/* Messages (7d) */}
      <div className="hidden lg:block text-sm text-text-secondary w-16 text-right">
        {member.messagesLast7d}
      </div>

      {/* Level & XP */}
      <div className="hidden xl:block text-sm text-text-secondary w-20 text-right">
        Lv.{member.level}
      </div>

      {/* Joined */}
      <div className="hidden xl:block text-xs text-text-muted w-28 text-right">
        {formatDate(member.joinedAt)}
      </div>

      {/* Actions */}
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
                onClick={() => { onAction('view', member); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-sidebar-accent transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                View Profile
              </button>
              <button
                onClick={() => { onAction('warn', member); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-warning hover:bg-warning/10 transition-colors"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Warn User
              </button>
              <button
                onClick={() => { onAction('mute', member); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-warning hover:bg-warning/10 transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5" />
                Mute User
              </button>
              <button
                onClick={() => { onAction('kick', member); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                <UserX className="w-3.5 h-3.5" />
                Kick User
              </button>
              <div className="h-px bg-border my-1" />
              <button
                onClick={() => { onAction('ban', member); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Ban className="w-3.5 h-3.5" />
                Ban User
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string | number; icon: React.ElementType }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-text-muted uppercase tracking-wider">{label}</span>
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="text-2xl font-bold text-text-primary">{value}</div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MembersPage() {
  const [members] = useState<Member[]>(mockMembers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [filterRole, setFilterRole] = useState<MemberRole | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<MemberStatus | 'all'>('all');
  const [filterActivity, setFilterActivity] = useState<ActivityLevel | 'all'>('all');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  // Filtering logic
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    const matchesActivity = filterActivity === 'all' || member.activityLevel === filterActivity;

    return matchesSearch && matchesRole && matchesStatus && matchesActivity;
  });

  const activeFiltersCount = [filterRole, filterStatus, filterActivity].filter(f => f !== 'all').length;

  // Selection handlers
  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedMembers);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedMembers(newSet);
  };

  const selectAll = () => {
    if (selectedMembers.size === filteredMembers.length) {
      setSelectedMembers(new Set());
    } else {
      setSelectedMembers(new Set(filteredMembers.map(m => m.id)));
    }
  };

  const handleAction = (action: string, member: Member) => {
    console.log(`Action: ${action} on`, member);
    alert(`Action: ${action} on ${member.displayName}`);
  };

  const handleBulkAction = (action: string) => {
    if (selectedMembers.size === 0) {
      alert('Please select at least one member');
      return;
    }
    console.log(`Bulk action: ${action} on`, Array.from(selectedMembers));
    alert(`Bulk ${action} on ${selectedMembers.size} member(s)`);
  };

  const clearFilters = () => {
    setFilterRole('all');
    setFilterStatus('all');
    setFilterActivity('all');
  };

  // Stats
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'active').length;
  const newMembersLast7d = members.filter(m => {
    const joined = new Date(m.joinedAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return joined > weekAgo;
  }).length;
  const atRiskMembers = members.filter(m => m.activityLevel === 'lurker').length;

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-[1440px] mx-auto p-8 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-[28px] font-bold text-text-primary">Members</h1>
          <p className="text-sm text-text-muted mt-1">Manage and monitor your community members</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Members" value={totalMembers} icon={Users} />
          <StatCard label="Active" value={activeMembers} icon={Check} />
          <StatCard label="New (7d)" value={newMembersLast7d} icon={UserPlus} />
          <StatCard label="At Risk" value={atRiskMembers} icon={AlertTriangle} />
        </div>

        {/* Toolbar */}
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search members by name or username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Filter Button */}
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
                    {/* Role Filter */}
                    <div>
                      <label className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-2 block">Role</label>
                      <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value as any)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary"
                      >
                        <option value="all">All Roles</option>
                        <option value="owner">Owner</option>
                        <option value="admin">Admin</option>
                        <option value="moderator">Moderator</option>
                        <option value="member">Member</option>
                      </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                      <label className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-2 block">Status</label>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary"
                      >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="warned">Warned</option>
                        <option value="muted">Muted</option>
                        <option value="banned">Banned</option>
                      </select>
                    </div>

                    {/* Activity Filter */}
                    <div>
                      <label className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-2 block">Activity</label>
                      <select
                        value={filterActivity}
                        onChange={(e) => setFilterActivity(e.target.value as any)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary"
                      >
                        <option value="all">All Activity Levels</option>
                        <option value="highly_active">Highly Active</option>
                        <option value="active">Active</option>
                        <option value="occasional">Occasional</option>
                        <option value="lurker">Lurker</option>
                        <option value="new">New</option>
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

          {/* Bulk Actions */}
          {selectedMembers.size > 0 && (
            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
              <span className="text-sm text-text-secondary">
                {selectedMembers.size} member{selectedMembers.size !== 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBulkAction('warn')}
                  className="px-3 py-1.5 bg-warning/10 text-warning rounded-lg text-sm font-medium hover:bg-warning/20 transition-colors"
                >
                  Warn
                </button>
                <button
                  onClick={() => handleBulkAction('mute')}
                  className="px-3 py-1.5 bg-warning/10 text-warning rounded-lg text-sm font-medium hover:bg-warning/20 transition-colors"
                >
                  Mute
                </button>
                <button
                  onClick={() => handleBulkAction('kick')}
                  className="px-3 py-1.5 bg-destructive/10 text-destructive rounded-lg text-sm font-medium hover:bg-destructive/20 transition-colors"
                >
                  Kick
                </button>
                <button
                  onClick={() => setSelectedMembers(new Set())}
                  className="px-3 py-1.5 bg-muted text-text-muted rounded-lg text-sm font-medium hover:bg-surface-2 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Members Table */}
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="flex items-center gap-4 p-4 bg-surface-2 border-b border-border text-xs font-semibold text-text-muted uppercase tracking-wider">
            <button
              onClick={selectAll}
              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                selectedMembers.size === filteredMembers.length && filteredMembers.length > 0
                  ? 'bg-primary border-primary'
                  : 'border-border hover:border-primary'
              }`}
            >
              {selectedMembers.size === filteredMembers.length && filteredMembers.length > 0 && (
                <Check className="w-3 h-3 text-white" />
              )}
            </button>
            <div className="flex-1 min-w-0">Member</div>
            <div className="hidden md:block w-24">Role</div>
            <div className="hidden lg:block w-20">Status</div>
            <div className="hidden xl:block w-28">Activity</div>
            <div className="hidden lg:block w-16 text-right">Msgs 7d</div>
            <div className="hidden xl:block w-20 text-right">Level</div>
            <div className="hidden xl:block w-28 text-right">Joined</div>
            <div className="w-10"></div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <MemberRow
                  key={member.id}
                  member={member}
                  selected={selectedMembers.has(member.id)}
                  onSelect={toggleSelect}
                  onAction={handleAction}
                />
              ))
            ) : (
              <div className="p-12 text-center">
                <Users className="w-12 h-12 text-text-muted mx-auto mb-3" />
                <p className="text-text-secondary">No members found</p>
                <p className="text-sm text-text-muted mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-text-muted text-center">
          Showing {filteredMembers.length} of {totalMembers} members
        </div>

      </div>
    </div>
  );
}

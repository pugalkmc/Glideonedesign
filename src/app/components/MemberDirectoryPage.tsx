import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, Download, Users, Globe, MessageSquare, Shield,
  Clock, Crown, Star, AlertTriangle, TrendingUp, Eye, MoreVertical,
  ChevronDown, X, Check, Calendar, Activity, UserPlus, Award,
  Ban, Volume2, UserX, CheckCircle2, XCircle,
} from 'lucide-react';
import { useGlide } from '../context/GlideContext';
import { mockNetworks, getNetworkById, getInitials, type Group } from '../data/networks';

// ─── Types ────────────────────────────────────────────────────────────────────

type NetworkMember = {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  groupMemberships: {
    groupId: string;
    groupName: string;
    role: 'owner' | 'admin' | 'moderator' | 'member';
    joinedAt: string;
    messageCount: number;
    lastActive: string;
  }[];
  totalMessages: number;
  totalWarnings: number;
  firstSeen: string;
  lastSeen: string;
  activityLevel: 'highly_active' | 'active' | 'occasional' | 'lurker';
  status: 'active' | 'warned' | 'restricted' | 'banned';
  level: number;
  xp: number;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const generateMockMembers = (groups: Group[]): NetworkMember[] => {
  return [
    {
      id: 'nm-1',
      username: '@techguru',
      displayName: 'Tech Guru',
      avatar: 'TG',
      groupMemberships: [
        {
          groupId: groups[0]?.id || 'grp-1',
          groupName: groups[0]?.name || 'CryptoTalk Main',
          role: 'admin',
          joinedAt: '2024-01-15T00:00:00Z',
          messageCount: 3421,
          lastActive: '5 min ago',
        },
        {
          groupId: groups[1]?.id || 'grp-2',
          groupName: groups[1]?.name || 'CryptoTalk Alt',
          role: 'moderator',
          joinedAt: '2024-02-01T00:00:00Z',
          messageCount: 1847,
          lastActive: '23 min ago',
        },
      ],
      totalMessages: 5268,
      totalWarnings: 0,
      firstSeen: '2024-01-15T00:00:00Z',
      lastSeen: '5 min ago',
      activityLevel: 'highly_active',
      status: 'active',
      level: 28,
      xp: 26340,
    },
    {
      id: 'nm-2',
      username: '@cryptowhale',
      displayName: 'Crypto Whale',
      avatar: 'CW',
      groupMemberships: [
        {
          groupId: groups[0]?.id || 'grp-1',
          groupName: groups[0]?.name || 'CryptoTalk Main',
          role: 'member',
          joinedAt: '2024-02-20T00:00:00Z',
          messageCount: 1847,
          lastActive: '1 hour ago',
        },
        {
          groupId: groups[2]?.id || 'grp-3',
          groupName: groups[2]?.name || 'NFT Collectors',
          role: 'member',
          joinedAt: '2024-03-01T00:00:00Z',
          messageCount: 892,
          lastActive: '2 hours ago',
        },
      ],
      totalMessages: 2739,
      totalWarnings: 1,
      firstSeen: '2024-02-20T00:00:00Z',
      lastSeen: '1 hour ago',
      activityLevel: 'active',
      status: 'active',
      level: 18,
      xp: 13695,
    },
    {
      id: 'nm-3',
      username: '@networkmod',
      displayName: 'Network Moderator',
      avatar: 'NM',
      groupMemberships: groups.slice(0, 4).map((g, i) => ({
        groupId: g.id,
        groupName: g.name,
        role: 'moderator' as const,
        joinedAt: '2024-01-15T00:00:00Z',
        messageCount: 800 + i * 200,
        lastActive: `${i * 10} min ago`,
      })),
      totalMessages: 4200,
      totalWarnings: 0,
      firstSeen: '2024-01-15T00:00:00Z',
      lastSeen: '3 min ago',
      activityLevel: 'highly_active',
      status: 'active',
      level: 32,
      xp: 42000,
    },
    {
      id: 'nm-4',
      username: '@troublemaker',
      displayName: 'Trouble Maker',
      avatar: 'TM',
      groupMemberships: [
        {
          groupId: groups[0]?.id || 'grp-1',
          groupName: groups[0]?.name || 'CryptoTalk Main',
          role: 'member',
          joinedAt: '2024-03-10T00:00:00Z',
          messageCount: 456,
          lastActive: '1 day ago',
        },
      ],
      totalMessages: 456,
      totalWarnings: 3,
      firstSeen: '2024-03-10T00:00:00Z',
      lastSeen: '1 day ago',
      activityLevel: 'active',
      status: 'warned',
      level: 8,
      xp: 2280,
    },
    {
      id: 'nm-5',
      username: '@multigroup_user',
      displayName: 'Multi Group User',
      avatar: 'MG',
      groupMemberships: groups.map((g, i) => ({
        groupId: g.id,
        groupName: g.name,
        role: 'member' as const,
        joinedAt: '2024-02-01T00:00:00Z',
        messageCount: 150 + i * 50,
        lastActive: `${i * 5} hours ago`,
      })),
      totalMessages: groups.length * 200,
      totalWarnings: 0,
      firstSeen: '2024-02-01T00:00:00Z',
      lastSeen: '30 min ago',
      activityLevel: 'active',
      status: 'active',
      level: 22,
      xp: groups.length * 1000,
    },
    {
      id: 'nm-6',
      username: '@silentlurker',
      displayName: 'Silent Lurker',
      avatar: 'SL',
      groupMemberships: [
        {
          groupId: groups[0]?.id || 'grp-1',
          groupName: groups[0]?.name || 'CryptoTalk Main',
          role: 'member',
          joinedAt: '2024-01-28T00:00:00Z',
          messageCount: 12,
          lastActive: '3 days ago',
        },
        {
          groupId: groups[1]?.id || 'grp-2',
          groupName: groups[1]?.name || 'CryptoTalk Alt',
          role: 'member',
          joinedAt: '2024-02-15T00:00:00Z',
          messageCount: 5,
          lastActive: '5 days ago',
        },
      ],
      totalMessages: 17,
      totalWarnings: 0,
      firstSeen: '2024-01-28T00:00:00Z',
      lastSeen: '3 days ago',
      activityLevel: 'lurker',
      status: 'active',
      level: 1,
      xp: 85,
    },
  ];
};

// ─── Helper Functions ─────────────────────────────────────────────────────────

const activityConfig = {
  highly_active: { label: 'Highly Active', color: 'text-success bg-success/10 border-success/30', icon: TrendingUp },
  active: { label: 'Active', color: 'text-primary bg-primary/10 border-primary/30', icon: Activity },
  occasional: { label: 'Occasional', color: 'text-warning bg-warning/10 border-warning/30', icon: Clock },
  lurker: { label: 'Lurker', color: 'text-text-muted bg-muted border-border', icon: Eye },
};

const statusConfig = {
  active: { label: 'Active', color: 'text-success bg-success/10 border-success/30', icon: CheckCircle2 },
  warned: { label: 'Warned', color: 'text-warning bg-warning/10 border-warning/30', icon: AlertTriangle },
  restricted: { label: 'Restricted', color: 'text-orange-400 bg-orange-400/10 border-orange-400/30', icon: Volume2 },
  banned: { label: 'Banned', color: 'text-destructive bg-destructive/10 border-destructive/30', icon: XCircle },
};

const roleConfig = {
  owner: { label: 'Owner', color: 'text-yellow-400', icon: Crown },
  admin: { label: 'Admin', color: 'text-red-400', icon: Shield },
  moderator: { label: 'Mod', color: 'text-primary', icon: Shield },
  member: { label: 'Member', color: 'text-text-muted', icon: Users },
};

// ─── Components ───────────────────────────────────────────────────────────────

function MemberCard({
  member,
  groups,
  onAction,
  onViewProfile,
}: {
  member: NetworkMember;
  groups: Group[];
  onAction: (action: string, member: NetworkMember) => void;
  onViewProfile: (member: NetworkMember) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const activity = activityConfig[member.activityLevel];
  const status = statusConfig[member.status];
  const ActivityIcon = activity.icon;
  const StatusIcon = status.icon;

  const highestRole = member.groupMemberships.reduce((highest, m) => {
    const roles = ['owner', 'admin', 'moderator', 'member'];
    const currentIndex = roles.indexOf(m.role);
    const highestIndex = roles.indexOf(highest);
    return currentIndex < highestIndex ? m.role : highest;
  }, 'member' as const);

  const roleInfo = roleConfig[highestRole];
  const RoleIcon = roleInfo.icon;

  return (
    <div className="bg-surface border border-border rounded-lg p-4 hover:border-primary/30 transition-all">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/60 to-accent/60 flex items-center justify-center text-base font-bold text-white shrink-0">
          {member.avatar}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-text-primary truncate">
                  {member.displayName}
                </h3>
                {highestRole !== 'member' && (
                  <RoleIcon className={`w-3.5 h-3.5 ${roleInfo.color}`} />
                )}
              </div>
              <p className="text-xs text-text-muted font-mono truncate">{member.username}</p>
            </div>

            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1 rounded hover:bg-surface-2 text-text-muted hover:text-text-primary transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-surface-2 border border-border rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.4)] z-20 overflow-hidden">
                    <button
                      onClick={() => { onViewProfile(member); setMenuOpen(false); }}
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
                      Issue Warning
                    </button>
                    <button
                      onClick={() => { onAction('restrict', member); setMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-warning hover:bg-warning/10 transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      Restrict Access
                    </button>
                    <div className="h-px bg-border my-1" />
                    <button
                      onClick={() => { onAction('ban-network', member); setMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      Ban from Network
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2 py-0.5 rounded-md border text-xs font-medium flex items-center gap-1 ${activity.color}`}>
              <ActivityIcon className="w-3 h-3" />
              {activity.label}
            </span>
            <span className={`px-2 py-0.5 rounded-md border text-xs font-medium flex items-center gap-1 ${status.color}`}>
              <StatusIcon className="w-3 h-3" />
              {status.label}
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            <div className="text-center">
              <div className="text-xs text-text-muted">Groups</div>
              <div className="text-sm font-bold text-text-primary">{member.groupMemberships.length}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-text-muted">Messages</div>
              <div className="text-sm font-bold text-text-primary">{member.totalMessages}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-text-muted">Level</div>
              <div className="text-sm font-bold text-text-primary">{member.level}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-text-muted">Warnings</div>
              <div className={`text-sm font-bold ${member.totalWarnings > 0 ? 'text-warning' : 'text-success'}`}>
                {member.totalWarnings}
              </div>
            </div>
          </div>

          {/* Group Memberships */}
          <div className="space-y-1">
            <div className="text-xs text-text-muted font-semibold mb-1.5">Member of:</div>
            <div className="flex flex-wrap gap-1.5">
              {member.groupMemberships.slice(0, 3).map((membership) => {
                const role = roleConfig[membership.role];
                return (
                  <div
                    key={membership.groupId}
                    className="flex items-center gap-1 px-2 py-1 bg-background/50 border border-border rounded text-xs"
                  >
                    <div className="w-4 h-4 rounded bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center text-[8px] font-bold text-white">
                      {getInitials(membership.groupName)}
                    </div>
                    <span className="text-text-secondary truncate max-w-[120px]">
                      {membership.groupName}
                    </span>
                    {membership.role !== 'member' && (
                      <role.icon className={`w-3 h-3 ${role.color}`} />
                    )}
                  </div>
                );
              })}
              {member.groupMemberships.length > 3 && (
                <button
                  onClick={() => onViewProfile(member)}
                  className="px-2 py-1 bg-primary/10 border border-primary/30 rounded text-xs text-primary font-medium hover:bg-primary/20 transition-colors"
                >
                  +{member.groupMemberships.length - 3} more
                </button>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border text-xs text-text-muted">
            <span>Last seen: {member.lastSeen}</span>
            <button
              onClick={() => onViewProfile(member)}
              className="text-primary hover:text-primary-glow font-medium transition-colors"
            >
              View Full Profile →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MemberProfileModal({ member, groups, onClose }: {
  member: NetworkMember;
  groups: Group[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-2 border border-border rounded-xl max-w-3xl w-full max-h-[90vh] overflow-auto shadow-[0_25px_50px_rgba(0,0,0,0.6)]">
        {/* Header */}
        <div className="sticky top-0 bg-surface-2 border-b border-border p-6 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/60 to-accent/60 flex items-center justify-center text-2xl font-bold text-white">
              {member.avatar}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary">{member.displayName}</h2>
              <p className="text-sm text-text-muted font-mono">{member.username}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-0.5 rounded-md border text-xs font-medium ${activityConfig[member.activityLevel].color}`}>
                  {activityConfig[member.activityLevel].label}
                </span>
                <span className={`px-2 py-0.5 rounded-md border text-xs font-medium ${statusConfig[member.status].color}`}>
                  {statusConfig[member.status].label}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface transition-colors text-text-muted hover:text-text-primary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 text-xs text-text-muted mb-1">
                <Globe className="w-3 h-3" />
                Groups
              </div>
              <div className="text-2xl font-bold text-text-primary">{member.groupMemberships.length}</div>
            </div>
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 text-xs text-text-muted mb-1">
                <MessageSquare className="w-3 h-3" />
                Total Messages
              </div>
              <div className="text-2xl font-bold text-text-primary">{member.totalMessages}</div>
            </div>
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 text-xs text-text-muted mb-1">
                <Award className="w-3 h-3" />
                Level
              </div>
              <div className="text-2xl font-bold text-text-primary">{member.level}</div>
              <div className="text-xs text-text-muted">{member.xp} XP</div>
            </div>
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 text-xs text-text-muted mb-1">
                <AlertTriangle className="w-3 h-3" />
                Warnings
              </div>
              <div className={`text-2xl font-bold ${member.totalWarnings > 0 ? 'text-warning' : 'text-success'}`}>
                {member.totalWarnings}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-surface border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold text-text-primary mb-3">Member Timeline</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-text-secondary">
                <Calendar className="w-3 h-3" />
                <span>First seen: {new Date(member.firstSeen).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <Clock className="w-3 h-3" />
                <span>Last active: {member.lastSeen}</span>
              </div>
            </div>
          </div>

          {/* Group Memberships */}
          <div className="bg-surface border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold text-text-primary mb-3">Group Memberships</h3>
            <div className="space-y-3">
              {member.groupMemberships.map((membership) => {
                const role = roleConfig[membership.role];
                const RoleIcon = role.icon;
                return (
                  <div key={membership.groupId} className="bg-background/50 border border-border rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center text-xs font-bold text-white">
                          {getInitials(membership.groupName)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-text-primary">{membership.groupName}</div>
                          <div className="flex items-center gap-1.5 text-xs">
                            <RoleIcon className={`w-3 h-3 ${role.color}`} />
                            <span className={role.color}>{role.label}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <div className="text-text-muted">Messages</div>
                        <div className="font-semibold text-text-primary">{membership.messageCount}</div>
                      </div>
                      <div>
                        <div className="text-text-muted">Joined</div>
                        <div className="font-semibold text-text-primary">
                          {new Date(membership.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      <div>
                        <div className="text-text-muted">Last Active</div>
                        <div className="font-semibold text-text-primary">{membership.lastActive}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MemberDirectoryPage() {
  const navigate = useNavigate();
  const { context } = useGlide();
  const networkId = context.type === 'network' ? context.networkId : mockNetworks[0].id;
  const network = getNetworkById(networkId) ?? mockNetworks[0];

  const [members] = useState<NetworkMember[]>(generateMockMembers(network.groups));
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActivity, setFilterActivity] = useState<'all' | NetworkMember['activityLevel']>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | NetworkMember['status']>('all');
  const [filterGroup, setFilterGroup] = useState('all');
  const [filterRole, setFilterRole] = useState<'all' | 'owner' | 'admin' | 'moderator' | 'member'>('all');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<NetworkMember | null>(null);

  // Filtering
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.displayName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesActivity = filterActivity === 'all' || member.activityLevel === filterActivity;
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    const matchesGroup = filterGroup === 'all' || member.groupMemberships.some(m => m.groupId === filterGroup);
    const matchesRole = filterRole === 'all' || member.groupMemberships.some(m => m.role === filterRole);

    return matchesSearch && matchesActivity && matchesStatus && matchesGroup && matchesRole;
  });

  const activeFiltersCount = [filterActivity, filterStatus, filterGroup, filterRole].filter(f => f !== 'all').length;

  const clearFilters = () => {
    setFilterActivity('all');
    setFilterStatus('all');
    setFilterGroup('all');
    setFilterRole('all');
  };

  const handleMemberAction = (action: string, member: NetworkMember) => {
    console.log(`Action: ${action} on member`, member);
    alert(`${action} on ${member.displayName}`);
  };

  // Stats
  const totalMembers = members.length;
  const uniqueMembers = new Set(members.map(m => m.id)).size;
  const multiGroupMembers = members.filter(m => m.groupMemberships.length > 1).length;
  const activeMembers = members.filter(m => m.activityLevel === 'highly_active' || m.activityLevel === 'active').length;
  const membersWithWarnings = members.filter(m => m.totalWarnings > 0).length;

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
                <Users className="w-5 h-5" />
              </button>
              <span className="text-text-muted">/</span>
              <h1 className="text-[28px] font-bold text-text-primary">Member Directory</h1>
            </div>
            <p className="text-sm text-text-muted">
              {network.name} · Unified view of all members across the network
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-muted uppercase tracking-wider">Total Members</span>
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-text-primary">{totalMembers}</div>
          </div>
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-muted uppercase tracking-wider">Multi-Group</span>
              <Globe className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-text-primary">{multiGroupMembers}</div>
          </div>
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-muted uppercase tracking-wider">Active</span>
              <Activity className="w-4 h-4 text-success" />
            </div>
            <div className="text-2xl font-bold text-text-primary">{activeMembers}</div>
          </div>
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-muted uppercase tracking-wider">With Warnings</span>
              <AlertTriangle className="w-4 h-4 text-warning" />
            </div>
            <div className="text-2xl font-bold text-text-primary">{membersWithWarnings}</div>
          </div>
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-muted uppercase tracking-wider">Avg Messages</span>
              <MessageSquare className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-text-primary">
              {Math.round(members.reduce((sum, m) => sum + m.totalMessages, 0) / members.length)}
            </div>
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
                placeholder="Search members by name or username..."
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
                        <option value="warned">Warned</option>
                        <option value="restricted">Restricted</option>
                        <option value="banned">Banned</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-2 block">Group</label>
                      <select
                        value={filterGroup}
                        onChange={(e) => setFilterGroup(e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary"
                      >
                        <option value="all">All Groups</option>
                        {network.groups.map(g => (
                          <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-2 block">Role</label>
                      <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value as any)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary"
                      >
                        <option value="all">All Roles</option>
                        <option value="owner">Owners</option>
                        <option value="admin">Admins</option>
                        <option value="moderator">Moderators</option>
                        <option value="member">Members</option>
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

        {/* Members Grid */}
        {filteredMembers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredMembers.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  groups={network.groups}
                  onAction={handleMemberAction}
                  onViewProfile={setSelectedMember}
                />
              ))}
            </div>

            <div className="text-sm text-text-muted text-center">
              Showing {filteredMembers.length} of {totalMembers} members
            </div>
          </>
        ) : (
          <div className="bg-surface border border-border rounded-lg p-12 text-center">
            <Users className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary">No members found</p>
            <p className="text-sm text-text-muted mt-1">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Member Profile Modal */}
        {selectedMember && (
          <MemberProfileModal
            member={selectedMember}
            groups={network.groups}
            onClose={() => setSelectedMember(null)}
          />
        )}

      </div>
    </div>
  );
}

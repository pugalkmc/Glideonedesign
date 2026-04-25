import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Radio, Send, Clock, Eye, Check, X, ChevronDown, Calendar,
  Globe, Users, MessageSquare, AlertTriangle, CheckCircle2,
  Copy, Trash2, Edit, FileText, Image, Link2, Zap, History,
} from 'lucide-react';
import { useGlide } from '../context/GlideContext';
import { mockNetworks, getNetworkById, getInitials, type Group } from '../data/networks';

// ─── Types ────────────────────────────────────────────────────────────────────

type BroadcastMessage = {
  id: string;
  title: string;
  content: string;
  targetGroups: string[]; // group IDs
  scheduledFor?: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  createdAt: string;
  sentAt?: string;
  sentCount: number;
  failedCount: number;
  totalRecipients: number;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockBroadcasts: BroadcastMessage[] = [
  {
    id: 'b-1',
    title: 'Weekly Community Update',
    content: 'Hello everyone! Here are the highlights from this week...',
    targetGroups: ['grp-1', 'grp-2', 'grp-3'],
    status: 'sent',
    createdAt: '2024-04-24T10:00:00Z',
    sentAt: '2024-04-24T10:05:00Z',
    sentCount: 3,
    failedCount: 0,
    totalRecipients: 21180,
  },
  {
    id: 'b-2',
    title: 'Maintenance Notice',
    content: '⚠️ System maintenance scheduled for tonight at 2 AM UTC...',
    targetGroups: ['grp-1', 'grp-2'],
    status: 'sent',
    createdAt: '2024-04-23T14:30:00Z',
    sentAt: '2024-04-23T14:35:00Z',
    sentCount: 2,
    failedCount: 0,
    totalRecipients: 18078,
  },
  {
    id: 'b-3',
    title: 'New Feature Announcement',
    content: '🎉 Exciting news! We just launched a new feature...',
    targetGroups: ['grp-1', 'grp-2', 'grp-3', 'grp-4'],
    scheduledFor: '2024-04-26T15:00:00Z',
    status: 'scheduled',
    createdAt: '2024-04-25T09:00:00Z',
    sentCount: 0,
    failedCount: 0,
    totalRecipients: 26893,
  },
];

const messageTemplates = [
  {
    id: 't-1',
    name: 'Weekly Update',
    content: `📢 Weekly Community Update

Hello everyone! Here are the highlights from this week:

• [Highlight 1]
• [Highlight 2]
• [Highlight 3]

Thank you for being part of our community!`,
  },
  {
    id: 't-2',
    name: 'Announcement',
    content: `🎉 Important Announcement

[Your announcement here]

For questions, please contact our team.`,
  },
  {
    id: 't-3',
    name: 'Maintenance Notice',
    content: `⚠️ Scheduled Maintenance

We will be performing system maintenance on [DATE] at [TIME].

Expected downtime: [DURATION]

We apologize for any inconvenience.`,
  },
  {
    id: 't-4',
    name: 'Event Reminder',
    content: `📅 Event Reminder

Don't forget! [EVENT NAME] starts in [TIME].

When: [DATE & TIME]
Where: [LOCATION/LINK]

See you there! 🎊`,
  },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

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

const statusConfig = {
  draft: { label: 'Draft', color: 'text-text-muted bg-muted border-border', icon: Edit },
  scheduled: { label: 'Scheduled', color: 'text-primary bg-primary/10 border-primary/30', icon: Clock },
  sending: { label: 'Sending', color: 'text-warning bg-warning/10 border-warning/30', icon: Radio },
  sent: { label: 'Sent', color: 'text-success bg-success/10 border-success/30', icon: CheckCircle2 },
  failed: { label: 'Failed', color: 'text-destructive bg-destructive/10 border-destructive/30', icon: AlertTriangle },
};

// ─── Components ───────────────────────────────────────────────────────────────

function BroadcastComposer({
  groups,
  onSend,
  onCancel,
}: {
  groups: Group[];
  onSend: (data: any) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set(groups.map(g => g.id)));
  const [scheduleMode, setScheduleMode] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const toggleGroup = (groupId: string) => {
    const newSet = new Set(selectedGroups);
    if (newSet.has(groupId)) {
      newSet.delete(groupId);
    } else {
      newSet.add(groupId);
    }
    setSelectedGroups(newSet);
  };

  const selectAll = () => {
    if (selectedGroups.size === groups.length) {
      setSelectedGroups(new Set());
    } else {
      setSelectedGroups(new Set(groups.map(g => g.id)));
    }
  };

  const totalRecipients = groups
    .filter(g => selectedGroups.has(g.id))
    .reduce((sum, g) => sum + g.memberCount, 0);

  const handleApplyTemplate = (template: typeof messageTemplates[0]) => {
    setMessage(template.content);
    setShowTemplates(false);
  };

  const handleSend = () => {
    if (!title.trim() || !message.trim() || selectedGroups.size === 0) {
      alert('Please fill in all required fields and select at least one group');
      return;
    }

    const data = {
      title,
      message,
      groups: Array.from(selectedGroups),
      scheduled: scheduleMode ? `${scheduledDate}T${scheduledTime}:00Z` : null,
    };

    onSend(data);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="text-sm font-semibold text-text-primary mb-2 block">
          Broadcast Title <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g., Weekly Update, Maintenance Notice..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Message */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-text-primary">
            Message <span className="text-destructive">*</span>
          </label>
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary hover:text-primary-glow transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            Use Template
          </button>
        </div>

        {showTemplates && (
          <div className="mb-3 p-3 bg-surface-2 border border-border rounded-lg">
            <div className="grid grid-cols-2 gap-2">
              {messageTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleApplyTemplate(template)}
                  className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary hover:border-primary transition-colors text-left"
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <textarea
          placeholder="Type your message here... You can use Telegram formatting (bold, italic, links, etc.)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={8}
          className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors resize-none font-mono"
        />
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-text-muted">
            Supports Telegram markdown: **bold**, __italic__, [link](url)
          </p>
          <span className="text-xs text-text-muted">{message.length} characters</span>
        </div>
      </div>

      {/* Target Groups */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-text-primary">
            Target Groups <span className="text-destructive">*</span>
          </label>
          <button
            onClick={selectAll}
            className="text-xs font-medium text-primary hover:text-primary-glow transition-colors"
          >
            {selectedGroups.size === groups.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        <div className="bg-surface-2 border border-border rounded-lg p-4 space-y-2 max-h-64 overflow-auto">
          {groups.map((group) => (
            <label
              key={group.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface transition-colors cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedGroups.has(group.id)}
                onChange={() => toggleGroup(group.id)}
                className="w-4 h-4 rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary/20"
              />
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary/60 to-accent/60 flex items-center justify-center text-xs font-bold text-white shrink-0">
                {getInitials(group.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-text-primary truncate">{group.name}</div>
                <div className="text-xs text-text-muted">
                  {group.memberCount.toLocaleString()} members
                </div>
              </div>
              {group.botActive ? (
                <CheckCircle2 className="w-4 h-4 text-success" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-destructive" />
              )}
            </label>
          ))}
        </div>

        <div className="mt-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Total Recipients:</span>
            <span className="font-bold text-text-primary">
              {totalRecipients.toLocaleString()} members across {selectedGroups.size} group{selectedGroups.size !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div>
        <label className="flex items-center gap-2 mb-3">
          <input
            type="checkbox"
            checked={scheduleMode}
            onChange={(e) => setScheduleMode(e.target.checked)}
            className="w-4 h-4 rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary/20"
          />
          <span className="text-sm font-semibold text-text-primary">Schedule for later</span>
        </label>

        {scheduleMode && (
          <div className="grid grid-cols-2 gap-3 p-4 bg-surface-2 border border-border rounded-lg">
            <div>
              <label className="text-xs text-text-muted mb-1.5 block">Date</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs text-text-muted mb-1.5 block">Time</label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        )}
      </div>

      {/* Preview */}
      {showPreview && message && (
        <div className="p-4 bg-surface-2 border border-border rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-text-primary">Message Preview</h3>
            <button onClick={() => setShowPreview(false)} className="text-text-muted hover:text-text-primary">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 bg-background rounded-lg border border-border">
            <div className="text-sm text-text-primary whitespace-pre-wrap font-mono">{message}</div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <button
          onClick={handleSend}
          disabled={!title.trim() || !message.trim() || selectedGroups.size === 0}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-glow text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {scheduleMode ? (
            <>
              <Clock className="w-4 h-4" />
              Schedule Broadcast
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send Now
            </>
          )}
        </button>

        {!showPreview && message && (
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-background border border-border hover:border-primary text-text-secondary hover:text-text-primary rounded-lg text-sm font-medium transition-colors"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
        )}

        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2.5 bg-background border border-border hover:border-destructive text-text-secondary hover:text-destructive rounded-lg text-sm font-medium transition-colors ml-auto"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>

      {/* Warning */}
      <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-text-secondary">
              <strong className="text-warning">Important:</strong> This message will be sent to{' '}
              <strong>{totalRecipients.toLocaleString()} members</strong> across{' '}
              <strong>{selectedGroups.size} group{selectedGroups.size !== 1 ? 's' : ''}</strong>.
              Please review carefully before sending.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BroadcastHistoryItem({ broadcast, groups, onAction }: {
  broadcast: BroadcastMessage;
  groups: Group[];
  onAction: (action: string, broadcast: BroadcastMessage) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const status = statusConfig[broadcast.status];
  const StatusIcon = status.icon;
  const targetGroupNames = groups
    .filter(g => broadcast.targetGroups.includes(g.id))
    .map(g => g.name)
    .join(', ');

  const successRate = broadcast.sentCount > 0
    ? Math.round((broadcast.sentCount / (broadcast.sentCount + broadcast.failedCount)) * 100)
    : 0;

  return (
    <div className="bg-surface border border-border rounded-lg p-5 hover:border-primary/30 transition-all">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-text-primary truncate">{broadcast.title}</h3>
            <span className={`px-2.5 py-0.5 rounded-md border text-xs font-medium ${status.color}`}>
              <StatusIcon className="w-3 h-3 inline mr-1" />
              {status.label}
            </span>
          </div>
          <p className="text-sm text-text-secondary line-clamp-2">{broadcast.content}</p>
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded hover:bg-surface-2 text-text-muted hover:text-text-primary transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1 w-48 bg-surface-2 border border-border rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.4)] z-20 overflow-hidden">
                <button
                  onClick={() => { onAction('view', broadcast); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-sidebar-accent transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Details
                </button>
                {broadcast.status === 'draft' && (
                  <button
                    onClick={() => { onAction('edit', broadcast); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-sidebar-accent transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit Draft
                  </button>
                )}
                <button
                  onClick={() => { onAction('duplicate', broadcast); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-sidebar-accent transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Duplicate
                </button>
                {broadcast.status === 'scheduled' && (
                  <button
                    onClick={() => { onAction('cancel', broadcast); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    Cancel Schedule
                  </button>
                )}
                <div className="h-px bg-border my-1" />
                <button
                  onClick={() => { onAction('delete', broadcast); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
        <div className="bg-background/50 border border-border rounded-lg p-2.5">
          <div className="text-xs text-text-muted mb-0.5">Target Groups</div>
          <div className="text-sm font-semibold text-text-primary">{broadcast.targetGroups.length}</div>
        </div>
        <div className="bg-background/50 border border-border rounded-lg p-2.5">
          <div className="text-xs text-text-muted mb-0.5">Recipients</div>
          <div className="text-sm font-semibold text-text-primary">
            {broadcast.totalRecipients.toLocaleString()}
          </div>
        </div>
        {broadcast.status === 'sent' && (
          <>
            <div className="bg-background/50 border border-border rounded-lg p-2.5">
              <div className="text-xs text-text-muted mb-0.5">Delivered</div>
              <div className="text-sm font-semibold text-success">{broadcast.sentCount}</div>
            </div>
            <div className="bg-background/50 border border-border rounded-lg p-2.5">
              <div className="text-xs text-text-muted mb-0.5">Success Rate</div>
              <div className="text-sm font-semibold text-text-primary">{successRate}%</div>
            </div>
          </>
        )}
        {broadcast.status === 'scheduled' && (
          <div className="col-span-2 bg-background/50 border border-border rounded-lg p-2.5">
            <div className="text-xs text-text-muted mb-0.5">Scheduled For</div>
            <div className="text-sm font-semibold text-primary">
              {formatDateTime(broadcast.scheduledFor!)}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-text-muted pt-3 border-t border-border">
        <span className="truncate" title={targetGroupNames}>
          <Globe className="w-3 h-3 inline mr-1" />
          {targetGroupNames}
        </span>
        <span>
          <Calendar className="w-3 h-3 inline mr-1" />
          {broadcast.sentAt ? `Sent ${getTimeAgo(broadcast.sentAt)}` : `Created ${getTimeAgo(broadcast.createdAt)}`}
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BroadcastPage() {
  const navigate = useNavigate();
  const { context } = useGlide();
  const networkId = context.type === 'network' ? context.networkId : mockNetworks[0].id;
  const network = getNetworkById(networkId) ?? mockNetworks[0];

  const [broadcasts] = useState<BroadcastMessage[]>(mockBroadcasts);
  const [activeTab, setActiveTab] = useState<'compose' | 'history'>('compose');
  const [filterStatus, setFilterStatus] = useState<'all' | BroadcastMessage['status']>('all');

  const filteredBroadcasts = broadcasts.filter(b =>
    filterStatus === 'all' || b.status === filterStatus
  );

  const handleSendBroadcast = (data: any) => {
    console.log('Sending broadcast:', data);
    alert(data.scheduled
      ? `Broadcast scheduled for ${data.scheduled}`
      : 'Broadcast sent successfully!'
    );
    setActiveTab('history');
  };

  const handleBroadcastAction = (action: string, broadcast: BroadcastMessage) => {
    console.log(`Action: ${action} on broadcast`, broadcast);
    alert(`${action} broadcast: ${broadcast.title}`);
  };

  const stats = {
    total: broadcasts.length,
    scheduled: broadcasts.filter(b => b.status === 'scheduled').length,
    sent: broadcasts.filter(b => b.status === 'sent').length,
    drafts: broadcasts.filter(b => b.status === 'draft').length,
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-[1280px] mx-auto p-8 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => navigate('/network')}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                <Radio className="w-5 h-5" />
              </button>
              <span className="text-text-muted">/</span>
              <h1 className="text-[28px] font-bold text-text-primary">Broadcast</h1>
            </div>
            <p className="text-sm text-text-muted">
              {network.name} · Send messages to multiple groups at once
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-muted uppercase tracking-wider">Total Broadcasts</span>
              <History className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-text-primary">{stats.total}</div>
          </div>
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-muted uppercase tracking-wider">Scheduled</span>
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-text-primary">{stats.scheduled}</div>
          </div>
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-muted uppercase tracking-wider">Sent</span>
              <CheckCircle2 className="w-4 h-4 text-success" />
            </div>
            <div className="text-2xl font-bold text-text-primary">{stats.sent}</div>
          </div>
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-muted uppercase tracking-wider">Drafts</span>
              <Edit className="w-4 h-4 text-text-muted" />
            </div>
            <div className="text-2xl font-bold text-text-primary">{stats.drafts}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-border">
          <button
            onClick={() => setActiveTab('compose')}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === 'compose' ? 'text-primary' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Compose Message
            {activeTab === 'compose' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === 'history' ? 'text-primary' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Broadcast History
            {activeTab === 'history' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>

        {/* Content */}
        {activeTab === 'compose' ? (
          <div className="bg-surface border border-border rounded-lg p-6">
            <BroadcastComposer
              groups={network.groups}
              onSend={handleSendBroadcast}
              onCancel={() => setActiveTab('history')}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-text-secondary">Filter:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-1.5 bg-surface border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary"
              >
                <option value="all">All Broadcasts</option>
                <option value="draft">Drafts</option>
                <option value="scheduled">Scheduled</option>
                <option value="sent">Sent</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Broadcast List */}
            {filteredBroadcasts.length > 0 ? (
              <div className="space-y-3">
                {filteredBroadcasts.map((broadcast) => (
                  <BroadcastHistoryItem
                    key={broadcast.id}
                    broadcast={broadcast}
                    groups={network.groups}
                    onAction={handleBroadcastAction}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-surface border border-border rounded-lg p-12 text-center">
                <Radio className="w-12 h-12 text-text-muted mx-auto mb-3" />
                <p className="text-text-secondary">No broadcasts found</p>
                <p className="text-sm text-text-muted mt-1">Try adjusting your filter or create a new broadcast</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

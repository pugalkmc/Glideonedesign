import { useState } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import * as Switch from '@radix-ui/react-switch';
import { ChevronDown, Settings2, AlertCircle } from 'lucide-react';

const filterGroups = [
  {
    name: 'Text Filters',
    filters: [
      { id: 'stopwords', name: 'Stop Words', description: 'Remove messages containing banned words', action: 'Delete' },
      { id: 'links', name: 'Links', description: 'Block external links', action: 'Delete' },
      { id: 'tglinks', name: 'Telegram Links', description: 'Block Telegram invite links', action: 'Ban' },
      { id: 'emails', name: 'Emails', description: 'Block email addresses', action: 'Delete' },
      { id: 'regex', name: 'Regex Patterns', description: 'Custom regex pattern matching', action: 'Delete' },
      { id: 'language', name: 'Language Filter', description: 'Filter by message language', action: 'Delete' },
      { id: 'allowedwords', name: 'Allowed Words Only', description: 'Only allow whitelisted words', action: 'Delete' },
      { id: 'msglength', name: 'Message Length', description: 'Limit message character count', action: 'Delete' },
    ]
  },
  {
    name: 'Media Filters',
    filters: [
      { id: 'images', name: 'Images', description: 'Block image uploads', action: 'Delete' },
      { id: 'gifs', name: 'GIFs', description: 'Block GIF animations', action: 'Delete' },
      { id: 'videos', name: 'Videos', description: 'Block video uploads', action: 'Delete' },
      { id: 'audio', name: 'Audio', description: 'Block audio files', action: 'Delete' },
      { id: 'voice', name: 'Voice Messages', description: 'Block voice recordings', action: 'Delete' },
      { id: 'stickers', name: 'Stickers', description: 'Block sticker messages', action: 'Delete' },
      { id: 'videomsg', name: 'Video Messages', description: 'Block video messages', action: 'Delete' },
      { id: 'files', name: 'Files/Documents', description: 'Block file uploads', action: 'Delete' },
      { id: 'contacts', name: 'Contacts', description: 'Block contact sharing', action: 'Delete' },
    ]
  },
  {
    name: 'Behavioral Filters',
    filters: [
      { id: 'flood', name: 'Flood/Spam', description: 'Detect and block spam patterns', action: 'Mute 1h' },
      { id: 'msgrate', name: 'Message Rate', description: 'Limit messages per minute', action: 'Mute 1h' },
      { id: 'edited', name: 'Edited Messages', description: 'Block message editing', action: 'Delete' },
      { id: 'albumsize', name: 'Album Size', description: 'Limit media album size', action: 'Delete' },
      { id: 'botadd', name: 'Bot Addition', description: 'Prevent adding bots', action: 'Kick' },
      { id: 'forwarding', name: 'Forwarding', description: 'Block forwarded messages', action: 'Delete' },
      { id: 'repostbot', name: 'Repost Bot', description: 'Block repost bot content', action: 'Delete' },
    ]
  },
  {
    name: 'Special Filters',
    filters: [
      { id: 'rtl', name: 'RTL Text', description: 'Filter right-to-left text', action: 'Delete' },
      { id: 'chinese', name: 'Chinese Characters', description: 'Filter Chinese text', action: 'Delete' },
      { id: 'dice', name: 'Dice/Emoji Games', description: 'Block Telegram games', action: 'Delete' },
      { id: 'reflinks', name: 'Referral Links', description: 'Block referral URLs', action: 'Delete' },
      { id: 'botlinks', name: 'Bot Links', description: 'Block bot start links', action: 'Delete' },
      { id: 'channelposts', name: 'Channel Posts', description: 'Block channel messages', action: 'Delete' },
    ]
  },
  {
    name: 'AI Filters',
    filters: [
      { id: 'nsfw', name: 'NSFW Detection', description: 'AI-powered content detection', action: 'Ban', ai: true },
    ]
  }
];

const actionOptions = ['Delete', 'Warn', 'Mute 1h', 'Mute 24h', 'Kick', 'Ban'];

export default function FiltersPage() {
  const [filters, setFilters] = useState<Record<string, { enabled: boolean; action: string }>>(
    Object.fromEntries(
      filterGroups.flatMap(g => g.filters).map(f => [f.id, { enabled: false, action: f.action }])
    )
  );

  const [drawerOpen, setDrawerOpen] = useState<string | null>(null);

  const toggleFilter = (id: string) => {
    setFilters(prev => ({
      ...prev,
      [id]: { ...prev[id], enabled: !prev[id].enabled }
    }));
  };

  const updateAction = (id: string, action: string) => {
    setFilters(prev => ({
      ...prev,
      [id]: { ...prev[id], action }
    }));
  };

  const totalEnabled = Object.values(filters).filter(f => f.enabled).length;

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-[1280px] mx-auto p-8 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[32px] font-bold text-text-primary">Content Filters</h1>
            <p className="text-text-secondary mt-1">AutoFilter Module • {totalEnabled} filters enabled</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-surface transition-colors">
              Disable All
            </button>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary-glow transition-colors">
              Enable All
            </button>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-[var(--radius-md)] overflow-hidden">
          <Accordion.Root type="single" collapsible defaultValue="group-0">
            {filterGroups.map((group, groupIndex) => (
              <Accordion.Item key={groupIndex} value={`group-${groupIndex}`} className="border-b border-border last:border-b-0">
                <Accordion.Header>
                  <Accordion.Trigger className="flex items-center justify-between w-full px-6 py-4 text-left hover:bg-surface-2 transition-colors group">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-text-primary">{group.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-muted text-text-secondary">
                        {group.filters.filter(f => filters[f.id]?.enabled).length} / {group.filters.length}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-text-muted transition-transform group-data-[state=open]:rotate-180" />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                  <div className="px-6 pb-4 space-y-2">
                    {group.filters.map((filter) => (
                      <div key={filter.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-md border border-transparent hover:border-border transition-colors">
                        <div className="flex items-center gap-3 flex-1">
                          <Switch.Root
                            checked={filters[filter.id]?.enabled}
                            onCheckedChange={() => toggleFilter(filter.id)}
                            className={`relative w-11 h-6 rounded-full transition-colors ${
                              filters[filter.id]?.enabled ? 'bg-primary' : 'bg-text-muted/30'
                            }`}
                          >
                            <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[22px]" />
                          </Switch.Root>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-text-primary">{filter.name}</span>
                              {filter.ai && (
                                <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded text-[10px] font-medium text-white">
                                  AI
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-text-secondary mt-0.5">{filter.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <select
                            value={filters[filter.id]?.action}
                            onChange={(e) => updateAction(filter.id, e.target.value)}
                            className="px-3 py-1.5 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            disabled={!filters[filter.id]?.enabled}
                          >
                            {actionOptions.map(action => (
                              <option key={action} value={action}>{action}</option>
                            ))}
                          </select>
                          <button
                            className="p-2 rounded-md hover:bg-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!filters[filter.id]?.enabled}
                            onClick={() => setDrawerOpen(filter.id)}
                          >
                            <Settings2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>

        <div className="flex items-start gap-3 p-4 bg-warning/10 border border-warning/30 rounded-md">
          <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-text-primary">Filter Configuration Notice</p>
            <p className="text-sm text-text-secondary mt-1">
              Some filters may affect legitimate messages. Test configurations carefully before enabling strict actions like Ban or Kick.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

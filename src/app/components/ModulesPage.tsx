import {
  Flame, Bot, IdCard, Gauge, Puzzle, Lock, Filter as FilterIcon, Gavel, CheckCircle,
  EyeOff, AlertTriangle, Radio, ClipboardCheck, Hand, Eye,
  Bolt, MessageSquareText, Clock, TrendingUp, Star, Trophy, Award, Coins,
  BarChart3, List, Activity, Share2, Link2, ListChecks, Globe, Search, ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import * as Switch from '@radix-ui/react-switch';

const moduleIcons: Record<string, any> = {
  AttackMode: Flame, AntiBot: Bot, FaceControl: IdCard, RateLimit: Gauge, Captcha: Puzzle,
  Lockdown: Lock, AutoFilter: FilterIcon, ManualMod: Gavel, Whitelist: CheckCircle,
  ReadOnly: EyeOff, WarningSystem: AlertTriangle, ChannelSubCheck: Radio,
  FormVerification: ClipboardCheck, Welcome: Hand, Farewell: Hand, 'NSFW Detection': Eye,
  Triggers: Bolt, AutoReplies: MessageSquareText, ScheduledJobs: Clock, XP: TrendingUp,
  Reputation: Star, RankSystem: Trophy, Achievements: Award, ActionPoints: Coins,
  Statistics: BarChart3, ActivityLog: List, ChatActivity: Activity, ReferralSystem: Share2,
  InviteLinks: Link2, FormsSurveys: ListChecks, Network: Globe
};

const allModules = [
  { name: 'AttackMode', category: 'Security', description: 'Enhanced protection during active attacks', enabled: true },
  { name: 'AntiBot', category: 'Security', description: 'Automatically detect and remove bots', enabled: true },
  { name: 'FaceControl', category: 'Security', description: 'Profile photo verification for new members', enabled: false },
  { name: 'RateLimit', category: 'Security', description: 'Limit message frequency per user', enabled: true },
  { name: 'Captcha', category: 'Security', description: 'Challenge verification for new members', enabled: true },
  { name: 'Lockdown', category: 'Security', description: 'Emergency group lockdown mode', enabled: false },
  { name: 'AutoFilter', category: 'Content', description: 'Automatically filter unwanted content', enabled: true },
  { name: 'ManualMod', category: 'Content', description: 'Manual moderation queue system', enabled: false },
  { name: 'Whitelist', category: 'Content', description: 'Allow only whitelisted content', enabled: false },
  { name: 'ReadOnly', category: 'Content', description: 'Restrict group to read-only mode', enabled: false },
  { name: 'WarningSystem', category: 'Content', description: 'Progressive warning system for violations', enabled: true },
  { name: 'ChannelSubCheck', category: 'Verification', description: 'Verify channel subscription', enabled: true },
  { name: 'FormVerification', category: 'Verification', description: 'Custom form-based verification', enabled: true },
  { name: 'Welcome', category: 'Entry', description: 'Welcome messages for new members', enabled: true },
  { name: 'Farewell', category: 'Entry', description: 'Farewell messages for leaving members', enabled: false },
  { name: 'NSFW Detection', category: 'Entry', description: 'AI-powered NSFW content detection', enabled: false, ai: true },
  { name: 'Triggers', category: 'Automation', description: 'Custom rule-based automation', enabled: true },
  { name: 'AutoReplies', category: 'Automation', description: 'Automated response system', enabled: true },
  { name: 'ScheduledJobs', category: 'Automation', description: 'Schedule automated tasks', enabled: false },
  { name: 'XP', category: 'Gamification', description: 'Experience points system', enabled: true },
  { name: 'Reputation', category: 'Gamification', description: 'Member reputation tracking', enabled: true },
  { name: 'RankSystem', category: 'Gamification', description: 'Tiered rank progression system', enabled: true },
  { name: 'Achievements', category: 'Gamification', description: 'Unlock achievements and badges', enabled: false },
  { name: 'ActionPoints', category: 'Gamification', description: 'Currency system for member actions', enabled: false },
  { name: 'Statistics', category: 'Engagement', description: 'Detailed analytics and insights', enabled: true },
  { name: 'ActivityLog', category: 'Engagement', description: 'Comprehensive activity logging', enabled: true },
  { name: 'ChatActivity', category: 'Engagement', description: 'Track member activity patterns', enabled: true },
  { name: 'ReferralSystem', category: 'Engagement', description: 'Member referral tracking', enabled: true },
  { name: 'InviteLinks', category: 'Engagement', description: 'Manage custom invite links', enabled: false },
  { name: 'FormsSurveys', category: 'Engagement', description: 'Create forms and surveys', enabled: false },
  { name: 'Network', category: 'Infrastructure', description: 'Multi-group network features', enabled: false },
];

const categories = ['All', 'Security', 'Content', 'Verification', 'Entry', 'Automation', 'Gamification', 'Engagement', 'Infrastructure'];

export default function ModulesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modules, setModules] = useState(allModules);

  const filteredModules = modules.filter(module => {
    const matchesCategory = selectedCategory === 'All' || module.category === selectedCategory;
    const matchesSearch = module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          module.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const enabledCount = modules.filter(m => m.enabled).length;

  const toggleModule = (name: string) => {
    setModules(prev => prev.map(m => m.name === name ? { ...m, enabled: !m.enabled } : m));
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-[1280px] mx-auto p-8 space-y-6">
        <div>
          <h1 className="text-[32px] font-bold text-text-primary">Modules</h1>
          <p className="text-text-secondary mt-1">Enable and configure automation modules for your group</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-surface border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-md">
            <span className="text-sm font-medium text-text-primary">{enabledCount} enabled</span>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-primary/30'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModules.map((module) => {
            const Icon = moduleIcons[module.name] || Bolt;
            return (
              <div
                key={module.name}
                className={`relative bg-surface border rounded-[var(--radius-md)] p-5 transition-all ${
                  module.enabled
                    ? 'border-primary/30 shadow-[0_0_20px_rgba(99,102,241,0.08)]'
                    : 'border-border opacity-70'
                }`}
              >
                {module.ai && (
                  <div className="absolute top-3 right-3 px-2 py-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded text-[10px] font-medium text-white flex items-center gap-1">
                    <span>AI</span>
                  </div>
                )}

                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    module.enabled ? 'bg-primary/10' : 'bg-muted'
                  }`}>
                    <Icon className={`w-5 h-5 ${module.enabled ? 'text-primary' : 'text-text-muted'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-text-primary truncate">{module.name}</h3>
                      <Switch.Root
                        checked={module.enabled}
                        onCheckedChange={() => toggleModule(module.name)}
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          module.enabled ? 'bg-primary' : 'bg-text-muted/30'
                        }`}
                      >
                        <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[22px]" />
                      </Switch.Root>
                    </div>
                    <p className="text-sm text-text-secondary mt-1 line-clamp-2">{module.description}</p>
                  </div>
                </div>

                {module.enabled && (
                  <button className="w-full mt-2 px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-surface-2 transition-colors flex items-center justify-center gap-2">
                    Configure
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {filteredModules.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">No modules found</h3>
            <p className="text-text-secondary">Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </div>
  );
}

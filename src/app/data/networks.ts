// ─── Data Model ───────────────────────────────────────────────────────────────
// Frontend mock data for the Network / Group hierarchy.
// In production, this would come from the GlideOne backend via REST or Supabase.

export type GroupHealth = 'healthy' | 'warning' | 'critical';

export type Group = {
  id: string;
  networkId: string;
  name: string;
  username: string;
  memberCount: number;
  online: number;
  messagesToday: number;
  actionsToday: number;
  activeModules: number;
  totalModules: number;
  botActive: boolean;
  health: GroupHealth;
  joinedAt: string; // ISO date
};

export type Network = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  sharedModulesCount: number; // modules applied across all groups in this network
  groups: Group[];
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const mockNetworks: Network[] = [
  {
    id: 'net-1',
    name: 'Crypto Hub',
    description: 'All crypto-related community groups',
    createdAt: '2024-01-15',
    sharedModulesCount: 7,
    groups: [
      {
        id: 'grp-1',
        networkId: 'net-1',
        name: 'CryptoTalk Main',
        username: '@cryptotalk_main',
        memberCount: 12847,
        online: 234,
        messagesToday: 1892,
        actionsToday: 14,
        activeModules: 18,
        totalModules: 32,
        botActive: true,
        health: 'healthy',
        joinedAt: '2024-01-15',
      },
      {
        id: 'grp-2',
        networkId: 'net-1',
        name: 'CryptoTalk Alt',
        username: '@cryptotalk_alt',
        memberCount: 5231,
        online: 89,
        messagesToday: 543,
        actionsToday: 6,
        activeModules: 14,
        totalModules: 32,
        botActive: true,
        health: 'healthy',
        joinedAt: '2024-02-20',
      },
      {
        id: 'grp-3',
        networkId: 'net-1',
        name: 'NFT Collectors',
        username: '@nft_collectors',
        memberCount: 3102,
        online: 45,
        messagesToday: 231,
        actionsToday: 22,
        activeModules: 11,
        totalModules: 32,
        botActive: true,
        health: 'warning',
        joinedAt: '2024-03-05',
      },
    ],
  },
  {
    id: 'net-2',
    name: 'Gaming Network',
    description: 'Gaming community & esports groups',
    createdAt: '2024-02-01',
    sharedModulesCount: 5,
    groups: [
      {
        id: 'grp-4',
        networkId: 'net-2',
        name: 'GamersHub',
        username: '@gamershub_tg',
        memberCount: 8901,
        online: 156,
        messagesToday: 2341,
        actionsToday: 8,
        activeModules: 20,
        totalModules: 32,
        botActive: true,
        health: 'healthy',
        joinedAt: '2024-02-01',
      },
      {
        id: 'grp-5',
        networkId: 'net-2',
        name: 'GameTalk',
        username: '@gametalk',
        memberCount: 2345,
        online: 67,
        messagesToday: 891,
        actionsToday: 3,
        activeModules: 12,
        totalModules: 32,
        botActive: false,
        health: 'critical',
        joinedAt: '2024-03-10',
      },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getNetworkById(id: string): Network | undefined {
  return mockNetworks.find((n) => n.id === id);
}

export function getGroupById(id: string): Group | undefined {
  for (const network of mockNetworks) {
    const group = network.groups.find((g) => g.id === id);
    if (group) return group;
  }
  return undefined;
}

export function getGroupsForNetwork(networkId: string): Group[] {
  return getNetworkById(networkId)?.groups ?? [];
}

export function getNetworkTotals(network: Network) {
  return {
    totalMembers: network.groups.reduce((acc, g) => acc + g.memberCount, 0),
    totalOnline: network.groups.reduce((acc, g) => acc + g.online, 0),
    totalMessagesToday: network.groups.reduce((acc, g) => acc + g.messagesToday, 0),
    totalActionsToday: network.groups.reduce((acc, g) => acc + g.actionsToday, 0),
    activeGroups: network.groups.filter((g) => g.botActive).length,
    totalGroups: network.groups.length,
  };
}

// Initials avatar helper
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

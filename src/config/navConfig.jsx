import {
  LayoutDashboard,
  Store,
  ClipboardList,
  BarChart3,
  Calculator,
  FolderOpen,
  HeartHandshake,
  HelpCircle,
  TrendingUp,
  Users,
  Settings,
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
  Mic2,
  Globe,
  FileStack,
  Download,
  FileText,
  User,
  Activity,
  Globe2,
  PieChart,
  DollarSign,
  FileScan,
  MapPin,
  AlertTriangle,
  Sparkles,
  Briefcase,
  Coins,
  BadgeDollarSign
} from 'lucide-react';

export const ENTREPRENEUR_NAV = [
  {
    section: 'Overview',
    items: [
      { id: 'dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard },
    ],
  },
  {
    section: 'Business',
    items: [
      { id: 'assessment', labelKey: 'nav.business', icon: ClipboardList },
      { id: 'feasibility', labelKey: 'nav.feasibility', icon: BarChart3 },
      { id: 'market-intel', labelKey: 'nav.market', icon: TrendingUp },
    ],
  },
  {
    section: 'Finance',
    items: [
      { id: 'financial-structuring', labelKey: 'nav.calculator', icon: Calculator },
      { id: 'loan-recommendation', labelKey: 'nav.loans', icon: BadgeDollarSign },
      { id: 'repayment-plan', labelKey: 'nav.reports', icon: FileText },
    ],
  },
  {
    section: 'Funding',
    items: [
      { id: 'my-applications', labelKey: 'nav.loans', icon: FolderOpen },
      { id: 'funding-status', labelKey: 'status.under_review', icon: FileScan },
      { id: 'peer-investment', labelKey: 'nav.community', icon: HeartHandshake }, // Optional extension
    ],
  },
  {
    section: 'Advisor',
    items: [
      { id: 'voice-advisor', labelKey: 'nav.voice', icon: Mic2 },
    ],
  },
  {
    section: 'Language / Settings',
    items: [
      { id: 'language', labelKey: 'nav.settings', icon: Globe },
      { id: 'profile', labelKey: 'common.profileSettings', icon: User },
      { id: 'help', labelKey: 'nav.help', icon: HelpCircle },
    ],
  },
];

export const BANK_NAV = [
  {
    section: 'Overview',
    items: [
      { id: 'credit-dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard },
    ],
  },
  {
    section: 'Queue',
    items: [
      { id: 'pending-apps', labelKey: 'nav.loans', icon: Clock, badge: 'pending' },
      { id: 'under-review', labelKey: 'status.under_review', icon: FileScan },
      { id: 'approved', labelKey: 'status.approved', icon: CheckCircle2 },
      { id: 'rejected', labelKey: 'status.rejected', icon: XCircle },
    ],
  },
  {
    section: 'AI Assistant',
    items: [
      { id: 'feasibility-reports', labelKey: 'nav.feasibility', icon: BarChart3 },
      { id: 'market-intelligence', labelKey: 'nav.market', icon: MapPin },
      { id: 'risk-signals', labelKey: 'nav.alerts', icon: AlertTriangle },
      { id: 'ai-counter', labelKey: 'nav.reports', icon: Sparkles },
    ],
  },
  {
    section: 'Analytics',
    items: [
      { id: 'loan-portfolio', labelKey: 'nav.loans', icon: Briefcase },
      { id: 'regional-activity', labelKey: 'nav.analytics', icon: Globe2 },
    ],
  },
  {
    section: 'Tools',
    items: [
      { id: 'voice-advisor', labelKey: 'nav.voice', icon: Mic2 },
      { id: 'documents', labelKey: 'nav.reports', icon: FileStack },
    ],
  },
  {
    section: 'Settings',
    items: [
      { id: 'language', labelKey: 'nav.settings', icon: Globe },
      { id: 'profile', labelKey: 'common.profileSettings', icon: User },
      { id: 'help', labelKey: 'nav.help', icon: HelpCircle },
    ],
  },
];

export const ADMIN_NAV = [
  {
    section: 'Overview',
    items: [
      { id: 'national-dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard },
    ],
  },
  {
    section: 'Intelligence',
    items: [
      { id: 'regional-metrics', labelKey: 'nav.analytics', icon: Globe2 },
      { id: 'enterprise-categories', labelKey: 'nav.enterprise', icon: PieChart },
      { id: 'market-activity', labelKey: 'nav.market', icon: Activity },
    ],
  },
  {
    section: 'Finance',
    items: [
      { id: 'funding-dist', labelKey: 'nav.community', icon: DollarSign },
      { id: 'scheme-utilization', labelKey: 'nav.schemes', icon: FileText },
    ],
  },
  {
    section: 'Oversight',
    items: [
      { id: 'active-users', labelKey: 'nav.enterprise', icon: Users },
      { id: 'system-alerts', labelKey: 'nav.alerts', icon: Bell },
    ],
  },
  {
    section: 'Settings',
    items: [
      { id: 'language', labelKey: 'nav.settings', icon: Globe },
      { id: 'exports', labelKey: 'nav.reports', icon: Download },
      { id: 'profile', labelKey: 'common.profileSettings', icon: User },
      { id: 'help', labelKey: 'nav.help', icon: HelpCircle },
    ],
  },
];

export const getNavForRole = (role) => {
  switch (role) {
    case 'entrepreneur':
      return ENTREPRENEUR_NAV;
    case 'bank':
      return BANK_NAV;
    case 'admin':
      return ADMIN_NAV;
    default:
      return [];
  }
};

export const resolvePageFromNavId = (navId, currentRole) => {
  return { page: navId };
};

export const getDefaultNavId = (role) => {
  if (role === 'bank') return 'credit-dashboard';
  if (role === 'admin') return 'national-dashboard';
  return 'dashboard';
};

export const getActiveNavId = (page, role) => {
  return page;
};


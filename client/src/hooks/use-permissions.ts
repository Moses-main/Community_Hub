import { useAuth } from './use-auth';

type Permission = 
  | 'VIEW_ANALYTICS'
  | 'MANAGE_ATTENDANCE'
  | 'VIEW_ABSENT_MEMBERS'
  | 'FOLLOW_UP_ABSENT'
  | 'FOLLOW_UP_NEWCOMERS'
  | 'SEND_MESSAGES'
  | 'MANAGE_MEMBERS'
  | 'ADMIN';

const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  ADMIN: [
    'VIEW_ANALYTICS',
    'MANAGE_ATTENDANCE',
    'VIEW_ABSENT_MEMBERS',
    'FOLLOW_UP_ABSENT',
    'FOLLOW_UP_NEWCOMERS',
    'SEND_MESSAGES',
    'MANAGE_MEMBERS',
    'ADMIN',
  ],
  PASTOR: [
    'VIEW_ANALYTICS',
    'MANAGE_ATTENDANCE',
    'VIEW_ABSENT_MEMBERS',
    'FOLLOW_UP_ABSENT',
    'FOLLOW_UP_NEWCOMERS',
    'SEND_MESSAGES',
  ],
  PASTORS_WIFE: [
    'VIEW_ABSENT_MEMBERS',
    'FOLLOW_UP_ABSENT',
    'FOLLOW_UP_NEWCOMERS',
    'SEND_MESSAGES',
  ],
  CELL_LEADER: [
    'VIEW_ABSENT_MEMBERS',
    'FOLLOW_UP_ABSENT',
    'FOLLOW_UP_NEWCOMERS',
    'SEND_MESSAGES',
  ],
  USHERS_LEADER: [
    'MANAGE_ATTENDANCE',
    'VIEW_ABSENT_MEMBERS',
    'FOLLOW_UP_ABSENT',
  ],
  SUNDAY_SCHOOL_TEACHER: [
    'FOLLOW_UP_NEWCOMERS',
  ],
  PRAYER_TEAM: [
    'SEND_MESSAGES',
  ],
  EVANGELISM_TEAM: [
    'FOLLOW_UP_NEWCOMERS',
    'SEND_MESSAGES',
  ],
  MEMBER: [],
  USER: [],
  CHILDREN_LEADER: [],
  CHOIRMASTER: [],
  CHORISTER: [],
  SOUND_EQUIPMENT: [],
  SECURITY: [],
  USHER: [],
};

export function usePermissions() {
  const { user } = useAuth();

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    if (user.isAdmin) return true;

    const role = (user as any).role || 'MEMBER';
    const permissions = ROLE_PERMISSIONS[role] || [];
    return permissions.includes(permission);
  };

  const canFollowUpAbsent = (): boolean => {
    return hasPermission('FOLLOW_UP_ABSENT');
  };

  const canFollowUpNewcomers = (): boolean => {
    return hasPermission('FOLLOW_UP_NEWCOMERS');
  };

  const canViewAnalytics = (): boolean => {
    return hasPermission('VIEW_ANALYTICS');
  };

  const canViewAbsentMembers = (): boolean => {
    return hasPermission('VIEW_ABSENT_MEMBERS');
  };

  const canSendMessages = (): boolean => {
    return hasPermission('SEND_MESSAGES');
  };

  const isAdmin = (): boolean => {
    return user?.isAdmin || false;
  };

  return {
    hasPermission,
    canFollowUpAbsent,
    canFollowUpNewcomers,
    canViewAnalytics,
    canViewAbsentMembers,
    canSendMessages,
    isAdmin,
    permissions: user ? ROLE_PERMISSIONS[(user as any).role || 'MEMBER'] || [] : [],
  };
}

export type { Permission };
export { ROLE_PERMISSIONS };

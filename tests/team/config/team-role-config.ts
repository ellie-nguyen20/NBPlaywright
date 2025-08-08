/**
 * Team Role Configuration
 * Defines permissions and capabilities for different team roles
 */

export interface TeamRole {
  id: number;
  name: string;
  displayName: string;
  permissions: TeamPermission[];
  uiElements: UIElement[];
}

export interface TeamPermission {
  action: string;
  allowed: boolean;
  description: string;
}

export interface UIElement {
  selector: string;
  visible: boolean;
  description: string;
}

export const TEAM_ROLES: Record<string, TeamRole> = {
  OWNER: {
    id: 0,
    name: 'owner',
    displayName: 'Owner',
    permissions: [
      { action: 'create_team', allowed: true, description: 'Can create new teams' },
      { action: 'invite_members', allowed: true, description: 'Can invite members to team' },
      { action: 'remove_members', allowed: true, description: 'Can remove members from team' },
      { action: 'transfer_ownership', allowed: true, description: 'Can transfer team ownership' },
      { action: 'delete_team', allowed: true, description: 'Can delete the team' },
      { action: 'cancel_invites', allowed: true, description: 'Can cancel pending invitations' },
      { action: 'view_team_settings', allowed: true, description: 'Can view and edit team settings' },
      { action: 'leave_team', allowed: false, description: 'Cannot leave team as owner' }
    ],
    uiElements: [
      { selector: '[data-cy=invite-member-button]', visible: true, description: 'Invite member button' },
      { selector: '[data-cy=team-settings-tab]', visible: true, description: 'Team settings tab' },
      { selector: '[data-cy=disband-team-button]', visible: true, description: 'Delete team button' },
      { selector: '[data-cy=leave-team-button]', visible: false, description: 'Leave team button' },
      { selector: 'text=Manage', visible: true, description: 'Manage button in team list' },
      { selector: 'text=Delete', visible: true, description: 'Delete button in team list' },
      { selector: 'text=View', visible: false, description: 'View button in team list' }
    ]
  },
  MEMBER: {
    id: 1,
    name: 'member',
    displayName: 'Member',
    permissions: [
      { action: 'create_team', allowed: false, description: 'Cannot create new teams' },
      { action: 'invite_members', allowed: false, description: 'Cannot invite members to team' },
      { action: 'remove_members', allowed: false, description: 'Cannot remove members from team' },
      { action: 'transfer_ownership', allowed: false, description: 'Cannot transfer team ownership' },
      { action: 'delete_team', allowed: false, description: 'Cannot delete the team' },
      { action: 'cancel_invites', allowed: false, description: 'Cannot cancel pending invitations' },
      { action: 'view_team_settings', allowed: false, description: 'Cannot view team settings' },
      { action: 'leave_team', allowed: true, description: 'Can leave the team' }
    ],
    uiElements: [
      { selector: '[data-cy=invite-member-button]', visible: false, description: 'Invite member button' },
      { selector: '[data-cy=team-settings-tab]', visible: false, description: 'Team settings tab' },
      { selector: '[data-cy=disband-team-button]', visible: false, description: 'Delete team button' },
      { selector: '[data-cy=leave-team-button]', visible: true, description: 'Leave team button' },
      { selector: 'text=Manage', visible: false, description: 'Manage button in team list' },
      { selector: 'text=Delete', visible: false, description: 'Delete button in team list' },
      { selector: 'text=View', visible: true, description: 'View button in team list' }
    ]
  },
  ADMIN: {
    id: 2,
    name: 'admin',
    displayName: 'Admin',
    permissions: [
      { action: 'create_team', allowed: true, description: 'Can create new teams' },
      { action: 'invite_members', allowed: true, description: 'Can invite members to team' },
      { action: 'remove_members', allowed: true, description: 'Can remove members from team' },
      { action: 'transfer_ownership', allowed: true, description: 'Can transfer team ownership' },
      { action: 'delete_team', allowed: true, description: 'Can delete the team' },
      { action: 'cancel_invites', allowed: true, description: 'Can cancel pending invitations' },
      { action: 'view_team_settings', allowed: true, description: 'Can view and edit team settings' },
      { action: 'leave_team', allowed: false, description: 'Cannot leave team as admin' },
      { action: 'manage_all_teams', allowed: true, description: 'Can manage all teams in the system' },
      { action: 'view_analytics', allowed: true, description: 'Can view team analytics and reports' },
      { action: 'bulk_operations', allowed: true, description: 'Can perform bulk operations on teams' }
    ],
    uiElements: [
      { selector: '[data-cy=invite-member-button]', visible: true, description: 'Invite member button' },
      { selector: '[data-cy=team-settings-tab]', visible: true, description: 'Team settings tab' },
      { selector: '[data-cy=disband-team-button]', visible: true, description: 'Delete team button' },
      { selector: '[data-cy=leave-team-button]', visible: false, description: 'Leave team button' },
      { selector: 'text=Manage', visible: true, description: 'Manage button in team list' },
      { selector: 'text=Delete', visible: true, description: 'Delete button in team list' },
      { selector: 'text=View', visible: false, description: 'View button in team list' },
      { selector: '[data-cy=admin-analytics-tab]', visible: true, description: 'Admin analytics tab' },
      { selector: '[data-cy=bulk-operations-button]', visible: true, description: 'Bulk operations button' },
      { selector: '[data-cy=system-settings-tab]', visible: true, description: 'System settings tab' }
    ]
  }
};

export const getRoleById = (id: number): TeamRole | undefined => {
  return Object.values(TEAM_ROLES).find(role => role.id === id);
};

export const getRoleByName = (name: string): TeamRole | undefined => {
  return TEAM_ROLES[name.toUpperCase()];
};

export const hasPermission = (role: TeamRole, action: string): boolean => {
  const permission = role.permissions.find(p => p.action === action);
  return permission ? permission.allowed : false;
};

export const shouldShowUIElement = (role: TeamRole, selector: string): boolean => {
  const element = role.uiElements.find(e => e.selector === selector);
  return element ? element.visible : false;
}; 
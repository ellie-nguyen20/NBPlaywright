// tests/api/team.ts
import { APIRequestContext } from '@playwright/test';

const BASE_URL = 'https://dev-portal-api.nebulablock.com';

export async function createTeam(request: APIRequestContext, token: string, name: string, description: string) {
  const res = await request.post(`${BASE_URL}/api/v1/teams`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { name, description },
  });

  if (res.status() !== 200) throw new Error('Create team failed');
  return (await res.json()).data;
}

export async function deleteTeam(request: APIRequestContext, token: string, teamId: string) {
  const res = await request.delete(`${BASE_URL}/api/v1/teams/${teamId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status() !== 200) throw new Error('Delete team failed');
}

export async function createApiTeamKey(request: APIRequestContext, token: string, name: string, description: string, teamId: string) {
  const res = await request.post(`${BASE_URL}/api/v1/keys`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      name,
      description,
      team_id: teamId,
    },
  });

  if (res.status() !== 200) throw new Error('Create key failed');
  return (await res.json()).data;
}

export async function inviteMemberToTeam(request: APIRequestContext, token: string, teamId: string, email: string) {
  const res = await request.post(`${BASE_URL}/api/v1/teams/${teamId}/members`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { email },
  });

  if (res.status() !== 200) throw new Error('Invite member failed');
  return (await res.json()).data.token;
}

export async function acceptTeamInvitation(request: APIRequestContext, token: string, inviteToken: string) {
  const res = await request.post(`${BASE_URL}/api/v1/teams/invitations/${inviteToken}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status() !== 200) throw new Error('Accept invitation failed');
}

export async function getTeams(request: APIRequestContext, token: string) {
  const res = await request.get(`${BASE_URL}/api/v1/teams`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status() !== 200) throw new Error('Get teams failed');
  return (await res.json()).data;
}

export async function getTeamId(request: APIRequestContext, token: string, teamName: string): Promise<number | null> {
  try {
    const teams = await getTeams(request, token);
    const team = teams.find((team: any) => team.name === teamName);
    return team ? team.id : null;
  } catch (error) {
    console.log(`Failed to get team ID for "${teamName}":`, error);
    return null;
  }
}

export async function deleteTeamByName(request: APIRequestContext, token: string, teamName: string) {
  const teamId = await getTeamId(request, token, teamName);
  if (teamId) {
    await deleteTeam(request, token, teamId.toString());
    console.log(`Team "${teamName}" (ID: ${teamId}) deleted via API`);
  } else {
    console.log(`Team "${teamName}" not found`);
  }
}

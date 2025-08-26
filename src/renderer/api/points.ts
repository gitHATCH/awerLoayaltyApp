import axiosClient from './axiosClient';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  dni: string;
  avatar?: string;
  points: number;
  level: string;
  nextLevel: string;
  pointsToNext: number;
  totalRedeemed: number;
  expiring?: { points: number; date: string };
}

export interface PointsConfig {
  unitAmount: number | null;
  pointsPerUnit: number | null;
}

let currentUser: UserProfile | null = null;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function fetchPointsConfig(): Promise<PointsConfig> {
  const { data } = await axiosClient.get<{
    unitAmount?: number | null;
    pointsPerUnit?: number | null;
  }>("/awer-core/reward/config");
  return {
    unitAmount: data.unitAmount ?? null,
    pointsPerUnit: data.pointsPerUnit ?? null,
  };
}

interface ApiUser {
  name: string;
  surname: string;
  dni: string | null;
  pointsToNextLevel: number;
  nextLevel: string;
  userPoints: number;
  userLevel: string;
  email: string;
}

function mapUser(u: ApiUser): UserProfile {
  return {
    id: `${u.dni ?? ''}-${u.email}`,
    name: `${u.name} ${u.surname}`.trim(),
    email: u.email,
    dni: u.dni ?? '',
    points: u.userPoints,
    level: u.userLevel,
    nextLevel: u.nextLevel,
    pointsToNext: u.pointsToNextLevel,
    totalRedeemed: 0,
  };
}

export async function fetchUsersByDni(dni: string): Promise<UserProfile[]> {
  const { data } = await axiosClient.get<ApiUser[]>(
    '/awer-core/reward/ext/user',
    { params: { dni } }
  );
  const profiles = data.map(mapUser);
  if (profiles.length === 1) {
    currentUser = profiles[0];
  }
  return profiles;
}

export async function fetchUserByDniEmail(
  dni: string,
  email: string
): Promise<UserProfile> {
  const { data } = await axiosClient.get<ApiUser[]>(
    '/awer-core/reward/ext/user',
    { params: { dni, email } }
  );
  const user = data[0];
  if (!user) throw new Error('Usuario no registrado en el programa de puntos');
  const profile = mapUser(user);
  currentUser = profile;
  return profile;
}

export async function addPoints(amount: number): Promise<{ profile: UserProfile; added: number; expires: string }> {
  // TODO: const { data } = await axiosClient.post('/points', { amount });
  await delay(500);
  const rate = 10;
  const added = Math.floor(amount / rate);
  currentUser.points += added;
  currentUser.pointsToNext -= added;
  if (currentUser.pointsToNext <= 0) {
    currentUser.level = currentUser.nextLevel;
    currentUser.nextLevel = 'PLATINUM';
    currentUser.pointsToNext = 500;
  }
  return { profile: currentUser, added, expires: '2025-12-31' };
}

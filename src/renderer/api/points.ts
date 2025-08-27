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
  expiringPoints?: number;
  expiringDate?: string;
}

export interface PointsConfig {
  unitAmount: number | null;
  pointsPerUnit: number | null;
}

let currentUser: UserProfile | null = null;

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
  availablePoints?: number;
  userLevel: string;
  email: string;
  avatar?: string | null;
  pointsToExpire?: number | null;
  expireDate?: [number, number, number] | null;
  totalRedeemedPoints: number;
}

function mapUser(u: ApiUser): UserProfile {
  let expiringPoints: number | undefined;
  let expiringDate: string | undefined;
  if (u.pointsToExpire && u.expireDate) {
    const [y, m, d] = u.expireDate;
    const expiration = new Date(y, m - 1, d);
    const diffDays = Math.ceil(
      (expiration.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays < 4) {
      expiringPoints = u.pointsToExpire;
      expiringDate = `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
    }
  }
  return {
    id: `${u.dni ?? ''}-${u.email}`,
    name: `${u.name} ${u.surname}`.trim(),
    email: u.email,
    dni: u.dni ?? '',
    avatar: u.avatar ?? undefined,
    points: u.userPoints,
    level: u.userLevel,
    nextLevel: u.nextLevel,
    pointsToNext: u.pointsToNextLevel,
    totalRedeemed: u.totalRedeemedPoints,
    expiringPoints,
    expiringDate,
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
  if (!currentUser) {
    throw new Error('Usuario no cargado');
  }

  const branchId = localStorage.getItem('pos');
  if (!branchId) {
    throw new Error('INVALID_POS');
  }

  const prevPoints = currentUser.points;

  const { data } = await axiosClient.post<ApiUser>(
    '/awer-core/reward/ext/purchase-points',
    amount,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        branchId,
        dni: currentUser.dni,
      },
    },
  );

  const profile = mapUser(data);
  const added = profile.points - prevPoints;
  const expires = data.expireDate
    ? `${String(data.expireDate[2]).padStart(2, '0')}/${String(data.expireDate[1]).padStart(2, '0')}/${data.expireDate[0]}`
    : '';

  currentUser = profile;
  return { profile, added, expires };
}

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

const mockUsers: UserProfile[] = [
  {
    id: '1',
    name: 'Alejandro',
    email: 'alejandro@example.com',
    dni: '12345678',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    points: 1200,
    level: 'SILVER',
    nextLevel: 'GOLD',
    pointsToNext: 300,
    totalRedeemed: 3400,
    expiring: { points: 100, date: '2024-12-31' },
  },
  {
    id: '4',
    name: 'Alejandro',
    email: 'alejandro2@example.com',
    dni: '12345678',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    points: 1200,
    level: 'SILVER',
    nextLevel: 'GOLD',
    pointsToNext: 300,
    totalRedeemed: 3400,
    expiring: { points: 100, date: '2024-12-31' },
  },
  {
    id: '2',
    name: 'Beatriz',
    email: 'beatriz@example.com',
    dni: '23456789',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    points: 800,
    level: 'BRONZE',
    nextLevel: 'SILVER',
    pointsToNext: 200,
    totalRedeemed: 1500,
  },
  {
    id: '3',
    name: 'Carlos',
    email: 'carlos@example.com',
    dni: '34567890',
    points: 2000,
    level: 'GOLD',
    nextLevel: 'PLATINUM',
    pointsToNext: 500,
    totalRedeemed: 5000,
    expiring: { points: 50, date: '2024-10-31' },
  },
];

let currentUser: UserProfile = mockUsers[0];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function searchUsers(query: string): Promise<string[]> {
  // TODO: return (await axiosClient.get<string[]>('/users/search', { params: { q: query } })).data;
  await delay(200);
  return mockUsers.map(u => u.email).filter(e => e.includes(query));
}

export async function fetchEmailsByDni(dni: string): Promise<string[]> {
  // TODO: return (await axiosClient.get<string[]>(`/users/dni/${dni}`)).data;
  await delay(300);
  return mockUsers.filter(u => u.dni === dni).map(u => u.email);
}

export async function fetchUser(email: string): Promise<UserProfile> {
  // TODO: return (await axiosClient.get<UserProfile>(`/users/${email}`)).data;
  await delay(500);
  const user = mockUsers.find(u => u.email === email);
  if (!user) throw new Error('Usuario no registrado en el programa de puntos');
  currentUser = { ...user };
  return currentUser;
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

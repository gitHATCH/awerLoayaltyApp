export interface Brand {
  id: string;
  name: string;
  logo: string;
}

export async function mockLogin(user: string, password: string): Promise<{token: string}> {
  // simulate network latency
  await new Promise(res => setTimeout(res, 500));
  return { token: `mock-token-${user}` };
}

export async function mockFetchBrands(): Promise<Brand[]> {
  await new Promise(res => setTimeout(res, 500));
  return [
    { id: 'kentucky', name: 'Kentucky', logo: 'https://via.placeholder.com/80?text=K' },
    { id: 'chickenchill', name: 'Chicken Chill', logo: 'https://via.placeholder.com/80?text=C' },
    { id: 'churritas', name: 'Churritas', logo: 'https://via.placeholder.com/80?text=CH' },
    { id: 'sbarro', name: 'Sbarro', logo: 'https://via.placeholder.com/80?text=S' },
    { id: 'sunny', name: 'Sunny', logo: 'https://via.placeholder.com/80?text=SU' }
  ];
}


export interface Pos {
  id: string;
  name: string;
}

export async function mockFetchPos(brandId: string): Promise<Pos[]> {
  await new Promise(res => setTimeout(res, 500));
  return Array.from({ length: 20 }).map((_, i) => ({
    id: `${brandId}-pos-${i + 1}`,
    name: `Sucursal ${i + 1}`
  }));
}

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

let mockUser: UserProfile = {
  id: '1',
  name: 'Alejandro',
  email: 'alejandro@example.com',
  dni: '12345678',
  points: 1200,
  level: 'SILVER',
  nextLevel: 'GOLD',
  pointsToNext: 300,
  totalRedeemed: 3400,
  expiring: { points: 100, date: '2024-12-31' }
};

export async function mockFetchUser(dni: string, email: string): Promise<UserProfile> {
  await new Promise(res => setTimeout(res, 500));
  if (dni !== mockUser.dni || email !== mockUser.email) {
    throw new Error('Usuario no registrado en el programa de puntos');
  }
  return mockUser;
}

export async function mockAddPoints(amount: number): Promise<{profile: UserProfile; added: number; expires: string}> {
  await new Promise(res => setTimeout(res, 500));
  const rate = 10;
  const added = Math.floor(amount / rate);
  mockUser.points += added;
  mockUser.pointsToNext -= added;
  if (mockUser.pointsToNext <= 0) {
    mockUser.level = mockUser.nextLevel;
    mockUser.nextLevel = 'PLATINUM';
    mockUser.pointsToNext = 500;
  }
  return { profile: mockUser, added, expires: '2025-12-31' };
}


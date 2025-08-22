import axiosClient from './axiosClient';

export interface Brand {
  id: string;
  name: string;
  logo: string;
}

export interface Pos {
  id: string;
  name: string;
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function login(user: string, password: string): Promise<{ token: string }> {
  // TODO: replace with real POST /login call
  await delay(500);
  return { token: `mock-token-${user}` };
}

export async function authenticate(): Promise<boolean> {
  // TODO: replace with real GET /auth call
  await delay(500);
  return true;
}

export async function fetchBrands(): Promise<Brand[]> {
  // TODO: return (await axiosClient.get<Brand[]>('/brands')).data;
  await delay(500);
  return [
    { id: 'kentucky', name: 'Kentucky', logo: 'https://picsum.photos/seed/kentucky/80/80' },
    { id: 'chickenchill', name: 'Chicken Chill', logo: 'https://picsum.photos/seed/chickenchill/80/80' },
    { id: 'churritas', name: 'Churritas', logo: 'https://picsum.photos/seed/churritas/80/80' },
    { id: 'sbarro', name: 'Sbarro', logo: 'https://picsum.photos/seed/sbarro/80/80' },
    { id: 'sunny', name: 'Sunny', logo: 'https://picsum.photos/seed/sunny/80/80' },
  ];
}

export async function fetchPos(brandId: string): Promise<Pos[]> {
  // TODO: return (await axiosClient.get<Pos[]>(`/brands/${brandId}/pos`)).data;
  await delay(500);
  return Array.from({ length: 20 }).map((_, i) => ({
    id: `${brandId}-pos-${i + 1}`,
    name: `Sucursal ${i + 1}`,
  }));
}

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

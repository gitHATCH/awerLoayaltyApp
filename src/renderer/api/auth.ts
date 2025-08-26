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

export interface Branch {
  id: number;
  name: string;
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export interface AuthResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  sub: string;
  aud: string;
  roles: string[];
  iss: string;
  scopes: string[];
  jti: string;
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  const params = new URLSearchParams({ username, password, grant_type: 'password' });
  const { data } = await axiosClient.post<AuthResponse>(
    '/awer-auth/oauth/token',
    params,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${import.meta.env.VITE_BASIC_AUTH}`
      }
    }
  );
  return data;
}

export interface UserInfo {
  companyId: number;
}

export async function fetchCurrentUser(): Promise<UserInfo> {
  const { data } = await axiosClient.get<{
    companyId: number;
  }>("/awer-core/users/me");
  return { companyId: data.companyId };
}

export interface CompanyData {
  companyName: string;
  companyLogo: string;
  branches: Branch[];
}

export async function fetchBranches(companyId: number): Promise<CompanyData> {
  const { data } = await axiosClient.get<{
    name: string;
    companyProfile?: { logoFile: string };
    branches: { id: number; name: string }[];
  }>(`/awer-core/companies/${companyId}`);

  const branches = data.branches?.map((b) => ({ id: b.id, name: b.name })) || [];
  const companyName = data.name;
  const companyLogo = data.companyProfile?.logoFile || '';

  return { companyName, companyLogo, branches };
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


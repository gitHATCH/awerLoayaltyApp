import React from 'react';
import { Branch } from '../api/auth';

interface CompanyContextValue {
  companyId: number | null;
  companyName: string;
  companyLogo: string;
  branches: Branch[];
  setCompanyId: React.Dispatch<React.SetStateAction<number | null>>;
  setCompanyName: React.Dispatch<React.SetStateAction<string>>;
  setCompanyLogo: React.Dispatch<React.SetStateAction<string>>;
  setBranches: React.Dispatch<React.SetStateAction<Branch[]>>;
}

const CompanyContext = React.createContext<CompanyContextValue | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companyId, setCompanyId] = React.useState<number | null>(null);
  const [companyName, setCompanyName] = React.useState('');
  const [companyLogo, setCompanyLogo] = React.useState('');
  const [branches, setBranches] = React.useState<Branch[]>([]);

  return (
    <CompanyContext.Provider value={{ companyId, companyName, companyLogo, branches, setCompanyId, setCompanyName, setCompanyLogo, setBranches }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = (): CompanyContextValue => {
  const context = React.useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};


import React from 'react';

interface PointsConfigContextValue {
  unitAmount: number | null;
  pointsPerUnit: number | null;
  setUnitAmount: React.Dispatch<React.SetStateAction<number | null>>;
  setPointsPerUnit: React.Dispatch<React.SetStateAction<number | null>>;
}

const PointsConfigContext = React.createContext<PointsConfigContextValue | undefined>(undefined);

export const PointsConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unitAmount, setUnitAmount] = React.useState<number | null>(null);
  const [pointsPerUnit, setPointsPerUnit] = React.useState<number | null>(null);

  return (
    <PointsConfigContext.Provider value={{ unitAmount, pointsPerUnit, setUnitAmount, setPointsPerUnit }}>
      {children}
    </PointsConfigContext.Provider>
  );
};

export const usePointsConfig = (): PointsConfigContextValue => {
  const context = React.useContext(PointsConfigContext);
  if (!context) {
    throw new Error('usePointsConfig must be used within a PointsConfigProvider');
  }
  return context;
};


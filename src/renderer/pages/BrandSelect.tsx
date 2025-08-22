import React from 'react';
import { Brand, mockFetchBrands } from '../api/mock';

interface Props {
  onSelect: (brand: Brand) => void;
  onLogout: () => void;
}

const BrandSelect: React.FC<Props> = ({ onSelect, onLogout }) => {
  const [brands, setBrands] = React.useState<Brand[]>([]);

  React.useEffect(() => {
    mockFetchBrands().then(setBrands);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg flex flex-col items-center gap-4">
        <h1 className="text-xl font-semibold text-center">Seleccione la marca con la que desea ingresar</h1>
        <div className="flex flex-wrap justify-center gap-4">
          {brands.map((b) => (
            <button
              key={b.id}
              onClick={() => onSelect(b)}
              className="flex flex-col items-center gap-1"
            >
              <img src={b.logo} alt={b.name} className="h-16 w-16 rounded-full border" />
              <span className="text-sm">{b.name}</span>
            </button>
          ))}
        </div>
        <button
          onClick={onLogout}
          className="mt-4 px-4 py-1 border border-red-500 rounded-full text-red-600 hover:bg-red-50"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default BrandSelect;

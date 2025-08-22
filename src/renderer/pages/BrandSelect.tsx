import React from 'react';
import { Brand, fetchBrands } from '../api/auth';
import Spinner from '../components/Spinner';

interface Props {
  onSelect: (brand: Brand) => void;
  onLogout: () => void;
}

const BrandSelect: React.FC<Props> = ({ onSelect, onLogout }) => {
  const [brands, setBrands] = React.useState<Brand[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchBrands().then((b) => {
      setBrands(b);
      setLoading(false);
    });
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-8 rounded-xl shadow-md w-full max-w-lg flex flex-col items-center gap-4">
        <h1 className="text-xl font-semibold text-center">Seleccione la marca con la que desea ingresar</h1>
        <div className="flex flex-wrap justify-center gap-4">
          {brands.map((b) => (
            <button
              key={b.id}
              onClick={() => onSelect(b)}
              className="flex flex-col items-center gap-1 text-gray-800 dark:text-white"
            >
              <img
                src={b.logo}
                alt={b.name}
                className="h-16 w-16 rounded-full border dark:border-gray-600"
                onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/80?text=No+Img'; }}
              />
              <span className="text-sm">{b.name}</span>
            </button>
          ))}
        </div>
        <button
          onClick={onLogout}
          className="mt-4 px-4 py-1 border border-red-500 rounded-full text-red-600 hover:bg-red-50 dark:hover:bg-gray-700"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default BrandSelect;

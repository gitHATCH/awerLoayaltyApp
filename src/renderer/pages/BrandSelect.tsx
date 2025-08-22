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
    <div className="min-h-screen flex items-center justify-center bg-transparent px-2 sm:px-4">
      <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto flex flex-col gap-6 sm:gap-7 border border-green-200 dark:border-gray-700 animate-fade-in max-h-[90vh]">
        <div className="flex flex-col items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-green-600 dark:text-green-400 mb-1 text-center">
            Seleccione la marca
          </h1>
          <span className="text-lg sm:text-2xl md:text-3xl font-black tracking-wide bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-lg uppercase text-center">
            AWER LOYALTY
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-4 overflow-y-auto brand-scroll" style={{ maxHeight: '40vh' }}>
          {brands.map((b) => (
            <button
              key={b.id}
              onClick={() => onSelect(b)}
              className="flex flex-col items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl p-3 transition-all shadow-md w-28 sm:w-32 md:w-36"
            >
              <img
                src={b.logo || 'https://w0.peakpx.com/wallpaper/429/103/HD-wallpaper-company-logo-black-company.jpg'}
                alt={b.name}
                className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-2 border-green-400 dark:border-green-600 object-cover bg-white dark:bg-gray-900"
                onError={(e) => { e.currentTarget.src = '/default-brand.png'; }}
              />
              <span className="text-xs sm:text-sm md:text-base font-semibold text-center truncate w-full">{b.name}</span>
            </button>
          ))}
        </div>
        <button
          onClick={onLogout}
          className="mt-4 px-4 py-2 border border-red-500 rounded-full text-red-600 font-semibold hover:bg-red-50 dark:hover:bg-gray-700 transition-all shadow"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default BrandSelect;
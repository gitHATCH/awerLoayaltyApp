import React from 'react';

interface Props {
  onChangeBrand: () => void;
  onLogout: () => void;
}

const Header: React.FC<Props> = ({ onChangeBrand, onLogout }) => {
  return (

    <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow">

      <div className="flex items-center text-2xl font-bold text-green-600">
        <span className="mr-2">★</span> AWER Reviews
      </div>
      <div className="flex gap-2">
        <button
          onClick={onChangeBrand}
          className="px-4 py-1 text-sm border border-green-500 rounded-full text-green-600 hover:bg-green-50 dark:hover:bg-gray-700"
        >
          Cambiar marca
        </button>
        <button
          onClick={onLogout}
          className="px-4 py-1 text-sm border border-red-500 rounded-full text-red-600 hover:bg-red-50 dark:hover:bg-gray-700"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};

export default Header;

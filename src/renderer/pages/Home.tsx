import React from 'react';

interface Props {
  onChangePos: () => void;
  onLoadPoints: () => void;
}

const Home: React.FC<Props> = ({ onChangePos, onLoadPoints }) => {
  const pos = localStorage.getItem('pos') || 'Punto de Venta';

  return (
    <div className="min-h-full flex flex-col items-center mt-20 gap-4">
      <h1 className="text-2xl font-semibold mb-4">{pos}</h1>
      <button
        className="w-64 py-3 border border-green-500 rounded-full text-green-600 hover:bg-green-50 dark:hover:bg-gray-700"
        onClick={onLoadPoints}
      >
        Cargar puntos
      </button>

      <button
        className="w-64 py-3 border border-green-500 rounded-full text-green-600 hover:bg-green-50 dark:hover:bg-gray-700"
        onClick={onChangePos}
      >
        Cambiar punto de venta
      </button>
      <button className="w-64 py-3 border border-green-500 rounded-full text-green-600 hover:bg-green-50 dark:hover:bg-gray-700">
        Configuración
      </button>

    </div>
  );
};

export default Home;

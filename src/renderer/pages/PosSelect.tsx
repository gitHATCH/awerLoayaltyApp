import React from 'react';
import { Pos, mockFetchPos } from '../api/mock';

interface Props {
  onSelect: (pos: Pos) => void;
  onCancel: () => void;
}

const PosSelect: React.FC<Props> = ({ onSelect, onCancel }) => {
  const [poses, setPoses] = React.useState<Pos[]>([]);
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    const brand = localStorage.getItem('brand') || '';
    mockFetchPos(brand).then(setPoses);
  }, []);

  const filtered = poses.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg flex flex-col gap-4">
        <h1 className="text-xl font-semibold text-center">Seleccione el punto de venta</h1>
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <div className="max-h-64 overflow-y-auto w-full">
          {filtered.map(p => (
            <button
              key={p.id}
              onClick={() => onSelect(p)}
              className="block w-full text-left px-3 py-2 hover:bg-gray-100"
            >
              {p.name}
            </button>
          ))}
        </div>
        <button
          onClick={onCancel}
          className="mt-2 px-4 py-1 border border-red-500 rounded-full text-red-600 hover:bg-red-50"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default PosSelect;

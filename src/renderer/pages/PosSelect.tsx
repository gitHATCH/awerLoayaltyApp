import React from 'react';
import { Pos, fetchPos } from '../api/auth';
import Spinner from '../components/Spinner';

interface Props {
  onSelect: (pos: Pos) => void;
  onCancel: () => void;
}

const PosSelect: React.FC<Props> = ({ onSelect, onCancel }) => {
  const [poses, setPoses] = React.useState<Pos[]>([]);
  const [search, setSearch] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const brand = localStorage.getItem('brand') || '';
    fetchPos(brand).then((p) => {
      setPoses(p);
      setLoading(false);
    });
  }, []);

  const filtered = poses.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  if (loading)
    return (
      <div className="min-h-full flex items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="min-h-full flex items-center justify-center relative">
      <button onClick={onCancel} className="absolute top-4 left-4 text-3xl text-green-600 font-bold">←</button>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-lg flex flex-col gap-4 text-gray-800 dark:text-gray-100">
        <h1 className="text-xl font-semibold text-center">Seleccione el punto de venta</h1>
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        />
        <div className="max-h-64 overflow-y-auto w-full">
          {filtered.map(p => (
            <button
              key={p.id}
              onClick={() => onSelect(p)}
              className="block w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PosSelect;

import React from 'react';
import Toast from '../components/Toast';
import { mockFetchUser, UserProfile } from '../api/mock';

interface Props {
  onBack: () => void;
  onNext: (profile: UserProfile) => void;
}

const PointsStep1: React.FC<Props> = ({ onBack, onNext }) => {
  const [dni, setDni] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [toast, setToast] = React.useState<string | null>(null);

  const handleNext = () => {
    mockFetchUser(dni, email)
      .then(onNext)
      .catch((e) => {
        setToast(e.message);
        setTimeout(() => setToast(null), 3000);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <button onClick={onBack} className="absolute top-4 left-4 text-2xl">←</button>
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md flex flex-col gap-4 items-center">
        <div className="flex items-center text-2xl font-bold text-green-600">
          <span className="mr-2">★</span> AWER Reviews
        </div>
        <h2 className="text-center">Cargue los datos del usuario</h2>
        <input
          type="text"
          placeholder="DNI"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <button
          onClick={handleNext}
          className="w-full py-2 mt-2 border border-green-500 rounded-full text-green-600 hover:bg-green-50"
        >
          Siguiente
        </button>
      </div>
      {toast && <Toast message={toast} type="error" />}
    </div>
  );
};

export default PointsStep1;

import React, { useEffect } from 'react';
import Toast from '../components/Toast';
import { UserProfile } from '../api/mock';

interface Props {
  profile: UserProfile;
  added: number;
  expires: string;
  onBack: () => void;
  onClose: () => void;
}

const PointsStepFinal: React.FC<Props> = ({ profile, added, expires, onBack, onClose }) => {
  const [toast, setToast] = React.useState<string | null>(null);

  useEffect(() => {
    setToast('Los puntos fueron acreditados correctamente');
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <button onClick={onBack} className="absolute top-4 left-4 text-2xl">←</button>
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <img
            src={profile.avatar || 'https://via.placeholder.com/80'}
            alt={profile.name}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h3 className="text-xl font-semibold">{profile.name}</h3>
            <p className="text-sm text-gray-600">{profile.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="font-semibold">Puntos actuales</p>
            <p>{profile.points}</p>
          </div>
          <div>
            <p className="font-semibold">Próximo nivel</p>
            <p>
              {profile.nextLevel} ({profile.pointsToNext} pts)
            </p>
          </div>
          <div>
            <p className="font-semibold">Total canjeado</p>
            <p>{profile.totalRedeemed}</p>
          </div>
        </div>
        {profile.expiring && (
          <div className="text-center text-sm text-red-500">
            Próximos a vencer: {profile.expiring.points} pts el {profile.expiring.date}
          </div>
        )}
        <div className="text-center">
          Sumaste <strong>{added} puntos</strong> y tenés hasta {expires} para gastarlos.
        </div>
        <button
          onClick={onClose}
          className="w-full py-2 border border-green-500 rounded-full text-green-600 hover:bg-green-50"
        >
          Cerrar
        </button>
      </div>
      {toast && <Toast message={toast} />}
    </div>
  );
};

export default PointsStepFinal;

import React from 'react';
import Toast from '../components/Toast';
import { UserProfile, mockAddPoints } from '../api/mock';

interface Props {
  profile: UserProfile;
  onBack: () => void;
  onNext: (updated: UserProfile, added: number, expires: string) => void;
}

const RATE = 10; // 1 punto cada 10$

const levelColors: Record<string, string> = {
  BRONZE: 'bg-amber-700',
  SILVER: 'bg-gray-300',
  GOLD: 'bg-yellow-400',
  PLATINUM: 'bg-gray-400',
};

const PointsStep2: React.FC<Props> = ({ profile, onBack, onNext }) => {
  const [amount, setAmount] = React.useState('');
  const [toast, setToast] = React.useState<string | null>(null);

  const points = Math.floor((parseFloat(amount) || 0) / RATE);

  const handleNext = () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value < RATE) {
      setToast(`El monto es muy pequeño`);
      setTimeout(() => setToast(null), 3000);
      return;
    }
    mockAddPoints(value).then(({ profile: p, added, expires }) => {
      onNext(p, added, expires);
    });
  };

  const medalColor = levelColors[profile.level] || 'bg-gray-300';

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <button onClick={onBack} className="absolute top-4 left-4 text-2xl">←</button>
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg flex flex-col gap-6 relative">
        <div className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-white text-xs font-bold ${medalColor}`}>
          {profile.level}
        </div>
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
        <div className="flex items-center gap-2">
          <span>Ganas 1 punto por cada ${RATE}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>$</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 px-3 py-2 border rounded"
          />
          <span className="whitespace-nowrap">{points} pts</span>
        </div>
        <button
          onClick={handleNext}
          className="w-full py-2 border border-green-500 rounded-full text-green-600 hover:bg-green-50"
        >
          Acreditar puntos
        </button>
      </div>
      {toast && <Toast message={toast} type="error" />}
    </div>
  );
};

export default PointsStep2;

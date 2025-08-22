import React from 'react';
import Toast from '../components/Toast';
import { mockFetchUser, mockSearchEmails, UserProfile } from '../api/mock';

interface Props {
  onBack: () => void;
  onNext: (profile: UserProfile) => void;
}

const PointsStep1: React.FC<Props> = ({ onBack, onNext }) => {
  const [email, setEmail] = React.useState('');
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [toast, setToast] = React.useState<string | null>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value) {
      mockSearchEmails(value).then(setSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleNext = () => {
    mockFetchUser(email)
      .then(onNext)
      .catch((e) => {
        setToast(e.message);
        setTimeout(() => setToast(null), 3000);
      });
  };

  return (
    <div className="min-h-full flex items-center justify-center relative">
      <button onClick={onBack} className="absolute top-4 left-4 text-3xl text-green-600 font-bold">←</button>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-md flex flex-col gap-4 items-center text-gray-800 dark:text-gray-100">
        <div className="flex items-center text-2xl font-bold text-green-600">
          <span className="mr-2">★</span> AWER Reviews
        </div>
        <h2 className="text-center">Cargue los datos del usuario</h2>
        <div className="relative w-full">
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={handleEmailChange}
            className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
          {suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded mt-1 max-h-40 overflow-y-auto z-10">
              {suggestions.map((s) => (
                <li
                  key={s}
                  onClick={() => {
                    setEmail(s);
                    setSuggestions([]);
                  }}
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          onClick={handleNext}
          className="w-full py-2 mt-2 border border-green-500 rounded-full text-green-600 hover:bg-green-50 dark:hover:bg-gray-700"
        >
          Siguiente
        </button>
      </div>
      {toast && <Toast message={toast} type="error" />}
    </div>
  );
};

export default PointsStep1;

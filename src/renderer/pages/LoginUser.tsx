import React from 'react';
import { login } from '../api/auth';
import Spinner from '../components/Spinner';

interface Props {
  onLogin: () => void;
}

const LoginUser: React.FC<Props> = ({ onLogin }) => {
  const [user, setUser] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { token } = await login(user, password);
    localStorage.setItem('token', token);
    setLoading(false);
    onLogin();
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-8 rounded-xl shadow-md w-full max-w-md flex flex-col gap-4"
      >
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-4">Inicio de sesión Awer Loyalty</h1>
        </div>
        <input
          className="border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Usuario"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          required
        />
        <input
          className="border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white py-2 rounded-full hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Ingresando...' : 'Iniciar sesión'}
        </button>
      </form>
    </div>
  );
};

export default LoginUser;

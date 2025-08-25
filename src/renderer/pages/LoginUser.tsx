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
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const html = document.documentElement;
    setIsDark(html.classList.contains('dark'));
    const observer = new MutationObserver(() => {
      setIsDark(html.classList.contains('dark'));
    });
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { access_token, refresh_token } = await login(user, password);
    localStorage.setItem('token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    setLoading(false);
    onLogin();
  };

  const logoSrc = isDark ? "/logo-white.png" : "/logo-principal.png";

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-2 sm:px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md flex flex-col gap-6 sm:gap-7 border border-green-200 dark:border-gray-700 animate-fade-in"
      >
        {/* Logo y títulos */}
        <div className="flex flex-col items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
          <div className="flex justify-center w-full">
            <img
              src={logoSrc}
              alt="AWER Logo"
              className="w-24 sm:w-32 md:w-40 lg:w-44 h-auto object-contain drop-shadow-xl mb-2 mx-auto transition-all"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-green-600 dark:text-green-400 mb-1 text-center">
            Inicio de sesión
          </h1>
          <span className="text-lg sm:text-2xl md:text-3xl font-black tracking-wide bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-lg uppercase text-center">
            AWER LOYALTY
          </span>
        </div>
        <input
          className="border rounded-lg px-3 py-2 sm:px-4 sm:py-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition text-base sm:text-lg"
          placeholder="Usuario"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          required
        />
        <input
          className="border rounded-lg px-3 py-2 sm:px-4 sm:py-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition text-base sm:text-lg"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white py-2 sm:py-3 rounded-full font-semibold text-base sm:text-lg hover:bg-green-600 disabled:opacity-50 shadow-lg transition-all"
        >
          {loading ? 'Ingresando...' : 'Iniciar sesión'}
        </button>
      </form>
    </div>
  );
};

export default LoginUser;
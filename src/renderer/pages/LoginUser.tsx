import React from 'react';
import { login, fetchCurrentUser, fetchBranches } from '../api/auth';
import Spinner from '../components/Spinner';
import Toast from '../components/Toast';
import { useCompany } from '../context/CompanyContext';
import logoWhite from '../public/logo-white.png';
import logoPrincipal from '../public/logo-principal.png';

interface Props {
  onLogin: () => void;
}

const LoginUser: React.FC<Props> = ({ onLogin }) => {
  const [user, setUser] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);
  const [toast, setToast] = React.useState<string | null>(null);
  const { setCompanyId, setCompanyName, setCompanyLogo, setBranches } = useCompany();

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
    try {
      const { access_token, refresh_token } = await login(user, password);
      localStorage.setItem('token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      const { companyId } = await fetchCurrentUser();
      setCompanyId(companyId);
      const { companyName, companyLogo, branches } = await fetchBranches(companyId);
      setCompanyName(companyName);
      setCompanyLogo(companyLogo);
      setBranches(branches);
      onLogin();
    } catch (err) {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      if (err instanceof Error && err.message === 'INVALID_POS') {
        setToast('El punto de venta configurado no corresponde a la empresa o está suspendido');
      } else if (err instanceof Error && err.message === 'BAD_CREDENTIALS') {
        setToast('Usuario o contraseña incorrectos');
      } else {
        setToast('Ocurrió un error, prueba de nuevo');
      }
      setTimeout(() => setToast(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const logoSrc = isDark ? logoWhite : logoPrincipal;

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
        <div className="relative">
          <input
            className="border rounded-lg px-3 py-2 sm:px-4 sm:py-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition text-base sm:text-lg w-full pr-10"
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l2.04 2.04C2.64 7.04 1.6 8.8 1.24 9.47a1.73 1.73 0 0 0 0 1.06C2.51 12.94 5.9 18 12 18c2.08 0 3.87-.5 5.37-1.28l3.1 3.1a.75.75 0 1 0 1.06-1.06l-18-18Z" />
                <path d="M12 6c-1.03 0-2 .16-2.9.45l1.63 1.63A3.75 3.75 0 0 1 15.92 12l3.42 3.42c1.6-1.38 2.8-3.11 3.42-4.42a1.73 1.73 0 0 0 0-1.06C21.49 7.06 18.1 2 12 2c-2.02 0-3.8.5-5.32 1.28l1.5 1.5C9.2 6.28 10.56 6 12 6Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 5c-6.21 0-9.6 5.06-10.76 7.47a1.73 1.73 0 0 0 0 1.06C2.4 15.94 5.79 21 12 21s9.6-5.06 10.76-7.47c.2-.35.2-.71 0-1.06C21.6 10.06 18.21 5 12 5Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
              </svg>
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white py-2 sm:py-3 rounded-full font-semibold text-base sm:text-lg hover:bg-green-600 disabled:opacity-50 shadow-lg transition-all"
        >
          {loading ? 'Ingresando...' : 'Iniciar sesión'}
        </button>
      </form>
      {toast && <Toast message={toast} type="error" />}
    </div>
  );
};

export default LoginUser;

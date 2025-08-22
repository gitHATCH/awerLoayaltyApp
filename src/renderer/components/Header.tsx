import React from 'react';

interface Props {
  onChangeBrand: () => void;
  onLogout: () => void;
}

const Header: React.FC<Props> = ({ onChangeBrand, onLogout }) => {
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

  // Ajusta el tamaño según el modo
  const logoSrc = isDark ? "/logo-white.png" : "/logo-principal.png";
  const logoClass = isDark
    ? "h-14 sm:h-24 md:h-32 w-auto"
    : "h-8 sm:h-10 md:h-12 w-auto";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full px-4 sm:px-8 py-2 sm:py-3 bg-white dark:bg-gray-900 shadow-md border-b border-green-200 dark:border-gray-700">      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
      <div className="flex items-center gap-3 max-h-10">
        <img
          src={logoSrc}
          alt="AWER Logo"
          className={`${logoClass} object-contain drop-shadow-xl transition-all`}
        />
      </div>
      <div className="flex gap-2 mt-2 sm:mt-0">
        <button
          onClick={onChangeBrand}
          className="px-4 py-1 sm:px-5 sm:py-2 text-sm sm:text-base rounded-full font-semibold border border-green-500 text-green-600 dark:text-green-400 bg-white dark:bg-gray-900 hover:bg-green-100 dark:hover:bg-green-950 shadow transition-all duration-150"
        >
          Cambiar marca
        </button>
        <button
          onClick={onLogout}
          className="px-4 py-1 sm:px-5 sm:py-2 text-sm sm:text-base rounded-full font-semibold border border-red-500 text-red-600 dark:text-red-400 bg-white dark:bg-gray-900 hover:bg-red-100 dark:hover:bg-red-950 shadow transition-all duration-150"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
    </header>
  );
};

export default Header;
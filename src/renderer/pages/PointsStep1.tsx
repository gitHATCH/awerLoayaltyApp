import React from "react";
import Toast from "../components/Toast";
import Spinner from "../components/Spinner";
import { fetchUser, searchUsers, UserProfile } from "../api/points";

interface Props {
  onBack: () => void;
  onNext: (profile: UserProfile) => void;
}

const PointsStep1: React.FC<Props> = ({ onBack, onNext }) => {
  const [email, setEmail] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [toast, setToast] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [highlight, setHighlight] = React.useState<number>(-1);

  // Autocompletado con debounce
  React.useEffect(() => {
    const id = setTimeout(() => {
      if (email) {
        searchUsers(email).then(setSuggestions);
      } else {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(id);
  }, [email]);

  const handleNext = () => {
    if (!email) return;
    setLoading(true);
    fetchUser(email)
      .then(onNext)
      .catch((e) => {
        setToast(e.message);
        setTimeout(() => setToast(null), 3000);
      })
      .finally(() => setLoading(false));
  };

  const onKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const value = suggestions[highlight >= 0 ? highlight : 0];
      if (value) {
        setEmail(value);
        setSuggestions([]);
        setHighlight(-1);
        // opcional: ir directo a siguiente si querés
        // handleNext();
      }
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setHighlight(-1);
    }
  };

  if (loading)
    return (
      <div className="min-h-full flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-green-200 dark:border-gray-700 rounded-3xl shadow-2xl p-8 text-center">
          <Spinner />
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
            Buscando usuario…
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-full w-full flex items-center justify-center px-3 sm:px-6 py-6">
      {/* Card principal */}
      <div className="w-full max-w-3xl bg-white dark:bg-gray-900 border border-green-200 dark:border-gray-700 rounded-3xl shadow-2xl overflow-hidden animate-fade-in relative">
        {/* Encabezado visual + Botón volver */}
        <div className="relative">
          {/* Botón volver – flotante, centrado en Y y con hover verde en light */}
          <button
            onClick={onBack}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full
                       bg-white dark:bg-gray-800
                       border border-green-300 dark:border-green-600
                       p-2 shadow
                       hover:bg-green-200 dark:hover:bg-gray-700
                       transition"
            aria-label="Volver"
            title="Volver al inicio"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5 text-green-700 dark:text-green-300"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <div className="h-24 sm:h-28 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 dark:from-green-700 dark:via-emerald-700 dark:to-green-800 rounded-t-3xl" />
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-white dark:bg-gray-900 border border-green-200 dark:border-gray-700 shadow-xl flex items-center justify-center">
              {/* Ícono usuario */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10 text-green-600 dark:text-green-400">
                <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm-7.5 8.25A8.25 8.25 0 0 1 12 12.75a8.25 8.25 0 0 1 7.5 7.5.75.75 0 0 1-.75.75h-13.5a.75.75 0 0 1-.75-.75Z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="px-5 sm:px-8 pt-14 pb-6">
          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-gray-900 dark:text-white">
              Cargar datos del usuario
            </h1>
            <p className="mt-1 text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Ingresá el correo del cliente para continuar
            </p>
          </div>

          {/* Campo y sugerencias */}
          <div className="relative w-full">
            <input
              type="email"
              placeholder="Correo del cliente"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setHighlight(-1);
              }}
              onKeyDown={onKeyDownInput}
              className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 pr-10 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Correo del cliente"
            />
            {email && (
              <button
                type="button"
                onClick={() => {
                  setEmail("");
                  setSuggestions([]);
                  setHighlight(-1);
                }}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Limpiar"
                title="Limpiar"
              >
                ×
              </button>
            )}

            {suggestions.length > 0 && (
              <ul
                role="listbox"
                className="absolute left-0 right-0 mt-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg max-h-56 overflow-y-auto brand-scroll z-10"
              >
                {suggestions.map((s, idx) => (
                  <li key={s}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={idx === highlight}
                      onMouseEnter={() => setHighlight(idx)}
                      onClick={() => {
                        setEmail(s);
                        setSuggestions([]);
                        setHighlight(-1);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition ${idx === highlight
                        ? "bg-green-50 dark:bg-green-950/40"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Acciones */}
          <div className="mt-5 flex items-center justify-end">
            <button
              onClick={handleNext}
              disabled={!email}
              className="inline-flex items-center justify-center rounded-full px-5 py-2.5 font-semibold
                         text-white bg-green-600 hover:bg-green-700 disabled:opacity-50
                         shadow transition"
            >
              Siguiente
            </button>
          </div>

          {/* Hint */}
          <div className="mt-6 rounded-2xl border border-dashed border-green-300 dark:border-green-700 bg-green-50/60 dark:bg-green-950/40 px-4 py-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
            Tip: usá <kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800">↑</kbd>/<kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800">↓</kbd> y <kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800">Enter</kbd> para elegir una sugerencia. <span className="hidden sm:inline">(Esc para cerrar)</span>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast} type="error" />}
    </div>
  );
};

export default PointsStep1;

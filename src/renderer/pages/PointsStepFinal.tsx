import React, { useEffect } from "react";
import Toast from "../components/Toast";
import { UserProfile } from "../api/points";
import userIcon from "../assets/user-default.svg";

interface Props {
  profile: UserProfile;
  added: number;
  expires: string;
  onBack: () => void;   // "Acreditar otro" / Volver al flujo
  onClose: () => void;  // Cerrar y volver al Home
}

const levelColors: Record<string, string> = {
  BRONZE: "bg-amber-600 text-white",
  SILVER: "bg-gray-300 text-gray-800",
  GOLD: "bg-yellow-400 text-yellow-900",
  PLATINUM: "bg-gray-400 text-gray-900",
};

const PointsStepFinal: React.FC<Props> = ({ profile, added, expires, onBack, onClose }) => {
  const [toast, setToast] = React.useState<string | null>(null);

  useEffect(() => {
    setToast("¡Puntos acreditados correctamente!");
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, []);

  const medalClass = levelColors[profile.level] || "bg-gray-300 text-gray-900";

  // progreso aprox hacia el próximo nivel (como en Step2 para mantener coherencia)
  const progress =
    profile.pointsToNext && profile.pointsToNext > 0
      ? Math.min(
        100,
        Math.round((profile.points / (profile.points + profile.pointsToNext)) * 100)
      )
      : 100;

  return (
    <div className="min-h-full w-full flex items-center justify-center px-3 sm:px-6 py-4 sm:py-6">
      {/* Card principal */}
      <div className="w-full max-w-3xl bg-white dark:bg-gray-900 border border-green-200 dark:border-gray-700 rounded-3xl shadow-2xl overflow-hidden animate-fade-in relative">
        {/* Encabezado visual + Botón volver */}
        <div className="relative">
          <button
            onClick={onBack}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full
                       bg-white dark:bg-gray-800
                       border border-green-300 dark:border-green-600
                       p-2 shadow
                       hover:bg-green-50 dark:hover:bg-gray-700
                       transition"
            aria-label="Volver"
            title="Acreditar otro"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5 text-green-700 dark:text-green-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <div className="h-16 sm:h-28 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 dark:from-green-700 dark:via-emerald-700 dark:to-green-800 rounded-t-3xl" />
          {/* Check de éxito */}
          <div className="absolute -bottom-8 sm:-bottom-10 left-1/2 -translate-x-1/2">
            <div className="h-14 w-14 sm:h-24 sm:w-24 rounded-2xl bg-white dark:bg-gray-900 border border-green-200 dark:border-gray-700 shadow-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 sm:h-10 sm:w-10 text-green-600 dark:text-green-400">
                <path fillRule="evenodd" d="M10.28 15.22a.75.75 0 0 1-1.06 0l-2.47-2.47a.75.75 0 0 1 1.06-1.06l1.94 1.94 5.47-5.47a.75.75 0 0 1 1.06 1.06l-6 6Z" clipRule="evenodd" />
                <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Z" className="opacity-20" />
              </svg>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="px-4 sm:px-8 pt-12 sm:pt-14 pb-4 sm:pb-6">
          {/* Tarjeta de perfil */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-3 sm:p-6 mb-4 sm:mb-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <img
                src={profile.avatar || userIcon}
                onError={(e) => (e.currentTarget.src = userIcon)}
                alt={profile.name}
                className="w-12 h-12 sm:w-20 sm:h-20 rounded-full border-2 border-green-400 dark:border-green-600 object-cover bg-white dark:bg-gray-800 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1 sm:gap-y-2">
                  <h2 className="text-lg sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white truncate">
                    {profile.name}
                  </h2>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${medalClass}`}>
                    {profile.level}
                  </span>
                </div>
                <p className="mt-0.5 text-xs sm:text-base text-gray-600 dark:text-gray-300 truncate">
                  {profile.email}
                </p>
              </div>
            </div>

            {/* KPIs */}
            <div className="mt-3 sm:mt-5 grid grid-cols-3 gap-2 sm:gap-4 text-center">
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800/60 p-2 sm:p-3">
                <p className="text-[11px] sm:text-sm text-gray-600 dark:text-gray-300">Puntos actuales</p>
                <p className="mt-0.5 sm:mt-1 text-lg sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                  {profile.points.toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800/60 p-2 sm:p-3">
                <p className="text-[11px] sm:text-sm text-gray-600 dark:text-gray-300">Próximo nivel</p>
                <p className="mt-0.5 sm:mt-1 text-xs sm:text-xl font-bold text-gray-900 dark:text-white text-center sm:flex sm:items-center sm:justify-center sm:gap-2">
                  {profile.nextLevel}
                  <span className="block sm:inline text-[10px] sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-0">
                    ({profile.pointsToNext} pts)
                  </span>
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800/60 p-2 sm:p-3">
                <p className="text-[11px] sm:text-sm text-gray-600 dark:text-gray-300">Total canjeado</p>
                <p className="mt-0.5 sm:mt-1 text-lg sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                  {profile?.totalRedeemed?.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Progreso */}
            <div className="mt-3 sm:mt-5">
              <div className="h-1 sm:h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                  aria-label={`Progreso: ${progress}%`}
                />
              </div>
            </div>

            {/* Vencimientos (si existen) */}
            {profile.expiringPoints !== undefined && profile.expiringDate && (
              <div className="mt-2 sm:mt-3 text-center text-[11px] sm:text-sm text-red-600 dark:text-red-400">
                Próximos a vencer: <b>{profile.expiringPoints}</b> pts - {profile.expiringDate}
              </div>
            )}
          </div>

          {/* Éxito + resumen de operación */}
          <div className="flex flex-col items-center gap-2 sm:gap-4 mb-4 sm:mb-6 text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 text-sm sm:text-base">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 sm:h-5 sm:w-5">
                <path fillRule="evenodd" d="M10.28 15.22a.75.75 0 0 1-1.06 0l-2.47-2.47a.75.75 0 0 1 1.06-1.06l1.94 1.94 5.47-5.47a.75.75 0 0 1 1.06 1.06l-6 6Z" clipRule="evenodd" />
              </svg>
              Sumaste <b className="mx-1">{added.toLocaleString()} pts</b> correctamente
            </span>

            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 text-gray-700 dark:text-gray-200 text-xs sm:text-sm">
              Vencen el <b className="mx-1">{expires}</b>
            </span>
          </div>

          {/* Acciones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={onBack}
              className="h-[46px] rounded-full font-semibold border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 bg-white dark:bg-gray-900 hover:bg-green-50 dark:hover:bg-gray-800 shadow-sm transition"
              title="Acreditar otro"
            >
              Acreditar otro
            </button>
            <button
              onClick={onClose}
              className="h-[46px] rounded-full font-extrabold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg transition"
              title="Cerrar"
            >
              Cerrar
            </button>
          </div>

          {/* Hint final */}
          <div className="mt-6 rounded-2xl border border-dashed border-green-300 dark:border-green-700 bg-green-50/60 dark:bg-green-950/40 px-4 py-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300 text-center">
            Consejo: podés volver y acreditar para otro cliente, o cerrar para ir al inicio.
          </div>
        </div>
      </div>

      {toast && <Toast message={toast} />}
    </div>
  );
};

export default PointsStepFinal;

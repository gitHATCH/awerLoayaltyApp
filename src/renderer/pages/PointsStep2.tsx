import React from "react";
import Toast from "../components/Toast";
import Spinner from "../components/Spinner";
import Tooltip from "../components/Tooltip";
import { UserProfile, addPoints, fetchPointsConfig } from "../api/points";
import { usePointsConfig } from "../context/PointsConfigContext";
import userIcon from "../assets/user-default.svg";

interface Props {
  profile: UserProfile;
  onBack: () => void;
  onNext: (updated: UserProfile, added: number, expires: string) => void;
}

const levelColors: Record<string, string> = {
  BRONZE: "bg-amber-600 text-white",
  SILVER: "bg-gray-300 text-gray-800",
  GOLD: "bg-yellow-400 text-yellow-900",
  PLATINUM: "bg-gray-400 text-gray-900",
};

const PointsStep2: React.FC<Props> = ({ profile, onBack, onNext }) => {
  const { unitAmount, pointsPerUnit, setUnitAmount, setPointsPerUnit } = usePointsConfig();
  const [amount, setAmount] = React.useState("");
  const [toast, setToast] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [configLoading, setConfigLoading] = React.useState(true);

  React.useEffect(() => {
    fetchPointsConfig()
      .then(({ unitAmount, pointsPerUnit }) => {
        setUnitAmount(unitAmount);
        setPointsPerUnit(pointsPerUnit);
      })
      .catch((error: any) => {
        if (error.response?.status !== 401) {
          setToast('Ocurrió un error');
          setTimeout(() => {
            setToast(null);
            onBack();
          }, 3000);
        }
      })
      .finally(() => setConfigLoading(false));
  }, [onBack, setUnitAmount, setPointsPerUnit]);

  const valueNum = parseFloat(amount) || 0;
  const points =
    unitAmount && pointsPerUnit
      ? Math.floor((valueNum * pointsPerUnit) / unitAmount)
      : 0;
  const configInvalid = !unitAmount || !pointsPerUnit;

  const handleNext = () => {
    const value = parseFloat(amount);
    if (isNaN(value) || points <= 0) {
      setToast(`El monto es muy pequeño`);
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setLoading(true);
    addPoints(value)
      .then(({ profile: p, added, expires }) => onNext(p, added, expires))
      .finally(() => setLoading(false));
  };

  const medalClass = levelColors[profile.level] || "bg-gray-300 text-gray-900";

  // progreso hacia el próximo nivel (aprox)
  const progress =
    profile.pointsToNext && profile.pointsToNext > 0
      ? Math.min(
        100,
        Math.round((profile.points / (profile.points + profile.pointsToNext)) * 100)
      )
      : 100;

  if (loading || configLoading)
    return (
      <div className="min-h-full flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-green-200 dark:border-gray-700 rounded-3xl shadow-2xl p-8 text-center">
          <Spinner />
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">Procesando…</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-full w-full flex items-center justify-center px-3 sm:px-6 py-6">
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
            title="Volver"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5 text-green-700 dark:text-green-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <div className="h-24 sm:h-28 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 dark:from-green-700 dark:via-emerald-700 dark:to-green-800 rounded-t-3xl" />
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-white dark:bg-gray-900 border border-green-200 dark:border-gray-700 shadow-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10 text-green-600 dark:text-green-400">
                <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm-7.5 8.25A8.25 8.25 0 0 1 12 12.75a8.25 8.25 0 0 1 7.5 7.5.75.75 0 0 1-.75.75h-13.5a.75.75 0 0 1-.75-.75Z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="px-5 sm:px-8 pt-14 pb-6">
          {/* Tarjeta de perfil */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-4 sm:p-6 mb-6">
            <div className="flex items-start gap-4">
              <img
                src={profile.avatar || userIcon}
                alt={profile.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-green-400 dark:border-green-600 object-cover bg-white dark:bg-gray-800 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white truncate">
                    {profile.name}
                  </h2>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${medalClass}`}>
                    {profile.level}
                  </span>
                </div>
                <p className="mt-1 text-sm sm:text-base text-gray-600 dark:text-gray-300 truncate">
                  {profile.email}
                </p>
              </div>
            </div>

            {/* KPIs */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800/60 p-3">
                <p className="text-sm text-gray-600 dark:text-gray-300">Puntos actuales</p>
                <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                  {profile.points.toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800/60 p-3">
                <p className="text-sm text-gray-600 dark:text-gray-300">Próximo nivel</p>
                <p className="mt-1 text-base sm:text-xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                  {profile.nextLevel}
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    ({profile.pointsToNext} pts)
                  </span>
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800/60 p-3">
                <p className="text-sm text-gray-600 dark:text-gray-300">Total canjeado</p>
                <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                  {profile.totalRedeemed.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Progreso */}
            <div className="mt-5">
              <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                  aria-label={`Progreso: ${progress}%`}
                />
              </div>
            </div>

            {profile.expiring && (
              <div className="mt-3 text-center text-xs sm:text-sm text-red-600 dark:text-red-400">
                Próximos a vencer: <b>{profile.expiring.points}</b> pts el <b>{profile.expiring.date}</b>
              </div>
            )}
          </div>

          {/* Tasa y formulario */}
          <div>
            {configInvalid && (
              <div className="mb-4 flex items-start justify-between rounded-xl border border-yellow-300 bg-yellow-50 p-4 text-yellow-800 dark:border-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-200">
                <p className="text-sm">Su empresa no configuró la cantidad de puntos a otorgar por cada monto.</p>
                <Tooltip message="Para eso la empresa debe ingresar a https://gestion.awerreviews.com. Dirigirse a Fidelización en el slide de la izquierda y seleccionar Awer Loyalty. Allí al apartado Niveles y acciones y configurar allí">
                  <button
                    type="button"
                    className="ml-4 flex h-6 w-6 items-center justify-center rounded-full border border-yellow-400 text-xs font-bold text-yellow-700 dark:border-yellow-600 dark:text-yellow-200"
                  >
                    ?
                  </button>
                </Tooltip>
              </div>
            )}
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-2">
              Ganás <b>{pointsPerUnit ?? 0} punto{pointsPerUnit === 1 ? '' : 's'}</b> por cada <b>${unitAmount ?? 0}</b>
            </p>

            {/* GRID: col1 (input fila 1 + badge fila 2), col2 (botón) */}
            <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center gap-4 sm:gap-x-6">
              {/* Input (fila 1, col 1) */}
              <div className="sm:col-start-1 sm:row-start-1">
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-500 dark:text-gray-400 select-none">
                    $
                  </span>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Monto de la compra"
                    className="w-full pl-7 pr-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Botón (fila 1, col 2) — alineado con el input */}
              <button
                onClick={handleNext}
                disabled={points <= 0}
                className="sm:col-start-2 sm:row-start-1 w-full sm:w-auto px-6 sm:px-10 h-[48px] sm:h-[52px] rounded-full font-extrabold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 shadow-lg transition"
              >
                Sumar mis puntos
              </button>

              {/* Badge (fila 2, col 1) — debajo del input, no afecta alineación del botón */}
              <div className="sm:col-start-1 sm:row-start-2 min-h-[1.5rem]" aria-live="polite">
                {points > 0 && (
                  <span className="mt-1 inline-flex items-center gap-1 px-2 py-1 rounded-full border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/40 text-xs sm:text-sm text-green-700 dark:text-green-300">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                      <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm1 14-3-3h2V8h2v5h2Z" />
                    </svg>
                    {points.toLocaleString()} pts a acreditar
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-green-300 dark:border-green-700 bg-green-50/60 dark:bg-green-950/40 px-4 py-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
            Consejo: revisá el progreso y vencimientos antes de acreditar.
          </div>
        </div>
      </div>

      {toast && <Toast message={toast} type="error" />}
    </div>
  );
};

export default PointsStep2;

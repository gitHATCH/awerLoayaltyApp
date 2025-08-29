import React, { forwardRef } from 'react';

interface Props {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

const Footer = forwardRef<HTMLDivElement, Props>(({ theme, onToggle }, ref) => {
  const [version, setVersion] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    window.awer?.getVersion?.().then(v => setVersion(v)).catch(() => {});
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleConfigClick = () => {
    if (!open) setOpen(true);
    else setOpen(false);
  };

  return (
    <footer
      ref={ref}
      className="relative w-full px-4 sm:px-8 py-2 sm:py-3 bg-white dark:bg-gray-900 shadow-md border-t border-green-200 dark:border-gray-700 flex justify-center items-center flex-shrink-0"
    >
      <div className="flex items-center gap-3">
        <button
          ref={buttonRef}
          onClick={handleConfigClick}
          aria-label="Configuración"
          className="flex items-center justify-center rounded-full border border-green-500 text-green-600 dark:text-green-400 bg-white dark:bg-gray-900 hover:bg-green-100 dark:hover:bg-green-950 shadow transition-all duration-150 w-10 h-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.765.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.766.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.929-.398-.165-.854-.143-1.204.107l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.273-.806.108-1.203-.165-.397-.506-.71-.93-.781l-.894-.149c-.542-.09-.94-.56-.94-1.11v-1.094c0-.55.398-1.019.94-1.11l.894-.148c.424-.071.765-.384.93-.781.165-.397.142-.853-.108-1.203l-.527-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773c.39-.39 1.003-.44 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </button>
        {open && (
          <div
            ref={menuRef}
            className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 border border-green-200 dark:border-gray-700 rounded-xl shadow-lg p-4 flex items-center gap-3"
          >
            <label className="flex items-center gap-2 cursor-pointer text-gray-800 dark:text-white font-semibold">
              <span>Modo oscuro</span>
              <input
                type="checkbox"
                checked={theme === 'dark'}
                onChange={onToggle}
                className="w-5 h-5 accent-green-500"
              />
            </label>
          </div>
        )}
      </div>
      {version && (
        <span className="absolute right-4 text-xs text-gray-500 dark:text-gray-400 select-text">v{version}</span>
      )}
    </footer>
  );
});

export default Footer;

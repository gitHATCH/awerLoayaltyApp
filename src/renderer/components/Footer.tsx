import React from 'react';

interface Props {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

const Footer: React.FC<Props> = ({ theme, onToggle }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <footer className="relative p-4 bg-white dark:bg-gray-800 shadow-inner flex justify-center">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Configuración"
        className="text-gray-700 dark:text-gray-200"
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
        <div className="absolute bottom-12 bg-white dark:bg-gray-700 rounded shadow-md p-3">
          <label className="flex items-center gap-2 cursor-pointer text-gray-800 dark:text-white">
            <span>Modo oscuro</span>
            <input
              type="checkbox"
              checked={theme === 'dark'}
              onChange={onToggle}
              className="w-5 h-5"
            />
          </label>
        </div>
      )}
    </footer>
  );
};

export default Footer;

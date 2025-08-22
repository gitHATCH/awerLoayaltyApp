import React from 'react';

interface Props {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

const Footer: React.FC<Props> = ({ theme, onToggle }) => {
  return (
    <footer className="p-4 bg-white dark:bg-gray-800 shadow-inner flex justify-center">
      <label className="flex items-center gap-2 cursor-pointer">
        <span>Modo oscuro</span>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={onToggle}
          className="w-5 h-5"
        />
      </label>
    </footer>
  );
};

export default Footer;

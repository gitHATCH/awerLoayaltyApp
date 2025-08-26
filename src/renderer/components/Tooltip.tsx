import React from "react";

interface Props {
  message: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<Props> = ({ message, children }) => (
  <div className="relative inline-block group">
    {children}
    <div className="pointer-events-none absolute left-1/2 top-0 z-50 hidden -translate-x-1/2 -translate-y-full group-hover:flex flex-col items-center">
      <div className="mb-2 max-w-[90vw] sm:max-w-xs md:max-w-sm rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 shadow-md break-words whitespace-pre-line dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
        {message}
      </div>
      <div className="h-2 w-2 -mt-1 rotate-45 border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900" />
    </div>
  </div>
);

export default Tooltip;

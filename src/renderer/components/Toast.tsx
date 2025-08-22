import React from 'react';

interface Props {
  message: string;
  type?: 'success' | 'error';
}

const Toast: React.FC<Props> = ({ message, type = 'success' }) => {
  const bg = type === 'error' ? 'bg-red-500' : 'bg-green-500';
  return (
    <div className={`fixed bottom-4 right-4 px-4 py-2 text-white rounded shadow ${bg}`}>
      {message}
    </div>
  );
};

export default Toast;

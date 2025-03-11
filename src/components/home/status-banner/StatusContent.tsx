
import React from 'react';

type StatusContentProps = {
  message: string;
};

export const StatusContent: React.FC<StatusContentProps> = ({ message }) => {
  // Safety check to ensure message is a string
  const safeMessage = typeof message === 'string' ? message : '';
  
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">
        {safeMessage || "Aucun message à afficher"}
      </h3>
    </div>
  );
};

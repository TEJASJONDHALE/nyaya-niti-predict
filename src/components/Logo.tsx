
import React from 'react';
import { Scale } from './Icons';

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <Scale className="h-6 w-6 text-legal-primary" />
      <span className="font-bold text-xl text-legal-primary">Nyaya Niti Predict</span>
    </div>
  );
};

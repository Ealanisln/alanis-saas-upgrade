import React from 'react';

export type Feature = {
  id: number;
  icon: React.ReactNode;  // Changed from JSX.Element
  title: string;
  paragraph: string;
};
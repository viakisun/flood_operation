import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import FloodDroneMainHub from './FloodDroneMainHub/FloodDroneMainHub';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <FloodDroneMainHub />
  </React.StrictMode>
);

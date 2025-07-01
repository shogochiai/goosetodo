import React from 'react';
import ReactDOM from 'react-dom/client';
import ScheduleManager from './todo.tsx';
import './todo.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ScheduleManager />
  </React.StrictMode>
);

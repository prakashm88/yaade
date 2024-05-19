import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { createHashRouter, RouterProvider } from 'react-router-dom';

import App from './App';

/*
const router = createHashRouter([
  {
    path: '*',
    element: <App />,
  },
]);  */

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);

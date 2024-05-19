import 'allotment/dist/style.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { createHashRouter, RouterProvider } from 'react-router-dom';

import { BASE_PATH, errorToast, parseLocation, successToast } from '../../utils';
import styles from './Home.module.css';
import Dashboard from '../dashboard';
import History from '../history';
import Header from '../../components/header';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import Logs from '../logs';
import Settings from '../settings';

const router = createHashRouter([
  {
    path: '*',
    element: <Dashboard />,
  },
  {
    path: '/home',
    element: <Dashboard />,
  },
  {
    path: '/history',
    element: <History />,
  },
  {
    path: '/logs',
    element: <Logs />,
  },
  {
    path: '/settings',
    element: <Settings />,
  },
]);

function Home() {
  return (
    <>
      <header>
        <Header />
      </header>

      <RouterProvider router={router} />
    </>
  );
}

export default Home;

import 'allotment/dist/style.css';

import React from 'react';
import ReactDOM from 'react-dom';

import { BASE_PATH, errorToast, parseLocation, successToast } from '../../utils';
import styles from './Home.module.css';
import Dashboard from '../dashboard';
import Header from '../../components/header';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

function History() {
  return (
    <>
      <h1>Hisotry page here !</h1>
    </>
  );
}

export default History;

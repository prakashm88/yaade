import {
  Box,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorMode,
  useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { VscSave } from 'react-icons/vsc';

import { CurrentCollection } from '../../model/Collection';
import KVRow from '../../model/KVRow';
import { CollectionsAction, CollectionsActionType } from '../../state/collections';
import {
  CurrentCollectionAction,
  CurrentCollectionActionType,
} from '../../state/currentCollection';
import { BASE_PATH, cn, errorToast, successToast } from '../../utils';
import { getSelectedEnv } from '../../utils/store';
import { useKeyPress } from '../../utils/useKeyPress';
import Editor from '../editor';
import KVEditor from '../kvEditor';
import styles from './CollectionPanel.module.css';
import CollectionSettingsTab from './CollectionSettingsTab/CollectionSettingsTab';
import EnvironmentsTab from './EnvironmentsTab';
import OverviewTab from './OverviewTab';

interface CollectionPanelProps {
  currentCollection: CurrentCollection;
  dispatchCurrentCollection: React.Dispatch<CurrentCollectionAction>;
  dispatchCollections: React.Dispatch<CollectionsAction>;
  tabIndex: number;
  setTabIndex: (index: number) => void;
}

export default function CollectionPanel({
  currentCollection,
  dispatchCurrentCollection,
  dispatchCollections,
  tabIndex,
  setTabIndex,
}: CollectionPanelProps) {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const selectedEnv = currentCollection ? getSelectedEnv(currentCollection) : null;

  const headers =
    currentCollection.data?.headers && currentCollection.data.headers.length !== 0
      ? currentCollection.data.headers
      : [{ key: '', value: '', isEnabled: true }];

  const handleSaveCollection = async () => {
    try {
      const response = await fetch(BASE_PATH + 'api/collection', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentCollection),
      });
      if (response.status !== 200) throw new Error();

      dispatchCollections({
        type: CollectionsActionType.PATCH_COLLECTION_DATA,
        id: currentCollection.id,
        data: currentCollection.data,
      });
      dispatchCurrentCollection({
        type: CurrentCollectionActionType.SET_IS_CHANGED,
        isChanged: false,
      });
      successToast('Collection was saved.', toast);
    } catch (e) {
      errorToast('The collection could not be saved.', toast);
    }
  };

  const setName = (name: string) =>
    dispatchCurrentCollection({
      type: CurrentCollectionActionType.PATCH_DATA,
      data: { name },
    });

  const setDescription = (description: string) =>
    dispatchCurrentCollection({
      type: CurrentCollectionActionType.PATCH_DATA,
      data: { description },
    });

  const setEnvs = (envs: any) =>
    dispatchCurrentCollection({
      type: CurrentCollectionActionType.PATCH_DATA,
      data: { envs },
    });

  const setHeaders = (headers: Array<KVRow>) =>
    dispatchCurrentCollection({
      type: CurrentCollectionActionType.PATCH_DATA,
      data: { headers },
    });

  const setRequestScript = (requestScript: string) =>
    dispatchCurrentCollection({
      type: CurrentCollectionActionType.PATCH_DATA,
      data: { requestScript },
    });

  const setResponseScript = (responseScript: string) =>
    dispatchCurrentCollection({
      type: CurrentCollectionActionType.PATCH_DATA,
      data: { responseScript },
    });

  const setGroups = (groups: string[]) =>
    dispatchCurrentCollection({
      type: CurrentCollectionActionType.PATCH_DATA,
      data: { groups },
    });

  useKeyPress(handleSaveCollection, 's', true);

  return (
    <Box className={styles.box} bg="panelBg" h="100%">
      <div style={{ display: 'flex' }}>
        <input
          className={cn(styles, 'input', [colorMode])}
          type="text"
          placeholder="Name"
          value={currentCollection.data.name ?? ''}
          onChange={(e) => setName(e.target.value)}
        />
        <IconButton
          aria-label="start-rename-button"
          icon={<VscSave />}
          variant="ghost"
          size="sm"
          ml="2"
          disabled={!currentCollection.isChanged}
          onClick={handleSaveCollection}
        />
      </div>
      <Tabs
        isLazy
        index={tabIndex}
        onChange={(index) => setTabIndex(index)}
        colorScheme="green"
        mt="1"
        display="flex"
        flexDirection="column"
        maxHeight="100%"
        h="100%"
        mb="4"
      >
        <TabList>
          <Tab>Description</Tab>
          <Tab>Environments</Tab>
          <Tab>Headers</Tab>
          <Tab>Request Script</Tab>
          <Tab>Response Script</Tab>
          <Tab>Settings</Tab>
        </TabList>
        <TabPanels overflowY="auto" sx={{ scrollbarGutter: 'stable' }} h="100%">
          <TabPanel h="100%">
            <OverviewTab
              description={currentCollection.data.description ?? ''}
              setDescription={setDescription}
            />
          </TabPanel>
          <TabPanel>
            <EnvironmentsTab
              collectionId={currentCollection.id}
              envs={currentCollection.data.envs ?? {}}
              setEnvs={setEnvs}
            />
          </TabPanel>
          <TabPanel>
            <KVEditor
              name="headers"
              kvs={headers}
              setKvs={setHeaders}
              canDisableRows={true}
              hasEnvSupport={'BOTH'}
              env={selectedEnv}
            />
          </TabPanel>
          <TabPanel h="100%">
            <Editor
              content={currentCollection.data.requestScript ?? ''}
              setContent={setRequestScript}
            />
          </TabPanel>
          <TabPanel h="100%">
            <Editor
              content={currentCollection.data.responseScript ?? ''}
              setContent={setResponseScript}
            />
          </TabPanel>
          <TabPanel h="100%">
            <CollectionSettingsTab
              groups={currentCollection.data.groups ?? []}
              setGroups={setGroups}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

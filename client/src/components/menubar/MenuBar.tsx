import { HamburgerIcon, SettingsIcon, TimeIcon, UpDownIcon } from '@chakra-ui/icons';
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Heading,
  Icon,
  Link,
  SimpleGrid,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { SiWwise } from 'react-icons/si';
import styles from './MenuBar.module.css';
import { NavLink } from 'react-router-dom';
import { Link as ReactLink } from 'react-router-dom';

import { FiCode, FiHome } from 'react-icons/fi';

function MenuBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const menuList = [
    {
      icon: FiHome,
      link: '#/home',
      id: '1-home',
      text: 'Home',
    },
    {
      icon: TimeIcon,
      link: '#/history',
      id: '2-api-history',
      text: 'History',
    },
    {
      icon: UpDownIcon,
      link: '#/logs',
      id: '3-api-history',

      text: 'Logs',
    },
    {
      icon: FiCode,
      link: '#/instresults',
      id: '4-int-results',
      text: 'Intrusion results',
    },
  ];

  return (
    <>
      <VStack spacing="5" as="nav" display={{ base: 'none', md: 'flex' }}>
        <Icon
          onClick={onOpen}
          as={HamburgerIcon}
          boxSize={10}
          style={{ margin: '10px', padding: '0px 5px ', cursor: 'pointer' }}
        />
      </VStack>
      <Drawer placement={'left'} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            <HStack>
              <img className={styles.img} src="yaade-icon.png" alt="yaade icon" />
              <Heading as="h1" size="md" ml="2">
                YAADE
              </Heading>
            </HStack>
          </DrawerHeader>
          <DrawerBody>
            <VStack>
              {menuList.map((menu) => {
                return (
                  <Link
                    key={menu.id}
                    display="block"
                    href={menu.link}
                    onClick={onClose}
                    _focus={{ bg: 'green.100' }}
                    _hover={{
                      bg: 'green.200',
                      color: 'black',
                    }}
                    _activeLink={{ bg: 'orange.500', color: 'red' }}
                    w="full"
                    borderRadius="md"
                  >
                    <Flex alignItems="center" p={2}>
                      <Icon boxSize="5" as={menu.icon} />
                      <Text style={{ paddingLeft: '5px' }}>{menu.text}</Text>
                    </Flex>
                  </Link>
                );
              })}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default MenuBar;

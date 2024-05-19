import { DeleteIcon } from '@chakra-ui/icons';
import { Checkbox, IconButton, useColorMode } from '@chakra-ui/react';
import { drawSelection, EditorView } from '@codemirror/view';
import { useCodeMirror } from '@uiw/react-codemirror';
import React, { useEffect, useRef } from 'react';

import { cn } from '../../utils';
import { helpCursor, singleLine } from '../../utils/codemirror';
import { cursorTooltipBaseTheme, wordHover } from '../../utils/codemirror/envhover';
import { yaade } from '../../utils/codemirror/lang-yaade';
import {
  cmThemeDark,
  cmThemeLight,
  rawTheme,
  rawThemeDark,
} from '../../utils/codemirror/themes';
import styles from './KVEditorRow.module.css';

const kvRowRawTheme = {
  ...rawThemeDark,
  '.cm-placeholder': {
    ...rawTheme['.cm-placeholder'],
    lineHeight: '38px',
  },
  '.cm-content': {
    ...rawTheme['.cm-content'],
    minHeight: '38px',
    height: '38px',
  },
  '.cm-line': {
    ...rawTheme['.cm-line'],
    lineHeight: '2.4',
    paddingLeft: '1rem',
    paddingRight: '1rem',
  },
};

const rawLeft = {
  ...kvRowRawTheme,
  '&': {
    ...kvRowRawTheme['&'],
    width: '100%',
    minWidth: '100%',
    borderRadius: '8px 0 0 8px',
  },
};

const rawLeftDark = {
  ...rawLeft,
  '&': {
    ...rawLeft['&'],
    border: '1px solid var(--chakra-colors-gray-700)',
    borderRight: '1px solid #2D3748',
  },
};

const rawLeftLight = {
  ...rawLeft,
  '&': {
    ...rawLeft['&'],
    border: '1px solid #EDF2F7',
  },
  '.cm-activeLine': {
    backgroundColor: 'white',
  },
};

const rawRight = {
  ...kvRowRawTheme,
  '&': {
    ...kvRowRawTheme['&'],
    width: '100%',
    minWidth: '100%',
    borderRadius: '0 8px 8px 0',
  },
};

const rawRightDark = {
  ...rawRight,
  '&': {
    ...rawRight['&'],
    border: '1px solid var(--chakra-colors-gray-700)',
    borderLeft: '1px solid #2D3748',
  },
};

const rawRightLight = {
  ...rawRight,
  '&': {
    ...rawRight['&'],
    border: '1px solid #EDF2F7',
  },
  '.cm-activeLine': {
    backgroundColor: 'white',
  },
};

const kvThemeLeftLight = EditorView.theme(rawLeftLight);
const kvThemeLeftDark = EditorView.theme(rawLeftDark);
const kvThemeRightLight = EditorView.theme(rawRightLight);
const kvThemeRightDark = EditorView.theme(rawRightDark);

type KVEditorRowProps = {
  i: number;
  name: string;
  kKey: string;
  value: string;
  isEnabled?: boolean;
  canDisableRow: boolean;
  onChangeRow: React.MutableRefObject<
    (i: number, param: string, value: string | boolean) => void
  >;
  onDeleteRow: React.MutableRefObject<(i: number) => void>;
  isDeleteDisabled?: boolean;
  isEnableDisabled?: boolean;
  readOnly?: boolean;
  hasEnvSupport: 'BOTH' | 'NONE' | 'VALUE_ONLY';
  env?: any;
};

function KVEditorRow({
  i,
  name,
  kKey,
  value,
  isEnabled = true,
  canDisableRow = false,
  onChangeRow,
  onDeleteRow,
  isDeleteDisabled,
  isEnableDisabled,
  readOnly,
  hasEnvSupport,
  env,
}: KVEditorRowProps) {
  const { colorMode } = useColorMode();

  const leftref = useRef<HTMLDivElement>(null);
  const rightref = useRef<HTMLDivElement>(null);

  const extensionKeys = [singleLine];
  const extensionsValue = [singleLine];

  if (hasEnvSupport !== 'NONE') {
    const envExtensions = [];
    envExtensions.push(yaade(colorMode));
    envExtensions.push(wordHover(env?.data));
    envExtensions.push(helpCursor);
    envExtensions.push(cursorTooltipBaseTheme);
    if (hasEnvSupport === 'BOTH') {
      extensionKeys.push(...envExtensions);
      extensionsValue.push(...envExtensions);
    } else if (hasEnvSupport === 'VALUE_ONLY') {
      extensionsValue.push(...envExtensions);
    }
  }

  const { setContainer: setLeftContainer } = useCodeMirror({
    container: leftref.current,
    onChange: (key: string) => onChangeRow.current(i, 'key', key),
    extensions: [
      colorMode === 'light' ? kvThemeLeftLight : kvThemeLeftDark,
      ...extensionKeys,
      drawSelection(),
    ],
    theme: colorMode === 'light' ? cmThemeLight : cmThemeDark,
    value: kKey,
    style: { height: '100%' },
    placeholder: 'Key',
    indentWithTab: false,
    basicSetup: false,
  });
  const { setContainer: setRightContainer } = useCodeMirror({
    container: rightref.current,
    onChange: (value: string) => onChangeRow.current(i, 'value', value),
    extensions: [
      colorMode === 'light' ? kvThemeRightLight : kvThemeRightDark,
      ...extensionsValue,
      drawSelection(),
    ],
    theme: colorMode === 'light' ? cmThemeLight : cmThemeDark,
    value,
    style: { height: '100%' },
    placeholder: 'Value',
    indentWithTab: false,
    basicSetup: false,
  });

  useEffect(() => {
    if (leftref.current) {
      setLeftContainer(leftref.current);
    }
  }, [i, leftref, name, setLeftContainer]);

  useEffect(() => {
    if (rightref.current) {
      setRightContainer(rightref.current);
    }
  }, [i, name, rightref, setRightContainer]);

  return (
    <div key={`${name}-${i}`} className={styles.row}>
      {!readOnly ? (
        <>
          <div
            className={`${styles.cm} ${
              !isEnabled ? cn(styles, 'inputDisabled', [colorMode]) : ''
            }`}
            ref={leftref}
          />
          <div
            className={`${styles.cm} ${
              !isEnabled ? cn(styles, 'inputDisabled', [colorMode]) : ''
            }`}
            ref={rightref}
          />
          {canDisableRow && (
            <Checkbox
              className={cn(styles, 'checkbox', [colorMode])}
              disabled={isEnableDisabled}
              isChecked={isEnabled}
              onChange={(e) => onChangeRow.current(i, 'isEnabled', e.target.checked)}
              colorScheme="green"
            />
          )}
          <IconButton
            aria-label="delete-row"
            isRound
            variant="ghost"
            disabled={isDeleteDisabled}
            onClick={() => onDeleteRow.current(i)}
            colorScheme="red"
            icon={<DeleteIcon />}
          />
        </>
      ) : (
        <>
          <input
            className={`${styles.input} ${styles['input--left']} ${
              styles[`input--${colorMode}`]
            }`}
            placeholder="Key"
            value={kKey}
            readOnly={readOnly}
          />
          <input
            className={`${styles.input} ${styles['input--right']} ${
              styles[`input--${colorMode}`]
            }`}
            placeholder="Value"
            value={value}
            readOnly={readOnly}
          />
        </>
      )}
    </div>
  );
}

export default React.memo(KVEditorRow);

/* eslint-disable @typescript-eslint/no-unused-vars */
import { OverlayContainer } from '@react-native-aria/overlays';
import React from 'react';
import { Platform } from 'react-native';
import { Modal } from 'react-native';
import { useKeyboardDismissable } from '../../../hooks';
import { ExitAnimationContext } from './ExitAnimationContext';

interface IOverlayProps {
  isOpen?: boolean;
  children?: any;
  // We use RN modal on android if needed as it supports shifting accessiblity focus to the opened view. IOS automatically shifts focus if an absolutely placed view appears in front.
  useRNModalOnAndroid?: boolean;
  onRequestClose?: (() => any) | undefined;
  isKeyboardDismissable?: boolean;
  animationPreset?: 'fade' | 'slide' | 'none';
}

export function Overlay({
  children,
  isOpen,
  useRNModalOnAndroid = false,
  isKeyboardDismissable = true,
  //@ts-ignore
  animationPreset = 'fade',
  onRequestClose,
}: IOverlayProps) {
  const [exited, setExited] = React.useState(!isOpen);

  useKeyboardDismissable({
    enabled: isOpen && isKeyboardDismissable,
    callback: onRequestClose ? onRequestClose : () => {},
  });
  let display = exited && !isOpen ? 'none' : 'flex';
  if (animationPreset === 'slide') {
    display = 'contents';
  }

  if (Platform.OS === 'android' && useRNModalOnAndroid) {
    return (
      <ExitAnimationContext.Provider value={{ exited, setExited }}>
        <Modal
          transparent
          visible={isOpen}
          onRequestClose={onRequestClose}
          animationType={animationPreset}
        >
          {children}
        </Modal>
      </ExitAnimationContext.Provider>
    );
  }

  return (
    //@ts-ignore
    <OverlayContainer style={{ display }}>
      <ExitAnimationContext.Provider value={{ exited, setExited }}>
        {children}
      </ExitAnimationContext.Provider>
    </OverlayContainer>
  );
}

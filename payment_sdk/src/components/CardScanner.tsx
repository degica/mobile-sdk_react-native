import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useFrameProcessor,
} from 'react-native-vision-camera';
import { useTextRecognition } from 'react-native-vision-camera-text-recognition';
import { Worklets } from 'react-native-worklets-core';

// Screen and Card Dimensions
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.8; // 80% of screen width
const CARD_HEIGHT = CARD_WIDTH * (53.98 / 85.6); // Standard credit card aspect ratio

type CardScannerProps = {
  isVisible: boolean;
  onCardScanned?: (cardDetails: { cardNumber?: string; expirationDate?: string }) => void;
};

// CardScanner Component
const CardScanner = ({ isVisible, onCardScanned }: CardScannerProps) => {
  // State Hooks
  const device = useCameraDevice('back');
  const [hasPermission, setHasPermission] = useState(false);
  const [lastProcessedTimestamp, setLastProcessedTimestamp] = useState(0);

  // Text Recognition Hook
  const textRecognition = useTextRecognition({ language: 'latin' });

  // Effects
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Callbacks
  const onTextRecognized = useCallback(
    (text: string) => {
      const now = Date.now();
      if (now - lastProcessedTimestamp < 1000) {
        return;
      }
      // Updated regex to support various card formats support 19 digits
      const cardNumberRegex = /\b(?:\d[ -]*?){13,19}\b/;
      const expirationDateRegex = /(?:0[1-9]|1[0-2])\/(?:[0-9]{2})\b/; // Matches MM/YY format

      const cardNumber = text.match(cardNumberRegex)?.[0];
      const expirationDate = text.match(expirationDateRegex)?.[0];

      if (cardNumber && expirationDate && onCardScanned) {
        onCardScanned({ cardNumber, expirationDate });
      }

      setLastProcessedTimestamp(now);
    },
    [lastProcessedTimestamp],
  );

  const myFunctionJS = Worklets.createRunOnJS(onTextRecognized);

  // Frame Processor
  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      const result = textRecognition.scanText(frame);
      if (result && result.resultText) {
        myFunctionJS(result.resultText);
      }
    },
    [textRecognition, onTextRecognized],
  );

  // Render
  if (device == null) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }
  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text>No camera permission</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.cameraContainer}>
        <Camera
          style={styles.camera}
          device={device}
          isActive={isVisible}
          frameProcessor={frameProcessor}
        />
      </View>
    </>
  );
};

// Styles
const styles = StyleSheet.create({
  cameraContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default CardScanner;

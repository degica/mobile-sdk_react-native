import { Dimensions, PixelRatio, Platform } from 'react-native';

const figmaScreenWidth = 390;
const figmaScreenHeight = 844;

const { width, height } = Dimensions.get('window');
const screenWidth = Math.min(width, height);
const screenHeight = Math.max(width, height);

const scaleWidth = screenWidth / figmaScreenWidth;
const scaleHeight = screenHeight / figmaScreenHeight;

const scale = Math.min(scaleWidth, scaleHeight);

const MIN_SCALE = 0.90;

export const responsiveScale = (size: number): number => {
  const scaledSize = size * scale;
  return Math.max(scaledSize, size * MIN_SCALE);
};

export const resizeFonts = (size: number): number => {
  const fontScale = Platform.OS === 'ios' ? 1 : PixelRatio.getFontScale();
  const spFontSize = size * fontScale;
  return spFontSize;
};
export const WINDOW_WIDTH = width;
export const WINDOW_HEIGHT = height;
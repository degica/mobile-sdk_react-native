import {Dimensions, PixelRatio, Platform} from 'react-native';

export type DimensionType = 'width' | 'height';

const {width: WINDOW_WIDTH, height: WINDOW_HEIGHT} = Dimensions.get('window');

// Design resolution
const designWidth = 375;
const designHeight = 812;

// Convert dp to pixel
const dpToPixel = (dp: number, dimension: DimensionType): number => {
  const designDimension = dimension === 'width' ? designWidth : designHeight;
  return (
    (dp / designDimension) *
    (dimension === 'width' ? WINDOW_WIDTH : WINDOW_HEIGHT)
  );
};

// Convert dp to sp for font size
const fontSizeDPToSP = (size: number): number => {
  const scale = Platform.OS === 'ios' ? 1 : PixelRatio.getFontScale();
  const spFontSize = size * scale;
  return spFontSize;
};

export {dpToPixel, fontSizeDPToSP, WINDOW_WIDTH, WINDOW_HEIGHT};

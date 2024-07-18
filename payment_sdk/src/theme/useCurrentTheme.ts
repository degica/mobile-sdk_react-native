import { useColorScheme } from 'react-native';

import { useTheme } from '@context/ThemeContext';

import { appTheme } from '@theme/defaultColorTheme';

export const useCurrentTheme = () => {
    const { mode } = useTheme();
    const systemColorScheme = useColorScheme();
    const effectiveMode = systemColorScheme || mode;
    return appTheme[effectiveMode];
};
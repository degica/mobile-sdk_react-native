import { KomojuProviderIprops } from '../util/types';

import '../assets/languages/i18n';
import { MainStateProvider } from './MainStateProvider';
import StateProvider from './StateProvider';
import { ThemeProvider } from './ThemeContext';

export const KomojuProvider = (props: KomojuProviderIprops) => {
  return (
    <StateProvider>
      <ThemeProvider>
        <MainStateProvider
          publicKey={props.publicKey}
          payment_methods={props?.payment_methods}
          language={props?.language}
          useBottomSheet={props?.useBottomSheet}
        >
          {props.children}
        </MainStateProvider>
      </ThemeProvider>
    </StateProvider>
  );
};
import { RefObject, useContext } from "react";

import { StateContext } from "../context/state";

import { SheetRefProps } from "../components/Sheet";

type Props = {
  toggleUIVisibility: (value: boolean) => void;
  sheetRef: RefObject<SheetRefProps>;
};

const usePaymentSheetToggle = ({ toggleUIVisibility, sheetRef }: Props) => {
  const { providerPropsData } = useContext(StateContext);

  const openPaymentSheet = () => {
    if (providerPropsData?.useBottomSheet) {
      sheetRef?.current?.open();
    } else {
      toggleUIVisibility(true);
    }
  };

  const closePaymentSheet = () => {
    // TODO: Fix this type error
    // @ts-expect-error - Object is possibly 'null'.
    sheetRef?.current?.close(false);
    toggleUIVisibility(false);
  };

  return {
    openPaymentSheet,
    closePaymentSheet,
  };
};

export default usePaymentSheetToggle;

import { Dispatch, SetStateAction } from "react";

import { TouchableOpacity, Modal, View, Image, StyleSheet } from "react-native";

import { PaymentMode, sessionDataType, ThemeSchemeType } from "../util/types";

import closeIcon from "../assets/images/close.png";

import { resizeFonts, responsiveScale, WINDOW_HEIGHT } from "../theme/scalling";
import { useCurrentTheme } from "../theme/useCurrentTheme";

import KomojuText from "./KomojuText";
import ResponseScreen from "./ResponseScreen";
import SheetContent from "./SheetContent";
import { usePaymentUiUtils } from "../hooks/usePaymentUiUtils";

type PaymentModalProps = {
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  onDismiss?: () => void;
};

const PaymentModal: React.FC<PaymentModalProps> = ({
  modalVisible,
  setModalVisible,
  onDismiss,
}) => {
  const {
    paymentState,
    paymentType,
    sessionData,
    closeSheet,
    getCtaText,
    ctaOnPress,
    shouldShowAlert,
  } = usePaymentUiUtils(onDismiss);

  const theme = useCurrentTheme();
  const styles = getStyles(theme);

  const SessionData = sessionData as sessionDataType;
  const isCustomerMode = SessionData?.mode === PaymentMode.Customer;

  const handleClose = () => {
    closeSheet(shouldShowAlert(), () => setModalVisible(false));
  };

  return (
    <Modal
      animationType="slide"
      presentationStyle="overFullScreen"
      visible={modalVisible}
      onRequestClose={handleClose}
    >
      <TouchableOpacity onPress={handleClose} style={styles.container} />

      <View style={styles.bottomSheetContainer}>
        <View style={styles.line}>
          <KomojuText style={styles.headerLabel}>
            {!paymentState || isCustomerMode ? "PAYMENT_OPTIONS" : ""}
          </KomojuText>
          <TouchableOpacity style={styles.crossBtn} onPress={handleClose}>
            <Image source={closeIcon} />
          </TouchableOpacity>
        </View>
        {paymentState && !isCustomerMode ? (
          <ResponseScreen
            status={paymentState}
            onPress={() => ctaOnPress(() => setModalVisible(false))}
            onPressLabel={getCtaText()}
            paymentType={paymentType}
          />
        ) : (
          <SheetContent />
        )}
      </View>
    </Modal>
  );
};

const getStyles = (theme: ThemeSchemeType) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.WHITE50,
    },
    bottomSheetContainer: {
      height: WINDOW_HEIGHT - 85,
      width: "100%",
      backgroundColor: theme.BACKGROUND_COLOR,
    },
    line: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: responsiveScale(20),
      marginHorizontal: responsiveScale(16),
    },
    headerLabel: {
      fontSize: resizeFonts(18),
      fontWeight: "bold",
      flex: 1,
      alignItems: "center",
      textAlign: "center",
      color: theme.TEXT_COLOR,
    },
    crossBtn: {
      position: "absolute",
      right: 0,
      padding: responsiveScale(10),
      fontSize: resizeFonts(16),
    },
  });
};

export default PaymentModal;

import React, {
  useCallback,
  useImperativeHandle,
  useRef,
  useEffect,
  ForwardRefRenderFunction,
} from "react";

import {
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated as RNAnimated,
  PanResponder,
  Keyboard,
} from "react-native";

import { useTranslation } from "react-i18next";

import { ThemeSchemeType } from "../util/types";

import closeIcon from "../assets/images/close.png";

import { resizeFonts, responsiveScale, WINDOW_HEIGHT } from "../theme/scalling";
import { useCurrentTheme } from "../theme/useCurrentTheme";

import KomojuText from "./KomojuText";
import ResponseScreen from "./ResponseScreen";
import SheetContent from "./SheetContent";
import { usePaymentUiUtils } from "../hooks/usePaymentUiUtils";

const MAX_TRANSLATE_Y = -WINDOW_HEIGHT + responsiveScale(50);

type SheetProps = {
  children?: React.ReactNode;
  swipeClose?: boolean;
  onDismiss?: () => void;
};

export type SheetRefProps = {
  open: () => void;
  scrollTo: (destination: number) => void;
  isActive: () => boolean;
};

const Sheet: ForwardRefRenderFunction<SheetRefProps, SheetProps> = (
  { swipeClose, onDismiss },
  ref
) => {
  const { t } = useTranslation();

  const translateY = useRef(new RNAnimated.Value(0)).current;
  const active = useRef(new RNAnimated.Value(0)).current;
  const context = useRef(new RNAnimated.Value(0)).current;

  const activeState = useRef(false);
  const translateYState = useRef(0);
  const contextState = useRef(0);

  const {
    paymentState,
    paymentType,
    closeSheet,
    getCtaText,
    ctaOnPress,
    shouldShowAlert,
  } = usePaymentUiUtils(onDismiss);

  const theme = useCurrentTheme();
  const styles = getStyles(theme);

  useEffect(() => {
    const yListener = translateY.addListener(({ value }) => {
      translateYState.current = value;
    });
    const activeListener = active.addListener(({ value }) => {
      activeState.current = value === 1;
    });
    const contextID = context.addListener(({ value }) => {
      contextState.current = value;
    });
    return () => {
      translateY.removeListener(yListener);
      active.removeListener(activeListener);
      context.removeListener(contextID);
    };
  }, []);

  const scrollTo = useCallback((destination: number) => {
    active.setValue(destination !== 0 ? 1 : 0);
    RNAnimated.spring(translateY, {
      toValue: destination,
      friction: 10,
      tension: 10,
      useNativeDriver: true,
    }).start();
  }, []);

  const isActive = useCallback(() => {
    return activeState.current;
  }, []);

  const handleClose = useCallback((forceClose = false) => {
    closeSheet(shouldShowAlert() && !forceClose, () => scrollTo(0));
  }, [closeSheet, shouldShowAlert, scrollTo]);

  useImperativeHandle(
    ref,
    () => ({
      open: () => {
        Keyboard.dismiss();
        scrollTo(MAX_TRANSLATE_Y + 50);
      },
      close: handleClose,
      scrollTo,
      isActive,
    }),
    [scrollTo, isActive, handleClose]
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        context.setValue(translateYState.current);
      },
      onPanResponderMove: (_event, gestureState) => {
        const totalYMovement = gestureState.dy + contextState.current;
        translateY.setValue(Math.max(totalYMovement, MAX_TRANSLATE_Y + 50));
      },
      onPanResponderRelease: () => {
        if (translateYState.current > -WINDOW_HEIGHT / 1.5) {
          handleClose(false);
        } else if (translateYState.current < -WINDOW_HEIGHT / 1.5) {
          scrollTo(MAX_TRANSLATE_Y + 50);
        }
      },
    })
  ).current;

  return (
    <>
      <RNAnimated.View
        onTouchStart={() => {
          if (swipeClose) handleClose(true);
        }}
        pointerEvents="none"
        style={[styles.backDrop, { opacity: active }]}
      />
      <RNAnimated.View
        style={[
          styles.bottomSheetContainer,
          { transform: [{ translateY: translateY }] },
        ]}
      >
        <RNAnimated.View style={styles.line} {...panResponder.panHandlers}>
          <KomojuText style={styles.headerLabel}>
            {!paymentState ? t("PAYMENT_OPTIONS") : ""}
          </KomojuText>
          <TouchableOpacity
            style={styles.crossBtn}
            onPress={() => handleClose()}
          >
            <Image source={closeIcon} />
          </TouchableOpacity>
        </RNAnimated.View>
        {paymentState ? (
          <ResponseScreen
            status={paymentState}
            onPress={() => ctaOnPress(() => scrollTo(0))}
            onPressLabel={getCtaText()}
            paymentType={paymentType}
          />
        ) : (
          <SheetContent />
        )}
      </RNAnimated.View>
    </>
  );
};

const getStyles = (theme: ThemeSchemeType) => {
  return StyleSheet.create({
    backDrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.WHITE50,
    },
    bottomSheetContainer: {
      height: WINDOW_HEIGHT - 85,
      width: "100%",
      backgroundColor: theme.BACKGROUND_COLOR,
      position: "absolute",
      top: WINDOW_HEIGHT,
      borderRadius: 0,
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
    contentContainer: {
      flex: 1,
    },
  });
};

export default React.forwardRef<SheetRefProps, SheetProps>(Sheet);

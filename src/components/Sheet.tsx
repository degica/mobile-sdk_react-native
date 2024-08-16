import React, {
  useCallback,
  useImperativeHandle,
  useContext,
  useRef,
  useEffect,
  ForwardRefRenderFunction,
} from "react";

import {
  Alert,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated as RNAnimated,
  PanResponder,
  Keyboard,
} from "react-native";

import { useTranslation } from "react-i18next";

import { Actions, DispatchContext, StateContext } from "../context/state";
import { useTheme } from "../context/ThemeContext";

import {
  paymentFailedCtaText,
  paymentSuccessCtaText,
  ThemeModes,
} from "../util/constants";
import { ResponseScreenStatuses, ThemeSchemeType } from "../util/types";

import closeIcon from "../assets/images/close.png";
import closeDMIcon from "../assets/images/close_dm.png";

import { resizeFonts, responsiveScale, WINDOW_HEIGHT } from "../theme/scalling";
import { useCurrentTheme } from "../theme/useCurrentTheme";

import KomojuText from "./KomojuText";
import ResponseScreen from "./ResponseScreen";
import SheetContent from "./SheetContent";

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

  const { paymentState } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const theme = useCurrentTheme();
  const styles = getStyles(theme);
  const { mode } = useTheme();

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

  const closeSheet = (showAlert = true) => {
    Keyboard.dismiss();

    if (showAlert) {
      // showing an alert when user try to close the SDK modal
      Alert.alert(`${t("CANCEL_PAYMENT")}?`, "", [
        {
          text: t("NO"),
          onPress: () => scrollTo(MAX_TRANSLATE_Y + 50),
          style: "cancel",
        },
        {
          text: t("YES"),
          onPress: () => {
            // invoking client provided onDismiss() callback when closing the SDK modal
            onDismiss && onDismiss();
            scrollTo(0);
          },
        },
      ]);
    } else {
      // invoking client provided callback when closing the SDK modal
      onDismiss && onDismiss();
      scrollTo(0);
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      open: () => {
        Keyboard.dismiss();
        scrollTo(MAX_TRANSLATE_Y + 50);
      },
      close: closeSheet,
      scrollTo,
      isActive,
    }),
    [scrollTo, isActive]
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
          closeSheet(false);
        } else if (translateYState.current < -WINDOW_HEIGHT / 1.5) {
          scrollTo(MAX_TRANSLATE_Y + 50);
        }
      },
    })
  ).current;

  const getCtaText = () => {
    switch (paymentState) {
      case ResponseScreenStatuses.SUCCESS:
        return paymentSuccessCtaText;
      case ResponseScreenStatuses.FAILED:
        return paymentFailedCtaText;
      default:
        return "";
    }
  };

  const ctaOnPress = () => {
    switch (paymentState) {
      case ResponseScreenStatuses.SUCCESS:
        return closeSheet(false);
      case ResponseScreenStatuses.FAILED:
        return dispatch({
          type: Actions.SET_PAYMENT_STATE,
          payload: "",
        });
      default:
        return "";
    }
  };

  return (
    <>
      <RNAnimated.View
        onTouchStart={() => {
          if (swipeClose) closeSheet(false);
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
          <KomojuText style={styles.headerLabel}>PAYMENT_OPTIONS</KomojuText>
          <TouchableOpacity
            style={styles.crossBtn}
            onPress={() =>
              closeSheet(
                !(
                  paymentState === ResponseScreenStatuses.SUCCESS ||
                  // TODO: Fix this type error
                  // @ts-expect-error - Property 'COMPLETE' does not exist on type 'ResponseScreenStatuses'.
                  paymentState === ResponseScreenStatuses.COMPLETE
                )
              )
            }
          >
            <Image
              source={mode === ThemeModes.light ? closeIcon : closeDMIcon}
            />
          </TouchableOpacity>
        </RNAnimated.View>
        {
          // TODO: Fix this type error
          // @ts-expect-error - Property 'COMPLETE' does not exist on type 'ResponseScreenStatuses'.
          paymentState && paymentState !== ResponseScreenStatuses.COMPLETE ? (
            <ResponseScreen
              status={paymentState}
              onPress={ctaOnPress}
              onPressLabel={getCtaText()}
            />
          ) : (
            <SheetContent />
          )
        }
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

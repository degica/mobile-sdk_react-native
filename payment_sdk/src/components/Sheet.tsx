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

import { Actions, DispatchContext, StateContext } from "@context/state";

import { paymentFailedCtaText, paymentSuccessCtaText } from "@util/constants";
import { SCREEN_HEIGHT } from "@util/helpers";
import { ResponseScreenStatuses } from "@util/types";

import closeIcon from "@assets/images/close.png";

import KomojuText from "./KomojuText";
import ResponseScreen from "./ResponseScreen";
import SheetContent from "./SheetContent";

const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;

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
  const translateY = useRef(new RNAnimated.Value(0)).current;
  const active = useRef(new RNAnimated.Value(0)).current;
  const context = useRef(new RNAnimated.Value(0)).current;

  const activeState = useRef(false);
  const translateYState = useRef(0);
  const contextState = useRef(0);

  const { paymentState } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

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
      Alert.alert("Cancel Payment?", "", [
        {
          text: "No",
          onPress: () => scrollTo(MAX_TRANSLATE_Y + 50),
          style: "cancel",
        },
        {
          text: "Yes",
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
      onPanResponderMove: (event, gestureState) => {
        const totalYMovement = gestureState.dy + contextState.current;
        translateY.setValue(Math.max(totalYMovement, MAX_TRANSLATE_Y + 50));
      },
      onPanResponderRelease: () => {
        if (translateYState.current > -SCREEN_HEIGHT / 1.5) {
          closeSheet(false);
        } else if (translateYState.current < -SCREEN_HEIGHT / 1.5) {
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
                  paymentState === ResponseScreenStatuses.COMPLETE
                )
              )
            }
          >
            <Image source={closeIcon} />
          </TouchableOpacity>
        </RNAnimated.View>
        {paymentState && paymentState !== ResponseScreenStatuses.COMPLETE ? (
          <ResponseScreen
            status={paymentState}
            onPress={ctaOnPress}
            onPressLabel={getCtaText()}
          />
        ) : (
          <SheetContent />
        )}
      </RNAnimated.View>
    </>
  );
};

const styles = StyleSheet.create({
  backDrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  bottomSheetContainer: {
    height: SCREEN_HEIGHT - 85,
    width: "100%",
    backgroundColor: "white",
    position: "absolute",
    top: SCREEN_HEIGHT,
    borderRadius: 0,
  },
  line: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    marginHorizontal: 16,
  },
  headerLabel: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    alignItems: "center",
    textAlign: "center",
    color: "#172E44",
  },
  crossBtn: {
    position: "absolute",
    right: 0,
    padding: 10,
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
  },
});

export default React.forwardRef<SheetRefProps, SheetProps>(Sheet);

import React, {
  useCallback,
  useImperativeHandle,
  ForwardRefRenderFunction,
  useContext,
} from "react";
import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import ResponseScreen from "./ResponseScreen";
import { Actions, DispatchContext, StateContext } from "../state";
import SheetContent from "./SheetContent";
import { paymentFailedCtaText, paymentSuccessCtaText } from "../util/constants";
import { ResponseScreenStatuses } from "../util/types";

const closeIcon = require("../assets/images/close.png");

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

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
  const { paymentState } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const translateY = useSharedValue(0);
  const active = useSharedValue(false);

  const scrollTo = useCallback((destination: number) => {
    "worklet";
    active.value = destination !== 0;

    translateY.value = withSpring(destination, { damping: 50 });
  }, []);

  const isActive = useCallback(() => {
    return active.value;
  }, []);

  const closeSheet = (showAlert = true) => {
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
        scrollTo(MAX_TRANSLATE_Y + 50);
      },
      close: closeSheet,
      scrollTo,
      isActive,
    }),
    [scrollTo, isActive]
  );

  const context = useSharedValue({ y: 0 });
  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + context.value.y;
      translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y + 50);
    })
    .onEnd(() => {
      if (translateY.value > -SCREEN_HEIGHT / 1) {
        runOnJS(closeSheet)(paymentState !== ResponseScreenStatuses.SUCCESS);
      } else if (translateY.value < -SCREEN_HEIGHT / 1.5) {
        scrollTo(MAX_TRANSLATE_Y);
      }
    });

  const rSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const rBackdropStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(active.value ? 1 : 0),
    };
  }, []);

  const rBackdropProps = useAnimatedProps(() => {
    return {
      pointerEvents: active.value ? "auto" : "none",
    } as any;
  }, []);

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
      <Animated.View
        onTouchStart={() => {
          swipeClose ? closeSheet(false) : null;
        }}
        animatedProps={rBackdropProps}
        style={[styles.backDrop, rBackdropStyle]}
      />
      <Animated.View style={[styles.bottomSheetContainer, rSheetStyle]}>
        <GestureDetector gesture={gesture}>
          <Animated.View>
            <View style={styles.line}>
              {!paymentState ? (
                <Text style={styles.headerLabel}>Payment Options</Text>
              ) : null}
              <TouchableOpacity
                style={styles.crossBtn}
                onPress={() =>
                  closeSheet(paymentState !== ResponseScreenStatuses.SUCCESS)
                }
              >
                <Image source={closeIcon} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </GestureDetector>
        {paymentState ? (
          <ResponseScreen
            status={paymentState}
            onPress={ctaOnPress}
            onPressLabel={getCtaText()}
          />
        ) : (
          <SheetContent />
        )}
      </Animated.View>
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

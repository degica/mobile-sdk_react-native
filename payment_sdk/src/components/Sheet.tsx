import React, {
  useCallback,
  useImperativeHandle,
  ForwardRefRenderFunction,
  useContext,
} from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { Actions, DispatchContext } from "../state";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;

type SheetProps = {
  children?: React.ReactNode;
  swipeClose?: boolean;
};

export type SheetRefProps = {
  open: () => void;
  scrollTo: (destination: number) => void;
  isActive: () => boolean;
};

const Sheet: ForwardRefRenderFunction<SheetRefProps, SheetProps> = (
  { children, swipeClose },
  ref
) => {
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

  useImperativeHandle(
    ref,
    () => ({
      open: () => {
        scrollTo(MAX_TRANSLATE_Y + 50);

        //TODO find a better way to handle bellow reset
        dispatch({
          type: Actions.SET_WEBVIEW_LINK,
          payload: "",
        });
      },
      close: () => {
        scrollTo(0);
      },
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
        scrollTo(0);
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

  return (
    <>
      <Animated.View
        onTouchStart={() => {
          swipeClose ? scrollTo(0) : null;
        }}
        animatedProps={rBackdropProps}
        style={[styles.backDrop, rBackdropStyle]}
      />
      <Animated.View style={[styles.bottomSheetContainer, rSheetStyle]}>
        <GestureDetector gesture={gesture}>
          <Animated.View>
            <View style={styles.line}>
              <Text style={styles.headerLabel}>Payment Options</Text>
              <TouchableOpacity
                style={styles.crossBtn}
                onPress={() => scrollTo(0)}>
                <Image source={require('../assets/images/close.png')} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </GestureDetector>
        {children}
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
  }
});

export default React.forwardRef<SheetRefProps, SheetProps>(Sheet);

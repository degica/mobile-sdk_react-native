import React, {
  useCallback,
  useImperativeHandle,
  forwardRef,
  useContext,
  useRef,
  useEffect,
  ForwardRefRenderFunction,
} from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated as RNAnimated,
  PanResponder,
} from "react-native";
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

  const translateY = useRef(new RNAnimated.Value(0)).current;
  const active = useRef(new RNAnimated.Value(0)).current;
  const context = useRef(new RNAnimated.Value(0)).current;

  const activeState = useRef(false);
  const translateYState = useRef(0);
  const contextState = useRef(0);

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

  useImperativeHandle(
    ref,
    () => ({
      open: () => {
        scrollTo(MAX_TRANSLATE_Y + 50);
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
        if (translateYState.current > -SCREEN_HEIGHT / 2) {
          // scrollTo(0);
        } else if (translateYState.current < -SCREEN_HEIGHT / 1.5) {
          // scrollTo(MAX_TRANSLATE_Y);
        }
      },
    })
  ).current;

  return (
    <>
      <RNAnimated.View
        onTouchStart={() => {
          if (swipeClose) scrollTo(0);
        }}
        pointerEvents="none"
        style={[styles.backDrop, { opacity: active }]}
      />
      <RNAnimated.View
        style={[
          styles.bottomSheetContainer,
          { transform: [{ translateY: translateY }] },
        ]}
        {...panResponder.panHandlers}
      >
        <View>
          <View style={styles.line}>
            <Text style={styles.headerLabel}>Payment Options</Text>
            <TouchableOpacity
              style={styles.crossBtn}
              onPress={() => scrollTo(0)}
            >
              <Image source={require("../assets/images/close.png")} />
            </TouchableOpacity>
          </View>
        </View>
        {children}
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

export default forwardRef<SheetRefProps, SheetProps>(Sheet);

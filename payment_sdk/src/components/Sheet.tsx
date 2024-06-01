/* eslint-disable react-native/no-inline-styles */
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  ForwardRefRenderFunction,
} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;

type SheetProps = {
  children?: React.ReactNode;
  swipeClose?: boolean;
};

export type SheetRefProps = {
  open: (params: {sessionId: string; amount: number; currency: string}) => void;
  scrollTo: (destination: number) => void;
  isActive: () => boolean;
};

const Sheet: ForwardRefRenderFunction<SheetRefProps, SheetProps> = (
  {children, swipeClose},
  ref,
) => {
  const translateY = useSharedValue(0);
  const active = useSharedValue(false);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [currency, setCurrency] = useState<string | null>(null);

  const scrollTo = useCallback((destination: number) => {
    'worklet';
    active.value = destination !== 0;

    translateY.value = withSpring(destination, {damping: 50});
  }, []);

  const isActive = useCallback(() => {
    return active.value;
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      open: ({sessionId, amount, currency}) => {
        setSessionId(sessionId);
        setAmount(amount);
        setCurrency(currency);
        scrollTo(MAX_TRANSLATE_Y);
      },
      scrollTo,
      isActive,
    }),
    [scrollTo, isActive],
  );

  const context = useSharedValue({y: 0});
  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = {y: translateY.value};
    })
    .onUpdate(event => {
      translateY.value = event.translationY + context.value.y;
      translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
    })
    .onEnd(() => {
      if (translateY.value > -SCREEN_HEIGHT / 1) {
        scrollTo(0);
      } else if (translateY.value < -SCREEN_HEIGHT / 1.5) {
        scrollTo(MAX_TRANSLATE_Y);
      }
    });

  const rSheetStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      translateY.value,
      [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
      [25, 5],
      Extrapolation.CLAMP,
    );

    return {
      borderRadius,
      transform: [{translateY: translateY.value}],
    };
  });

  const rBackdropStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(active.value ? 1 : 0),
    };
  }, []);

  const rBackdropProps = useAnimatedProps(() => {
    return {
      pointerEvents: active.value ? 'auto' : 'none',
    } as any;
  }, []);

  return (
    <>
      <Animated.View
        onTouchStart={() => {
          // Dismiss the Sheet
          swipeClose ? scrollTo(0) : null;
        }}
        animatedProps={rBackdropProps}
        style={[
          {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.6)',
          },
          rBackdropStyle,
        ]}
      />
      <Animated.View style={[styles.bottomSheetContainer, rSheetStyle]}>
        <GestureDetector gesture={gesture}>
          <Animated.View>
            <View style={styles.line}>
              <Text style={styles.headerLabel}>Payment Options</Text>
              <Text style={styles.crossBtn} onPress={() => scrollTo(0)}>
                ✖️
              </Text>
            </View>
          </Animated.View>
        </GestureDetector>
        <View>{children}</View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    top: SCREEN_HEIGHT,
    borderRadius: 25,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 16,
  },
  headerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  crossBtn: {
    padding: 10,
    fontSize: 16,
  },
});

export default React.forwardRef<SheetRefProps, SheetProps>(Sheet);

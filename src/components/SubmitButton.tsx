import { useContext, useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Image, StyleSheet } from "react-native";

import { ResponseScreenStatuses } from "../util/types";
import { StateContext } from "../context/state";
import { useCurrentTheme } from "../theme/useCurrentTheme";
import Button from "./Button";
import { responsiveScale } from "../theme/scalling";

import Lock from "../assets/images/lock_image.png";
import SuccessAnimation from "../assets/images/success_animation.gif";
import LoadingAnimation from "../assets/images/loader_animation.gif";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type Props = {
  onPress: () => void;
  label: string;
  labelSuffix?: string;
  testID?: string;
};

const SubmitButton = ({ label, labelSuffix, onPress, testID }: Props) => {
  const theme = useCurrentTheme();
  const { loading, paymentState } = useContext(StateContext);
  const [animationComplete, setAnimationComplete] = useState(false);

  const moveAnim = useRef(new Animated.Value(responsiveScale(20))).current;

  const styles = getStyles();

  const isPaymentSuccess = paymentState === ResponseScreenStatuses.SUCCESS;

  useEffect(() => {
    if (paymentState === ResponseScreenStatuses.SUCCESS) {
      moveToCenter();
    }
  }, [paymentState]);

  const moveToCenter = () => {
    Animated.timing(moveAnim, {
      toValue: (SCREEN_WIDTH - responsiveScale(40)) * 0.5,
      duration: 400,
      useNativeDriver: false,
    }).start(() => setAnimationComplete(true));
  };

  return (
    <Button
      testID={testID}
      onPress={onPress}
      style={isPaymentSuccess ? { backgroundColor: theme.SUCCESS_COLOR } : {}}
      disabled={loading?.payment}
      label={
        !isPaymentSuccess ? (loading?.payment ? "LOADING_TEXT" : label) : ""
      }
      labelSuffix={!loading?.payment ? labelSuffix : ""}
    >
      {loading?.payment || isPaymentSuccess ? (
        <Animated.View
          style={[
            styles.indicatorContainer,
            {
              right: moveAnim,
            },
          ]}
        >
          <Image
            source={animationComplete ? SuccessAnimation : LoadingAnimation}
            style={styles.iconAnimation}
          />
        </Animated.View>
      ) : (
        <Image source={Lock} style={styles.iconLock} />
      )}
    </Button>
  );
};

const getStyles = () => {
  return StyleSheet.create({
    indicatorContainer: {
      position: "absolute",
    },
    iconLock: {
      position: "absolute",
      right: responsiveScale(20),
      width: responsiveScale(15),
      height: responsiveScale(15),
      resizeMode: "contain",
    },
    iconAnimation: {
      width: responsiveScale(30),
      height: responsiveScale(30),
      resizeMode: "contain",
    },
  });
};

export default SubmitButton;

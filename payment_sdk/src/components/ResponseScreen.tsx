import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import SubmitButton from './SubmitButton';

type Props = {
  status: 'success' | 'failed';
  message?: string;
  onPressLabel: string;
  onPress: () => void;
};

const ResponseScreen = ({status, message, onPress, onPressLabel}: Props) => {
  const renderMessageContent = useMemo(() => {
    const title = status === 'success' ? 'Payment Success' : 'Payment Failed';
    const defaultMessage =
      status === 'success'
        ? 'Thank you for your order'
        : 'Hey there, We tried to charge your card but, something went wrong. Please update your payment method below to continue';
    const msg = message || defaultMessage;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{msg}</Text>
      </View>
    );
  }, [status, message]);

  const renderIcon = useMemo(() => {
    const source =
      status === 'success'
        ? require('../assets/images/success.png')
        : require('../assets/images/error.png');
    return <Image source={source} style={styles.icon} />;
  }, [status]);

  const memoizedOnPress = useCallback(onPress, [onPress]);

  return (
    <View style={styles.parentContainer}>
      <View style={styles.imageContainer}>{renderIcon}</View>
      {renderMessageContent}
      <View style={styles.bottomButton}>
        <SubmitButton onPress={memoizedOnPress} label={onPressLabel} />
      </View>
    </View>
  );
};

export default ResponseScreen;

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
  },
  container: {
    padding: 16,
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 18,
  },
  icon: {
    width: 48,
    height: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#172E44',
  },
  message: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  bottomButton: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
  },
});

import { Animated } from 'react-native';

const animateImage = (fadeAnim, translateAnim) => {
  Animated.parallel([
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }),
    Animated.timing(translateAnim, {
      toValue: -40,
      duration: 600,
      useNativeDriver: true,
    })]).start();
};

export {
    animateImage,
}
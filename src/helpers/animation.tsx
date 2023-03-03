import { Animated } from 'react-native';

const animateImage = (fadeAnim, translateAnim) => {
  Animated.parallel([
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 750,
      useNativeDriver: true,
    }),
    // Animated.spring(translateAnim, {
    //   toValue: -40,
    //   friction: 1,
    //   tension: 20,
    //   damping: 2,
    //   useNativeDriver: true,
    Animated.timing(translateAnim, {
      toValue: -30,
      duration: 600,
      useNativeDriver: true,
    })]).start();
};

export {
    animateImage,
}
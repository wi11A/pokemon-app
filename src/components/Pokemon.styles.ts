import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    imageContainer: {
      flex: 4,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'flex-end'
    },
    statsContainer: {
      backgroundColor: '#fff',
      width: '100%',
      height: '100%',
      flex: 5,
      alignItems: 'center',
      justifyContent: 'flex-start',
      borderTopLeftRadius : 40,
      borderTopRightRadius : 40,
    },
    image: {
      width: 200,
      height: 200,
      justifyContent: 'center'
    },
    title: {
      fontSize: 32,
      marginVertical: 20
    },
    text: {
      marginVertical: 5
    }
  });
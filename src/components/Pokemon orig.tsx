import { StyleSheet, Text, View, Image, Animated, PanResponder } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { MaterialCommunityIcons, MaterialIcons, AntDesign} from '@expo/vector-icons';

import typeColours from '../../assets/typeColours.json'

function unpackAbilities(abilities) {
  // Pull abilities from nested object and get into printable format
    let str = ''
    if (abilities !== undefined) {
      for (const item of abilities){
          str += item.ability.name[0].toUpperCase()
              +  item.ability.name.slice(1)
              +  ', '
      }
      
    }
    return str.slice(0, -2)
}

function unpackTypes(types) {
  // get types from nest object, put into printable format and lookup corresponding background colour
  let str = ''
  let list = []
  if (types !== undefined) {
    for (const item of types){
        str += item.type.name[0].toUpperCase()
            +  item.type.name.slice(1)
            +  ', '
        list.push(item.type.name)
    }
    str = str.slice(0, -2)
  }
  let colours = typeColours[list[0]]   // For now only use first type
  return {colours, str}
}

export default function Pokemon({route, navigation}) {
    const {name} = route.params;
    const [pokemonDetails, setPokemonDetails] = useState();

    useEffect(() => {
      const callAPI = async () => {
        try {
          const response = await fetch("https://pokeapi.co/api/v2/pokemon/" + name)
          const responseJson = await response.json()
          setPokemonDetails(responseJson)
        } catch(e) {console.log(e)}
      } 
      callAPI()
    }, [setPokemonDetails])

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateAnim = useRef(new Animated.Value(20)).current;
    const pan = useRef(new Animated.ValueXY()).current;

    const animateImage = () => {
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

    const panResponder = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (e, gestureState) => {
          if(gestureState.dy > 0)
            Animated.event([null, {dy: pan.y}], {useNativeDriver: false})(e, gestureState)
        },
        onPanResponderRelease: () => {
          Animated.spring(pan, {
            toValue: {x: 0, y: 0},
            useNativeDriver: true,
            tension: 20,
            friction: 10,
          }).start();
        },
      }),
    ).current;

    return (
      (pokemonDetails !== undefined) ? 
        <View style={[styles.container,
          {backgroundColor:unpackTypes(pokemonDetails.types).colours}]}>
            <View style={styles.imageContainer}>
              <Animated.Image
                  onLoad = {animateImage}
                  source={{
                    uri: pokemonDetails.sprites.other["official-artwork"].front_default,
                    // uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${name}.gif`
                  }}
                  style={[styles.image, 
                          {opacity: fadeAnim, transform : [{translateY: translateAnim}]}
                        ]}
              />
            </View>
            <Animated.View         
                style={[styles.statsContainer, 
                  {transform: [{translateY: pan.y}]}]}
                {...panResponder.panHandlers}>
              <Text style={styles.title}> {name[0].toUpperCase() + name.slice(1)} </Text>
              <Text style={styles.text}>  Type: {unpackTypes(pokemonDetails.types).str} </Text>
              <Text style={styles.text} > Abilities: {unpackAbilities(pokemonDetails.abilities)} </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 5}}>
                <MaterialCommunityIcons name="weight" size={24} color="black" />
                <Text> {pokemonDetails.weight + ' lb'} </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 5}}>
                <MaterialIcons name="height" size={24} color="black" />
                <Text> {pokemonDetails.height + ' in'} </Text>
              </View>
              <Text style={styles.text}> Base Experience: {pokemonDetails.base_experience} </Text>
            </Animated.View>
        </View> 
        :
        <View style = {styles.container}>
          <AntDesign name="loading1" size={24} color="black" />
        </View>
    )
};

const styles = StyleSheet.create({
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
      justifyContent: 'flex-start'
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
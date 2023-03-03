import { StyleSheet, Text, View, Image, Animated } from 'react-native';
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

    const animate = () => {
      Animated.parallel([
      // Will change fadeAnim value to 1 in 5 seconds
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(translateAnim, {
          toValue: -40,
          duration: 750,
          useNativeDriver: true,
        })]).start();
    };

    return (
      (pokemonDetails !== undefined) ? 
        <View style={styles.container}>
          <View style={[styles.imageContainer,
                      {backgroundColor:unpackTypes(pokemonDetails.types).colours}]}>
            <Animated.Image
                onLoad = {animate}
                source={{
                  uri: pokemonDetails.sprites.other["official-artwork"].front_default,
                  // uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${name}.gif`
                }}
                style={[styles.image, 
                        {opacity: fadeAnim, transform : [{translateY: translateAnim}]}
                      ]}
            />
          </View>
          <View style={styles.statsContainer}>
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
            </View>
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
      width: "100%",
      alignItems: 'center',
      justifyContent: 'flex-end'
    },
    statsContainer: {
      flex: 5,
      alignItems: 'center',
      justifyContent: 'flex-start'
    },
    image: {
      width: 200,
      height: 200,
      justifyContent: 'center',
      //bottom: 30
    },
    title: {
      fontSize: 32,
      marginVertical: 20
    },
    text: {
      marginVertical: 5
    }
  });
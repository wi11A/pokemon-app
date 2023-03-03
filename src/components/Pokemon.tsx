import { StyleSheet, Text, View, Image, Animated, PanResponder } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { MaterialCommunityIcons, MaterialIcons, AntDesign} from '@expo/vector-icons';

import typeColours from '../../assets/typeColours.json'
import { callDetailsAPI } from '../connections/getters'
import { unpackAbilities, unpackTypes } from '../helpers/unpackers';
import { animateImage } from '../helpers/animation';
import { styles } from './Pokemon.styles';

type PokemonType = {colours: string, str: string}
type Pokemon = {
  "weight" : string,
  "height" : string,
  "base_experience" : string,
  "abilities" : string,
  "types" : PokemonType,
  "image" : string,
 }

export default function Pokemon({route, navigation}) {
    const {name} = route.params;
    const [pokemonDetails, setPokemonDetails] = useState<Pokemon>();

    useEffect(() => {
      const getPokemonDetails = async () => {
        const responseJson = await callDetailsAPI(name)
        
        let details = {
         "weight" : responseJson.weight,
         "height" : responseJson.height,
         "base_experience" : responseJson.base_experience,
         "abilities" : unpackAbilities(responseJson.abilities),
         "types" : unpackTypes(responseJson.types, typeColours),
         "image" : responseJson.sprites.other["official-artwork"].front_default,
        }
        setPokemonDetails(details)
      }       
      getPokemonDetails()
    }, [setPokemonDetails])

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateAnim = useRef(new Animated.Value(20)).current;
    const pan = useRef(new Animated.ValueXY()).current;
    const scrollResponder = useRef(
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
          {backgroundColor: pokemonDetails.types.colours}]}>
            <View style={styles.imageContainer}>
              <Animated.Image
                  onLoad = {animateImage( fadeAnim, translateAnim)}
                  source={{
                    uri: pokemonDetails.image}}
                  style={[styles.image, 
                          {opacity: fadeAnim, transform : [{translateY: translateAnim}]}
                        ]}
              />
            </View>
            <Animated.View         
                style={[styles.statsContainer, 
                  {transform: [{translateY: pan.y}]}]}
                  {...scrollResponder.panHandlers}>
              <Text style={styles.title}> {name[0].toUpperCase() + name.slice(1)} </Text>
              <Text style={styles.text}>  Type: {pokemonDetails.types.str} </Text>
              <Text style={styles.text} > Abilities: {pokemonDetails.abilities} </Text>
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
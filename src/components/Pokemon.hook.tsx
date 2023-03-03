import React, { useEffect, useRef } from 'react';
import { Animated, PanResponder } from 'react-native';
import { callDetailsAPI } from '../connections/getters';
import { unpackAbilities, unpackTypes } from '../helpers/unpackers';
import typeColours from '../../assets/typeColours.json'


export function usePokemonDetails(setPokemonDetails, name) { 
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
    }, [setPokemonDetails]);
  }

export function usePanAnimation() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateAnim = useRef(new Animated.Value(20)).current;
    const pan = useRef(new Animated.ValueXY()).current;
    const scale = useRef(new Animated.Value(1)).current;

    const scrollResponder = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (e, gestureState) => {
          if(gestureState.dy > 0)
            Animated.event([null, {dy: pan.y}], {useNativeDriver: false})(e, gestureState)
          if(gestureState.dy > 0 && gestureState.dy < 60)
            Animated.event([null, {dy: scale}], {useNativeDriver: false})(e, gestureState)
         },
        onPanResponderRelease: () => {
          Animated.parallel([
            Animated.spring(pan, {
              toValue: {x: 0, y: 0},
              useNativeDriver: true,
              tension: 20,
              friction: 10,
            }),
            Animated.spring(scale, {
              toValue: 1,
              useNativeDriver: true,
              tension: 40,
              friction: 10,
            })
        ]).start();
        },
      }),
    ).current;
    return { fadeAnim, translateAnim, pan, scale, scrollResponder }
}
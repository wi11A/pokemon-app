import { Text, View, Image, Animated } from 'react-native';
import React, { useState } from 'react';
import { MaterialCommunityIcons, MaterialIcons, AntDesign} from '@expo/vector-icons';

import { animateImage } from '../helpers/animation';
import { styles } from './Pokemon.styles';
import { usePanAnimation, usePokemonDetails } from './Pokemon.hook';

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

    usePokemonDetails(setPokemonDetails, name)
    const {fadeAnim, translateAnim, pan, scale, scrollResponder} = usePanAnimation()

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
                          {opacity: fadeAnim, 
                           transform : [{translateY: translateAnim},
                                        {scaleX: scale.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [1, 1.008]
                                        })},
                                        {scaleY: scale.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [1, 1.008]
                                        })}
                          ]}
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
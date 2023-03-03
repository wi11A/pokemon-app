import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
import React, { useState, useEffect } from 'react';

import { styles } from './Pokedex.styles';
import { callListAPI } from '../connections/getters'
import { usePokemonList } from './Pokedex.hook'


type ItemProps = {title: string, navigation: any};
type PokemonList = {name: string, url: string};
 
const Item = ({title, navigation}: ItemProps, ) => (
  <Button  
    onPress={() => navigation.navigate('Details', {
      name: title
    })}
    title={title[0].toUpperCase()+title.slice(1)}
    color = "#6f7bbd"/>);


export default function Pokedex({navigation}) {
  const [pokemonList, setPokemonList] = useState<PokemonList[]>();
  usePokemonList(setPokemonList)

  return (
    <View style={styles.container}>
      <FlatList
        data={pokemonList}
        renderItem={({item}) => 
          <Item title={item.name}
                navigation={navigation} />}
        keyExtractor={item=>item.url}
      />
    </View>
  );
}


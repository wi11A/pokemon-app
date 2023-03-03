import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
import React, { useState, useEffect } from 'react';

const pokemonList = require("../../assets/kanto.json")

type ItemProps = {title: string, navigation: any};
 
const Item = ({title, navigation}: ItemProps, ) => (
  <Button  
    onPress={() => navigation.navigate('Details', {
      name: title
    })}
    title={title[0].toUpperCase()+title.slice(1)}
    color = "#6f7bbd"/>);


export default function Pokedex({navigation}) {
  const [pokemonList, setPokemonList] = useState({});

  useEffect(() => {
    const callAPI = async () => {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=898")
        const responseJson = await response.json()
        setPokemonList(responseJson.results)
      } catch(e) {console.log(e)}
    }
    callAPI()
  }, [setPokemonList])

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  flatList: {
  },
  item: {
    flex: 1,
    backgroundColor: '#6f7bbd',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

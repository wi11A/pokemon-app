import { View, FlatList, Button, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useInfiniteQuery } from 'react-query'

import { styles } from './Pokedex.styles';
import { callListAPI } from '../connections/getters';


type ItemProps = {title: string, navigation: any};
type PokemonList = {name: string, url: string};
 
const Item = ({title, navigation}: ItemProps, ) => (
  <Button  
    onPress={() => navigation.navigate('Details', {
      name: title
    })}
    title={title[0].toUpperCase()+title.slice(1)}
    color = "#6f7bbd"/>);

function toArray (pages) {
  // Append new pokemon from API call into one array
  let out = [];
  pages.map(page => {
    out.push(page.results)})
  return out.flat()
};


export default function Pokedex({navigation}) {
  const [pokemonList, setPokemonList] = useState<PokemonList[]>();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['pokemon'],
    queryFn: ({ 
      pageParam = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=50"
    }) => callListAPI(pageParam),
    getNextPageParam: (lastPage) => {
      const nextUrl = lastPage.next
      if (nextUrl) {
        return nextUrl
      }
      // Return false means no next page
      return false
    }
  })

  return ( 
    status === 'loading' ? (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    ) : status === 'error' ? (
      <View style={styles.container}>
        <Text>Error: {error.message}</Text>
      </View>
    ) : (
    <View style={styles.container}>
      <FlatList
        data={toArray(data.pages)}
        renderItem={({item}) => 
          <Item title={item.name}
                navigation={navigation} />}
        keyExtractor={item=>item.url}
        onEndReached={() => fetchNextPage()}
      />
    </View>
  ));
}



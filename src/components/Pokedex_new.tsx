import { View, FlatList, Button, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useInfiniteQuery } from 'react-query'

import { styles } from './Pokedex.styles';
import { usePokemonList } from './Pokedex.hook'
import { callListAPI2 } from '../connections/getters';


type ItemProps = {title: string, navigation: any};
type PokemonList = {name: string, url: string};

let ss = "https://pokeapi.co/api/v2/ability/?limit=20&offset=20"
 
const Item = ({title, navigation}: ItemProps, ) => (
  <Button  
    onPress={() => navigation.navigate('Details', {
      name: title
    })}
    title={title[0].toUpperCase()+title.slice(1)}
    color = "#6f7bbd"/>);


export default function Pokedex({navigation}) {
  const [pokemonList, setPokemonList] = useState<PokemonList[]>();
  //usePokemonList(setPokemonList)

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
    queryFn: ({ pageParam = 0}) => callListAPI2(pageParam),
    getNextPageParam: (lastPage) => {
      const nextUrl = lastPage.next
      console.log("offset", nextUrl)
      if (nextUrl) {
        // Return next page number
        return Number(nextUrl.split("offset")[1].slice(1,2))
      }
      // Return false means no next page
      return false
    }
  })

  return ( 
    status === 'loading' ? (
      <Text>Loading...</Text>
    ) : status === 'error' ? (
        <Text>Error: {error.message}</Text>
    ) : (
    <View style={styles.container}>
      <FlatList
        data={data.pages[0].results}
        renderItem={({item}) => 
          <Item title={item.name}
                navigation={navigation} />}
        keyExtractor={item=>item.url}
      />
      <Button
      onPress={() => fetchNextPage()}
      title={isFetchingNextPage
        ? 'Loading more...'
        : hasNextPage
        ? 'Load More'
        : 'Nothing more to load'}
      disabled={!hasNextPage || isFetchingNextPage}>

      </Button>
      <Text>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</Text>
    </View>
  ));
}



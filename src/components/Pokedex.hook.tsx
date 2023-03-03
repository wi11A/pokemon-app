import { useEffect } from 'react';
import { callListAPI } from '../connections/getters'

export function usePokemonList(setPokemonList) {
  useEffect(() => {
    const getPokemonDetails = async () => {
      const responseJson = await callListAPI()
      setPokemonList(responseJson.results)
    }
    getPokemonDetails()
  }, [setPokemonList]);
}




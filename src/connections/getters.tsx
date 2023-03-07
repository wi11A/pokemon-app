export const callDetailsAPI = async (name) => {
    try {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon/" + name)
      return await response.json()
    } catch(error) {console.log(error)}
}

export const callListAPI = async (url="") => {
    try {
      const response = await fetch(url)
      return await response.json()
    } catch(error) {console.log(error)}
  }
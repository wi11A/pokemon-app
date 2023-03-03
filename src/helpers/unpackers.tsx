export function unpackAbilities(abilities) {
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
  
export function unpackTypes(types, typeColours) {
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
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import Pokedex from '../components/Pokedex';
import Pokemon from '../components/Pokemon';

const Stack = createNativeStackNavigator();

export default function Navigator() {
    return(
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Pokedex" component={Pokedex}/>
                <Stack.Screen name="Details" component={Pokemon}/>
            </Stack.Navigator>
        </NavigationContainer>

    )
}

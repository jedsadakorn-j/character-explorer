import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FavoritesProvider } from './context/FavoritesContext.js';
import CharacterExplorer from './pages/CharacterExplorer/CharacterExplorer.js';
import CharacterDetail from './pages/CharacterDetail/CharacterDetail.js';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <FavoritesProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Explorer">
            <Stack.Screen
              name="Explorer"
              component={CharacterExplorer}
              options={{ title: 'Rick and Morty' }}
            />
            <Stack.Screen
              name="Detail"
              component={CharacterDetail}
              // Use the tapped character's name as the header title.
              options={({ route }) => ({ title: route.params.character.name })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </FavoritesProvider>
    </SafeAreaProvider>
  );
}

import { View, FlatList, Text, ActivityIndicator, Alert } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { myStyle } from './styles/myStyle.js';
import CharacterCard from './components/CharacterCard.js';

export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [result, setResult] = useState([]);

  // One fetch function reused by the first load and pull-to-refresh.
  // useCallback keeps the same reference between renders so FlatList's
  // onRefresh prop stays stable.
  const loadCharacters = useCallback(async () => {
    try {
      const response = await fetch('https://rickandmortyapi.com/api/character');
      const json = await response.json();
      setResult(json);
    } catch (error) {
      Alert.alert('Something went wrong', 'Could not load characters. Please try again.');
    }
  }, []);

  // Initial load: show the full-screen spinner.
  useEffect(() => {
    loadCharacters().finally(() => setLoading(false));
  }, [loadCharacters]);

  // Pull-to-refresh: show the small spinner at the top of the list instead.
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCharacters();
    setRefreshing(false);
  }, [loadCharacters]);

  return (
    <View style={myStyle.container}>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="rgb(74, 80, 80)"
          style={{ alignSelf: 'center' }}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <Text style={{ alignSelf: 'center', fontSize: 30, fontWeight: 'bold' }}>
            Rick and Morty
          </Text>
          <FlatList
            data={result.results}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <CharacterCard character={item} />}
            contentContainerStyle={{ paddingBottom: 24 }}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        </View>
      )}
    </View>
  );
}

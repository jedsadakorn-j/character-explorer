import { View, FlatList, Text, ActivityIndicator, Button, StyleSheet } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { myStyle } from './styles/myStyle.js';
import CharacterCard from './components/CharacterCard.js';

function CharacterExplorer() {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [result, setResult] = useState([]);
  const [error, setError] = useState(null);

  // One fetch function reused by the first load and pull-to-refresh.
  const loadCharacters = useCallback(async () => {
    try {
      const response = await fetch('https://rickandmortyapi.com/api/character');
      // fetch() only rejects on a network failure — NOT on 404/500. So we
      // check response.ok ourselves and throw before trying to parse JSON.
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const json = await response.json();
      // The API returns { info, results }. We keep only the results array,
      // which matches our [] initial state.
      setResult(json.results);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // Initial load: full-screen spinner.
  useEffect(() => {
    loadCharacters().finally(() => setIsLoading(false));
  }, [loadCharacters]);

  // Pull-to-refresh (and error retry): small spinner / button.
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCharacters();
    setRefreshing(false);
  }, [loadCharacters]);

  // --- Case 1: first load ---
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="rgb(74, 80, 80)" />
      </View>
    );
  }

  // --- Case 2: error --- pressing OK retries the fetch.
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <Button
          title={refreshing ? 'Loading…' : 'OK'}
          onPress={handleRefresh}
          disabled={refreshing}
        />
      </View>
    );
  }

  // --- Case 3: normal view ---
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>Rick and Morty</Text>
      <FlatList
        data={result}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <CharacterCard character={item} />}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </View>
  );
}

export default function App() {
  // SafeAreaProvider must wrap the tree so SafeAreaView can read the
  // device's safe-area insets (notch, status bar, home indicator).
  return (
    <SafeAreaProvider>
      <SafeAreaView style={myStyle.container} edges={['top']}>
        <CharacterExplorer />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    alignSelf: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
    textAlign: 'center',
  },
});

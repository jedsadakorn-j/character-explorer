import { View, FlatList, Text, TextInput, ActivityIndicator, Button } from 'react-native';
import { useState, useEffect } from 'react';
import CharacterCard from '../../components/CharacterCard.js';
import StatusChips from '../../components/StatusChips.js';
import { useCharacters } from '../../hooks/useCharacters.js';
import { styles } from './styles.js';

export default function CharacterExplorer({ navigation }) {
  // `searchText` updates on every keystroke; `query` only updates after the
  // user pauses. Keeping them separate is what makes debouncing possible.
  const [searchText, setSearchText] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState(''); // '' = all

  // Debounce: wait 400ms after the last keystroke before committing the query.
  useEffect(() => {
    const timer = setTimeout(() => setQuery(searchText.trim()), 400);
    return () => clearTimeout(timer);
  }, [searchText]);

  const { data, isLoading, isLoadingMore, refreshing, error, hasMore, loadMore, refresh } =
    useCharacters({ query, status });

  function renderBody() {
    if (isLoading) {
      return <ActivityIndicator size="large" color="rgb(74, 80, 80)" style={styles.centered} />;
    }
    if (error) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <Button title="Try again" onPress={refresh} />
        </View>
      );
    }
    if (data.length === 0) {
      return (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No characters match your filters.</Text>
        </View>
      );
    }
    return (
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <CharacterCard
            character={item}
            onPress={() => navigation.navigate('Detail', { character: item })}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={refresh}
        keyboardShouldPersistTaps="handled"
        // Infinite scroll: fire loadMore when the user is within half a screen
        // of the bottom. The hook itself guards against firing with no next page.
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoadingMore ? (
            <ActivityIndicator style={styles.footer} color="rgb(74, 80, 80)" />
          ) : !hasMore ? (
            <Text style={styles.footerText}>You've reached the end 🛸</Text>
          ) : null
        }
      />
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search characters…"
        value={searchText}
        onChangeText={setSearchText}
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
      <StatusChips value={status} onChange={setStatus} />
      {renderBody()}
    </View>
  );
}

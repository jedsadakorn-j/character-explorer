import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../context/FavoritesContext.js';

// Map a character's status to a colored dot, so the UI communicates
// state visually instead of relying on text alone.
function statusColor(status) {
  switch (status) {
    case 'Alive':
      return '#4caf50'; // green
    case 'Dead':
      return '#e53935'; // red
    default:
      return '#9e9e9e'; // gray ("unknown")
  }
}

// A single character shown as a tappable card. Tapping the card triggers
// `onPress` (navigation); tapping the heart toggles favorite state, which
// lives in the FavoritesContext (shared across the whole app).
export default function CharacterCard({ character, onPress }) {
  const { id, name, status, species, gender, image } = character;
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(id);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.meta}>
          {species} • {gender}
        </Text>
        <View style={styles.statusRow}>
          <View style={[styles.dot, { backgroundColor: statusColor(status) }]} />
          <Text style={styles.meta}>{status}</Text>
        </View>
      </View>

      {/* Nested Pressable: it becomes the touch responder, so tapping the
          heart toggles favorite WITHOUT also triggering the card's onPress.
          hitSlop enlarges the tap area beyond the small icon. */}
      <Pressable
        onPress={() => toggleFavorite(character)}
        hitSlop={12}
        style={styles.heart}
      >
        <Ionicons
          name={favorite ? 'heart' : 'heart-outline'}
          size={26}
          color={favorite ? '#e91e63' : '#c0c0c0'}
        />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginTop: 16,
    marginHorizontal: 20,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    // subtle shadow (iOS) + elevation (Android)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  pressed: {
    opacity: 0.6,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  info: {
    flex: 1,
    marginLeft: 14,
    marginRight: 30, // leave room for the heart
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  meta: {
    fontSize: 14,
    color: '#555',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  heart: {
    position: 'absolute',
    top: 10,
    right: 12,
  },
});

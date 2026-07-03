import { View, Text, Image, StyleSheet } from 'react-native';

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

// A single character shown as a card. It receives one `character` object
// and is responsible only for displaying it — no data fetching here.
export default function CharacterCard({ character }) {
  const { name, status, species, gender, image } = character;

  return (
    <View style={styles.card}>
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
    </View>
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
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  info: {
    flex: 1,
    marginLeft: 14,
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
});

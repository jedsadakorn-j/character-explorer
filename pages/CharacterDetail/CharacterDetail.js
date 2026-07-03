import { View, Text, Image, ScrollView } from 'react-native';
import { styles } from './styles.js';

// A single labeled line, e.g. "Species    Human".
function DetailRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export default function CharacterDetail({ route }) {
  // The whole character object was passed via navigation params from the list.
  // The list endpoint already includes origin, location and the episode list,
  // so we don't need a second API request here.
  const { character } = route.params;
  const { name, status, species, gender, origin, location, episode, image } = character;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.name}>{name}</Text>

      <DetailRow label="Status" value={status} />
      <DetailRow label="Species" value={species} />
      <DetailRow label="Gender" value={gender} />
      <DetailRow label="Origin" value={origin?.name ?? 'Unknown'} />
      <DetailRow label="Location" value={location?.name ?? 'Unknown'} />
      {/* episode is an array of URLs — its length is how many episodes this
          character appears in. */}
      <DetailRow label="Episodes" value={String(episode?.length ?? 0)} />
    </ScrollView>
  );
}

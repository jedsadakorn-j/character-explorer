import { View, Text, Pressable, StyleSheet } from 'react-native';

// The API's status values are lowercase; '' means "no filter / All".
const OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Alive', value: 'alive' },
  { label: 'Dead', value: 'dead' },
  { label: 'Unknown', value: 'unknown' },
];

// A horizontal row of filter chips. Controlled component: the parent owns the
// selected `value` and gets notified via `onChange`.
export default function StatusChips({ value, onChange }) {
  return (
    <View style={styles.row}>
      {OPTIONS.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value || 'all'}
            onPress={() => onChange(option.value)}
            style={[styles.chip, selected && styles.chipSelected]}
          >
            <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d0d0d0',
  },
  chipSelected: {
    backgroundColor: '#222',
    borderColor: '#222',
  },
  chipText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  chipTextSelected: {
    color: 'white',
  },
});

import { StyleSheet } from 'react-native';

export const myStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgb(139, 247, 44)",
    paddingTop: 70
  },
  header: {
    fontSize: 20,
  },
  description: {
    fontSize: 20,
    fontStyle: "italic"
  },
  content: {
    backgroundColor: "#fbff00",
    padding: 25,
    marginTop: 15,
    borderWidth: 3,
    borderColor: "rgb(0, 128, 255)",
    borderStyle: "dashed",
    borderRadius: 10
  },
  input: {
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 15
  }
})

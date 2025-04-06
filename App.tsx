import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

type Experience = {
  id: string;
  title: string;
  completed: boolean;
  photoUri?: string;
};

export default function App() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [newTitle, setNewTitle] = useState('');

  const addExperience = () => {
    if (!newTitle.trim()) return;
    const newExp: Experience = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      completed: false,
    };
    setExperiences([...experiences, newExp]);
    setNewTitle('');
  };

  const markComplete = (id: string) => {
    setExperiences(prev =>
        prev.map(exp =>
            exp.id === id ? { ...exp, completed: true } : exp
        )
    );
  };

  return (
      <View style={styles.container}>
        <Text style={styles.header}>📸 Experience List</Text>
        <View style={styles.inputRow}>
          <TextInput
              style={styles.input}
              placeholder="Add new experience"
              value={newTitle}
              onChangeText={setNewTitle}
          />
          <Button title="Add" onPress={addExperience} />
        </View>
        <FlatList
            data={experiences}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={styles.listItem}>
                  <Text
                      style={[
                        styles.itemText,
                        item.completed && styles.completedText,
                      ]}
                  >
                    {item.title}
                  </Text>
                  {!item.completed && (
                      <TouchableOpacity onPress={() => markComplete(item.id)}>
                        <Text style={styles.completeBtn}>✔️</Text>
                      </TouchableOpacity>
                  )}
                </View>
            )}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginRight: 10,
    borderRadius: 6,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: '#aaa',
  },
  itemText: { fontSize: 16, flex: 1 },
  completedText: { textDecorationLine: 'line-through', color: '#888' },
  completeBtn: { fontSize: 20, paddingHorizontal: 10 },
});

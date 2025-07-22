import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function AddNoteScreen() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const router = useRouter();

  const handleAddNote = async () => {
    if (!title || !content) {
      Alert.alert('Validation Error', 'Title and Content are required!');
      return;
    }

    try {
      const response = await axios.post("http://ip_address/notes/", {
        title,
        content,
        tags
      });

      Alert.alert('Success', 'Note added successfully!');
      setTitle('');
      setContent('');
      setTags('');

      router.push('/'); 
    } catch (error) {
      console.error('Error adding note:', error);
      Alert.alert('Error', 'Failed to add note.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add a New Note</Text>

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        multiline
        numberOfLines={4}
      />

      <TextInput
        style={styles.input}
        placeholder="Tags (optional)"
        value={tags}
        onChangeText={setTags}
      />

      <Button title="Add Note" onPress={handleAddNote} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f8ff'
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginBottom: 12
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top'
  }
});

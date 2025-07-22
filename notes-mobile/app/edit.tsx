import { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";

export default function EditNoteScreen(){
    const {id} = useLocalSearchParams()
    const router= useRouter()

    const[title,setTitle] = useState('')
    const[content, setContent] = useState('')
    const [tags, setTags] = useState('')

    useEffect(()=> {
        axios.get(`http://ip_address/notes/${id}/`)
        .then(response =>{
            const note = response.data
            setTitle(note.title)
            setContent(note.content)
            setTags(note.tags || '')
        })
        .catch(error => {
            console.error('Failed to fetch note:', error)
            Alert.alert('Error', "Could not load the note")
        })
    },[id])

    const handleUpdate = () => {
        axios.put(`http://ip_address/notes/${id}/`, {
          title,
          content,
          tags,
        })
        .then(() => {
            Alert.alert('Success','Note Updated')
            router.push('/')
        })
        .catch(error => {
            console.error("Update failed:", error);
            Alert.alert("Error", "Could not update the note.");
          });
}

    return (
    <View style={styles.container}>
      <Text style={styles.heading}>Edit Note</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Content"
        value={content}
        multiline
        onChangeText={setContent}
      />
      <TextInput
        style={styles.input}
        placeholder="Tags"
        value={tags}
        onChangeText={setTags}
      />
      <Button title="Update Note" onPress={handleUpdate} />
    </View>
  );
}

const styles = StyleSheet.create({
    container: { 
        padding: 16, 
        flex: 1, 
        backgroundColor: '#fff'
    },
    heading: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        marginBottom: 16 
    },
    input: { 
        borderColor: '#ccc', 
        borderWidth: 1, 
        borderRadius: 4, 
        marginBottom: 12, 
        padding: 8 },
  });

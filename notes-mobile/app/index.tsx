import axios from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Note {
  id: number;
  title: string;
  content: string;
  tags?: string;
}

export default function NotesScreen() {
  const [notes,setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter();

  useEffect(()=>{
    axios.get("http://192.168.2.4:8000/notes/")
    .then(response => {
      setNotes(response.data)
      setLoading(false)
    })
    .catch(error =>{
      console.error('Error fetching notes:', error);
      setLoading(false)
    })
  },[])

  if(loading){
    return <ActivityIndicator size='large' style={styles.loading} />
  }  

  const handleDelete = (id: number) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this note?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            axios.delete(`http://192.168.2.4:8000/notes/${id}/`)
              .then(() => {
                setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
              })
              .catch(error => {
                console.error("Error deleting note:", error);
                Alert.alert("Error", "Failed to delete the note.");
              });
          }
        }
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>NOTES</Text>

      <View style={{ marginBottom: 16 }}>
      <Button title="+ Add Note" onPress={() => router.push('/add')} />
      </View>

      <FlatList
  data={notes}
  keyExtractor={item => item.id.toString()}
  renderItem={({ item }) => (
    <View style={styles.noteCard}>
      <Text style={styles.noteTitle}>{item.title}</Text>
      <Text>{item.content}</Text>
      {item.tags ? <Text style={styles.tags}>Tags: {item.tags}</Text> : null}

      <View style={styles.buttonRow}>
  <TouchableOpacity
    style={styles.editButton}
    onPress={() => router.push({ pathname: "/edit", params: { id: item.id.toString() } })}
  >
    <Text style={styles.buttonText}>Edit</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={styles.deleteButton}
    onPress={() => handleDelete(item.id)}
>
    <Text style={styles.buttonText}>Delete</Text>
  </TouchableOpacity>
</View>   
    </View>
  )}
/>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f4f8', // soft light blue
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2c3e50',
    textAlign: 'center',
  },
  noteCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 6,
  },
  tags: {
    marginTop: 8,
    fontStyle: 'italic',
    color: '#6c757d',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end',
    gap: 8, // only if using RN >= 0.71
  },
  editButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});



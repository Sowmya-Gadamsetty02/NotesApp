import {useEffect, useState, useRef } from 'react'
import api from '../api/axios'
import {Note} from '../types/note'
import '../Notes.css';


export default function Notes(){
    const [notes, setNotes] = useState<Note[]>([])
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [form, setForm] = useState({ title: '', content: '', tags: '' });
    const editSectionRef = useRef<HTMLDivElement | null>(null);



    useEffect(() => {
        api.get<Note[]>('notes/')
        .then(response => {
            console.log('Fetched notes:', response.data); 
            setNotes(response.data);
          })
        .catch(error => console.error('Error fetching notes:',error))
    }, [])

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          const response = await api.post<Note>('notes/', {
            title,
            content,
            tags
          });
          setNotes([...notes, response.data]); 
          setTitle('');
          setContent('');
          setTags('');
        } catch (error) {
          console.error('Error adding note:', error);
        }
      };

      const handleDelete = (id: number) => {
        api.delete(`notes/${id}/`)
          .then(() => {
            setNotes(notes.filter(note => note.id !== id));
          })
          .catch(error => console.error('Error deleting note:', error));
      };
      
      const handleEdit = (note: Note) => {
        setEditingNote(note);
        setForm({
          title: note.title,
          content: note.content,
          tags: note.tags || ''
        });
      
        setTimeout(() => {
          editSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100); 
      };
      
      
      const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingNote) return;
      
        api.put(`notes/${editingNote.id}/`, {
          ...form
        })
          .then((res) => {
            const updatedNote = res.data;
            setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
            setEditingNote(null);
            setForm({ title: '', content: '', tags: '' });
          })
          .catch(err => console.error("Error updating note:", err));
      };
      

      return (
        <div className="container">
          <h1>Notes</h1>
      
          <form onSubmit={handleAddNote}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Content"
              value={content}
              onChange={e => setContent(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Tags (optional)"
              value={tags}
              onChange={e => setTags(e.target.value)}
            />
            <button type="submit">Add Note</button>
          </form>
      
          <ol>
            {notes.map((note) => (
              <li key={note.id} className="note">
                <strong>{note.title}</strong>
                {note.content}
                {note.tags && <div className="tags">Tags: {note.tags}</div>}
                <div className="buttons">
                  <button className="edit" onClick={() => handleEdit(note)}>Edit</button>
                  <button className="delete" onClick={() => handleDelete(note.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ol>
      
          {editingNote && (
             <div className="mt-8" ref={editSectionRef}>
                <h2 className="text-xl font-bold mb-2">Edit Note</h2>
                <form onSubmit={handleUpdate}>
                <input
                  type="text"
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Content"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Tags"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                />
                <button type="submit">Update</button>
              </form>
            </div>
          )}
        </div>
      );
      
}
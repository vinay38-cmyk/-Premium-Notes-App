import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import NotesList from './components/NotesList';
import Editor from './components/Editor';

const INITIAL_FOLDERS = [
  { id: 'all', name: 'All Notes', icon: 'FileText' },
  { id: 'trash', name: 'Trash', icon: 'Trash2' },
];

export default function App() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('notes_app_data');
    return saved ? JSON.parse(saved).notes : [];
  });

  const [folders, setFolders] = useState(() => {
    const saved = localStorage.getItem('notes_app_data');
    return saved ? JSON.parse(saved).folders : INITIAL_FOLDERS;
  });

  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [activeFolderId, setActiveFolderId] = useState('all');
  const [activeCategory, setActiveCategory] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('notes_app_theme');
    return saved === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('notes_app_data', JSON.stringify({ notes, folders }));
  }, [notes, folders]);

  useEffect(() => {
    localStorage.setItem('notes_app_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleCreateNote = (type = 'text', folderId = activeFolderId === 'all' ? null : activeFolderId) => {
    const newNote = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      type,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      folderId: folderId,
      categories: [],
      items: type === 'todo' || type === 'shopping' ? [] : undefined,
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
  };

  const handleUpdateNote = (id, updates) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, ...updates, updatedAt: new Date().toISOString() } : note
    ));
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
    if (selectedNoteId === id) setSelectedNoteId(null);
  };

  const handleCreateFolder = (name) => {
    const newFolder = { id: Date.now().toString(), name };
    setFolders([...folders, newFolder]);
  };

  const filteredNotes = notes.filter(note => {
    if (activeFolderId !== 'all' && note.folderId !== activeFolderId) return false;
    if (activeCategory && !note.categories.includes(activeCategory)) return false;
    return true;
  });

  const selectedNote = notes.find(n => n.id === selectedNoteId);

  return (
    <div className={`flex h-screen w-full bg-[#F4F4F4] text-gray-900 dark:text-gray-100 transition-colors duration-200 overflow-hidden font-sans`}>
      <Sidebar 
        folders={folders} 
        activeFolderId={activeFolderId} 
        setActiveFolderId={setActiveFolderId}
        handleCreateFolder={handleCreateFolder}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
      
      <NotesList 
        notes={filteredNotes} 
        selectedNoteId={selectedNoteId} 
        setSelectedNoteId={setSelectedNoteId}
        onCreateNote={handleCreateNote}
      />
      
      <div className="flex-1 overflow-hidden">
        {selectedNote ? (
          <Editor 
            note={selectedNote} 
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-600">
            <p>Select a note or create a new one</p>
          </div>
        )}
      </div>
    </div>
  );
}

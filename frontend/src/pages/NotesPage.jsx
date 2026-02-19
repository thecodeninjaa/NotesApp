// TODO: Add Dark Mode

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { FiSearch, FiUser, FiMoreHorizontal, FiClock, FiLogOut, FiEdit } from 'react-icons/fi';
import EditNoteModal from '../components/EditNoteModal';
import FolderCard from '../components/FolderCard';
import NewItemCard from '../components/NewItemCard';

const NoteCard = ({ note, onDelete, onEdit }) => (
  <div className={`p-4 rounded-lg shadow bg-yellow-100 dark:bg-yellow-900 min-h-[200px] flex flex-col`}>
    <div className="flex justify-between items-start mb-2">
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{new Date(note.created_at).toLocaleDateString()}</p>
      <div>
        <button onClick={() => onEdit(note)} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white mr-2">
          <FiEdit />
        </button>
        <button onClick={() => onDelete(note.id)} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
          <FiMoreHorizontal />
        </button>
      </div>
    </div>
    <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">{note.title}</h4>
    <p className="text-sm text-gray-700 dark:text-gray-300 flex-grow mb-3">{note.content}</p>
    <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mt-auto">
      <FiClock className="mr-1" /> Sunday
    </div>
  </div>
);

function NotesPage({ session }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('Notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching notes:', error);
      } else {
        setNotes(data);
      }
    }
    setLoading(false);
  };

  const handleDeleteNote = async (noteId) => {
    const { error } = await supabase.from('Notes').delete().eq('id', noteId);
    if (error) {
      console.error('Error deleting note:', error);
    } else {
      setNotes(notes.filter((note) => note.id !== noteId));
    }
  };

  const handleUpdateNote = async (updatedNote) => {
    const { data, error } = await supabase
      .from('Notes')
      .update({ title: updatedNote.title, content: updatedNote.content })
      .eq('id', updatedNote.id)
      .select();

    if (error) {
      console.error('Error updating note:', error);
    } else if (data) {
      setNotes(notes.map((note) => (note.id === updatedNote.id ? data[0] : note)));
      setEditingNote(null);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm p-4 w-full flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">MY NOTES</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="bg-gray-100 dark:bg-gray-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-gray-200"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{session?.user?.email}</span>
            <FiUser className="text-gray-600 dark:text-gray-400" />
          </div>
          <button onClick={handleLogout} className="text-gray-600 dark:text-gray-400">
            <FiLogOut size={24} />
          </button>
        </div>
      </div>

      <div className="w-full p-6 space-y-8">
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Recent Folders</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400 space-x-4">
              <button className="hover:text-gray-800 dark:hover:text-white">Todays</button>
              <button className="text-gray-800 dark:text-white font-medium border-b-2 border-blue-500 pb-1">This Week</button>
              <button className="hover:text-gray-800 dark:hover:text-white">This Month</button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <FolderCard title="Movie Review" date="12/12/2021" color="bg-blue-100" />
            <FolderCard title="Class Notes" date="12/12/2021" color="bg-red-100" />
            <FolderCard title="Book Lists" date="12/12/2021" color="bg-yellow-100" />
            <NewItemCard type="folder" />
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">My Notes</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400 space-x-4">
              <button className="hover:text-gray-800 dark:hover:text-white">Todays</button>
              <button className="text-gray-800 dark:text-white font-medium border-b-2 border-blue-500 pb-1">This Week</button>
              <button className="hover:text-gray-800 dark:hover:text-white">This Month</button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {loading ? (
              <p>Loading...</p>
            ) : (
              notes.map((note) => (
                <NoteCard key={note.id} note={note} onDelete={handleDeleteNote} onEdit={setEditingNote} />
              ))
            )}
            <NewItemCard type="note" />
          </div>
        </section>
      </div>

      {editingNote && (
        <EditNoteModal
          note={editingNote}
          onSave={handleUpdateNote}
          onClose={() => setEditingNote(null)}
        />
      )}
    </main>
  );
}

export default NotesPage;

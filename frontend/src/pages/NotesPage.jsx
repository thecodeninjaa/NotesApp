// TODO: Add Dark Mode

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { FiSearch, FiUser, FiMoreHorizontal, FiClock, FiLogOut, FiEdit } from 'react-icons/fi';
import EditNoteModal from '../components/EditNoteModal';
import FolderCard from '../components/FolderCard';
import NewItemCard from '../components/NewItemCard';

const NoteCard = ({ note, onDelete, onEdit }) => (
  <div className={`p-4 rounded-2xl shadow-sm bg-amber-50 dark:bg-yellow-900/30 min-h-[200px] flex flex-col transition-all duration-200 hover:shadow-lg hover:-translate-y-2 hover:scale-[1.02] cursor-pointer border border-amber-100 dark:border-yellow-800/20`}>
    <div className="flex justify-between items-start mb-2">
      <p className="text-xs text-neutral-500 dark:text-gray-400 mb-1">{new Date(note.created_at).toLocaleDateString()}</p>
      <div>
        <button onClick={() => onEdit(note)} className="text-neutral-400 dark:text-gray-400 hover:text-neutral-600 dark:hover:text-white mr-2 transition-colors">
          <FiEdit />
        </button>
        <button onClick={() => onDelete(note.id)} className="text-neutral-400 dark:text-gray-400 hover:text-neutral-600 dark:hover:text-white transition-colors">
          <FiMoreHorizontal />
        </button>
      </div>
    </div>
    <h4 className="font-semibold mb-2 text-neutral-700 dark:text-gray-200">{note.title}</h4>
    <p className="text-sm text-neutral-600 dark:text-gray-300 grow mb-3 line-clamp-4">{note.content}</p>
    <div className="flex items-center text-xs text-neutral-500 dark:text-gray-400 mt-auto">
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
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-orange-50 dark:bg-gray-900">
      <div className="bg-orange-100/50 dark:bg-gray-800 shadow-sm p-4 w-full flex items-center justify-between border-b border-orange-200 dark:border-gray-700">
        <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">MY NOTES</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="bg-white/70 dark:bg-gray-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white dark:focus:bg-gray-600 text-gray-700 dark:text-gray-200 border border-orange-200 dark:border-gray-600"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{session?.user?.email}</span>
            <FiUser className="text-gray-400 dark:text-gray-400" />
          </div>
          <button onClick={handleLogout} className="text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <FiLogOut size={24} />
          </button>
        </div>
      </div>
  
      <div className="w-full p-6 space-y-8">
        <section className="bg-white/80 dark:bg-gray-800/50 rounded-2xl p-6 border border-orange-200 dark:border-gray-700/50 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-200">Recent Folders</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400 space-x-4">
              <button className="hover:text-gray-700 dark:hover:text-white transition-colors">Todays</button>
              <button className="text-gray-700 dark:text-white font-medium border-b-2 border-orange-400 dark:border-blue-500 pb-1">This Week</button>
              <button className="hover:text-gray-700 dark:hover:text-white transition-colors">This Month</button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <FolderCard title="Movie Review" date="12/12/2021" color="bg-blue-100" />
            <FolderCard title="Class Notes" date="12/12/2021" color="bg-pink-100" />
            <FolderCard title="Book Lists" date="12/12/2021" color="bg-yellow-100" />
            <NewItemCard type="folder" />
          </div>
        </section>
  
        <section className="bg-white/80 dark:bg-gray-800/50 rounded-2xl p-6 border border-orange-200 dark:border-gray-700/50 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-200">My Notes</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400 space-x-4">
              <button className="hover:text-gray-700 dark:hover:text-white transition-colors">Todays</button>
              <button className="text-gray-700 dark:text-white font-medium border-b-2 border-orange-400 dark:border-blue-500 pb-1">This Week</button>
              <button className="hover:text-gray-700 dark:hover:text-white transition-colors">This Month</button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {loading ? (
              <p className="text-gray-500 dark:text-gray-400">Loading...</p>
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
  )};

export default NotesPage;

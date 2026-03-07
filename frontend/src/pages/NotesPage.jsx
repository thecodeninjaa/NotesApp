
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { FiSearch, FiUser, FiMoreHorizontal, FiClock, FiLogOut, FiEdit, FiFileText } from 'react-icons/fi';
import EditNoteModal from '../components/EditNoteModal';
import FolderCard from '../components/FolderCard';
import NewItemCard from '../components/NewItemCard';
import CreateFolderModal from '../components/CreateFolderModal';

const NoteCard = ({ note, onDelete, onEdit, mousePos }) => {
  const [rect, setRect] = useState(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      setRect(cardRef.current.getBoundingClientRect());
    }
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={() => onEdit(note)}
      className="relative w-full h-[220px] rounded-[2rem] border border-white/10 bg-[#0f0f0f]/80 backdrop-blur-xl p-6 overflow-hidden flex flex-col group cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
    >
      {/* Proximity Glow from mouse tracking */}
      {mousePos && rect && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(800px circle at ${mousePos.x - rect.left}px ${mousePos.y - rect.top}px, rgba(234, 88, 12, 0.15), transparent 40%)`
          }}
        />
      )}

      {/* Heavy bottom inner glow haze (using an amber/orange glow for notes) */}
      <div className="absolute -bottom-6 left-0 right-0 h-28 bg-gradient-to-t from-orange-600 to-transparent opacity-60 blur-2xl group-hover:opacity-90 transition-opacity duration-500 pointer-events-none" />

      {/* Intense bright bottom border line */}
      <div className="absolute bottom-0 left-[0%] right-[0%] h-[3px] bg-orange-400 blur-[1px] opacity-80 group-hover:opacity-100 group-hover:shadow-[0_0_20px_var(--tw-shadow-color)] shadow-orange-400 transition-all duration-500 pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
            <FiFileText className="text-gray-300" size={18} />
          </div>
          <div onClick={(e) => e.stopPropagation()} className="flex gap-1 -mr-2 -mt-2">
            <button onClick={() => onEdit(note)} className="p-2 text-gray-500 hover:text-white transition-colors">
              <FiEdit size={18} />
            </button>
            <button onClick={() => onDelete(note.id)} className="p-2 text-gray-500 hover:text-white transition-colors">
              <FiMoreHorizontal size={18} />
            </button>
          </div>
        </div>

        <div className="mt-auto">
          <h4 className="text-xl font-semibold mb-2 text-white tracking-tight line-clamp-1">{note.title}</h4>
          <p className="text-sm text-gray-400 line-clamp-2 mb-4">
            {note.content || "Empty note"}
          </p>
          <div className="text-white text-sm font-medium mt-auto flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            Open note <span className="ml-1">→</span>
          </div>
        </div>
      </div>
    </div>
  )
};

function NotesPage({ session, mousePos }) {
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const [notesResponse, foldersResponse] = await Promise.all([
        supabase
          .from('Notes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('Folders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
      ]);

      if (notesResponse.error) console.error('Error fetching notes:', notesResponse.error);
      else setNotes(notesResponse.data || []);

      if (foldersResponse.error) console.error('Error fetching folders:', foldersResponse.error);
      else setFolders(foldersResponse.data || []);
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
      .update({ title: updatedNote.title, content: updatedNote.content, folder_id: updatedNote.folder_id })
      .eq('id', updatedNote.id)
      .select();

    if (error) {
      console.error('Error updating note:', error);
    } else if (data) {
      setNotes(notes.map((note) => (note.id === updatedNote.id ? data[0] : note)));
      setEditingNote(null);
    }
  };

  const handleCreateNote = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('Notes')
        .insert([
          { title: 'New Note', content: '', user_id: user.id, folder_id: selectedFolderId, created_at: new Date().toISOString() },
        ])
        .select();

      if (error) {
        console.error('Error creating note:', error);
      } else if (data) {
        setNotes([data[0], ...notes]);
      }
    }
  };

  const handleCreateFolder = async (name, color) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('Folders')
        .insert([
          { name, color, user_id: user.id, created_at: new Date().toISOString() },
        ])
        .select();

      if (error) {
        console.error('Error creating folder:', error);
      } else if (data) {
        setFolders([data[0], ...folders]);
        setIsCreateFolderModalOpen(false);
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <main
      className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent group/board"
    >
      <div className="bg-orange-100/50 dark:bg-gray-800 shadow-sm p-4 w-full flex items-center justify-between border-b border-orange-200 dark:border-gray-700">
        <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">MY NOTES</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="bg-white/70 dark:bg-gray-700 rounded-lg py-2 pl-10 pr-4 outline-none focus:shadow-lg focus:shadow-orange-300/50 focus:bg-white dark:focus:bg-gray-600 text-gray-700 dark:text-gray-200 border border-orange-200 dark:border-gray-600"
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
        <section className="bg-white/80 dark:bg-transparent rounded-2xl py-6 xl:px-6 border border-orange-200 dark:border-transparent lg:shadow-sm dark:shadow-none">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-200">Recent Folders</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400 space-x-4">
              <button className="hover:text-gray-700 dark:hover:text-white transition-colors">Todays</button>
              <button className="text-gray-700 dark:text-white font-medium border-b-2 border-orange-400 dark:border-blue-500 pb-1">This Week</button>
              <button className="hover:text-gray-700 dark:hover:text-white transition-colors">This Month</button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {loading ? (
              <p className="text-gray-500 dark:text-gray-400">Loading...</p>
            ) : (
              folders.map((folder) => (
                <div key={folder.id} onClick={() => setSelectedFolderId(folder.id)}>
                  <FolderCard
                    title={folder.name}
                    date={new Date(folder.created_at).toLocaleDateString()}
                    color={folder.color || 'bg-blue-100'}
                    mousePos={mousePos}
                  />
                </div>
              ))
            )}
            <NewItemCard type="folder" onClick={() => setIsCreateFolderModalOpen(true)} mousePos={mousePos} />
          </div>
        </section>

        <section className="bg-white/80 dark:bg-transparent rounded-2xl py-6 xl:px-6 border border-orange-200 dark:border-transparent lg:shadow-sm dark:shadow-none">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-200">
              {selectedFolderId ? `Notes in ${folders.find(f => f.id === selectedFolderId)?.name || 'Folder'}` : 'All Notes'}
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400 space-x-4">
              {selectedFolderId && (
                <button onClick={() => setSelectedFolderId(null)} className="hover:text-gray-700 dark:hover:text-white transition-colors bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-xs font-semibold mr-2">
                  Clear Filter
                </button>
              )}
              <button className="hover:text-gray-700 dark:hover:text-white transition-colors">Todays</button>
              <button className="text-gray-700 dark:text-white font-medium border-b-2 border-orange-400 dark:border-blue-500 pb-1">This Week</button>
              <button className="hover:text-gray-700 dark:hover:text-white transition-colors">This Month</button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {loading ? (
              <p className="text-gray-500 dark:text-gray-400">Loading...</p>
            ) : (
              notes
                .filter(note => selectedFolderId ? note.folder_id === selectedFolderId : true)
                .map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onDelete={handleDeleteNote}
                    onEdit={setEditingNote}
                    mousePos={mousePos}
                  />
                ))
            )}
            <NewItemCard type="note" onClick={handleCreateNote} mousePos={mousePos} />
          </div>
        </section>
      </div>

      {editingNote && (
        <EditNoteModal
          note={editingNote}
          folders={folders}
          onSave={handleUpdateNote}
          onClose={() => setEditingNote(null)}
        />
      )}

      {isCreateFolderModalOpen && (
        <CreateFolderModal
          onSave={handleCreateFolder}
          onClose={() => setIsCreateFolderModalOpen(false)}
        />
      )}
    </main>
  )
};

export default NotesPage;

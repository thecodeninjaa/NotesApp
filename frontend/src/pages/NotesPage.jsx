import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { FiSearch, FiUser, FiMenu, FiMoreHorizontal, FiFolder, FiFileText, FiClock, FiLogOut, FiEdit, FiPlus, FiCalendar, FiArchive, FiTrash2, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import EditNoteModal from '../components/EditNoteModal';
import FolderCard from '../components/FolderCard';
import NewItemCard from '../components/NewItemCard';

const NoteCard = ({ note, onDelete, onEdit }) => (
  <div className={`p-4 rounded-lg shadow bg-yellow-100 min-h-[200px] flex flex-col`}>
    <div className="flex justify-between items-start mb-2">
      <p className="text-xs text-gray-600 mb-1">{new Date(note.created_at).toLocaleDateString()}</p>
      <div>
        <button onClick={() => onEdit(note)} className="text-gray-500 hover:text-gray-800 mr-2">
          <FiEdit />
        </button>
        <button onClick={() => onDelete(note.id)} className="text-gray-500 hover:text-gray-800">
          <FiMoreHorizontal />
        </button>
      </div>
    </div>
    <h4 className="font-semibold mb-2 text-gray-800">{note.title}</h4>
    <p className="text-sm text-gray-700 flex-grow mb-3">{note.content}</p>
    <div className="flex items-center text-xs text-gray-600 mt-auto">
      <FiClock className="mr-1" /> Sunday
    </div>
  </div>
);

function Sidebar({ isCollapsed, toggleSidebar }) {
  return (
    <div
      className={`bg-white flex flex-col border-r border-gray-200 transition-all duration-300 ease-in-out relative ${isCollapsed ? 'w-20 p-3' : 'w-64 p-6'}`}
    >
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-9 z-10 p-1 bg-white border border-gray-300 rounded-full shadow-md text-gray-600 hover:bg-gray-100 transition"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <FiChevronsRight size={18} /> : <FiChevronsLeft size={18} />}
      </button>

      <div className={`text-2xl font-bold text-blue-600 mb-6 ${isCollapsed ? 'text-center text-xl' : ''}`}>
        {isCollapsed ? 'M' : 'MINO'}
      </div>

      <button className={`w-full flex items-center justify-center bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition mb-6 ${isCollapsed ? 'px-2' : ''}`}>
        <FiPlus className={`${!isCollapsed ? 'mr-2' : ''}`} />
        {!isCollapsed && 'Add new'}
      </button>

      {!isCollapsed && (
        <div className="flex space-x-2 mb-6">
          <span className="w-4 h-4 bg-red-400 rounded-full"></span>
          <span className="w-4 h-4 bg-blue-400 rounded-full"></span>
          <span className="w-4 h-4 bg-green-400 rounded-full"></span>
        </div>
      )}

      <nav className="flex-grow">
        <ul className="space-y-2">
          <li>
            <Link to="/calendar" className={`flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded ${isCollapsed ? 'justify-center' : ''}`}>
              <FiCalendar className={`${!isCollapsed ? 'mr-3' : ''}`} /> {!isCollapsed && 'Calendar'}
            </Link>
          </li>
          <li>
            <Link to="/archive" className={`flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded ${isCollapsed ? 'justify-center' : ''}`}>
              <FiArchive className={`${!isCollapsed ? 'mr-3' : ''}`} /> {!isCollapsed && 'Archive'}
            </Link>
          </li>
          <li>
            <Link to="/trash" className={`flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded ${isCollapsed ? 'justify-center' : ''}`}>
              <FiTrash2 className={`${!isCollapsed ? 'mr-3' : ''}`} /> {!isCollapsed && 'Trash'}
            </Link>
          </li>
        </ul>
      </nav>

      {!isCollapsed && (
        <div className="mt-auto p-4 bg-gray-50 rounded-lg text-center">
          <div className="text-sm text-gray-600 mb-2">Want unlimited notes?</div>
          <div className="w-20 h-20 bg-gray-300 mx-auto mb-3 rounded-full"></div>
          <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition text-sm">
            Upgrade Pro
          </button>
        </div>
      )}
    </div>
  );
}


function NotesPage({ session }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex w-full h-screen bg-gray-100">
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="bg-white shadow-sm p-4 w-full flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">MY NOTES</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="bg-gray-100 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">{session?.user?.email}</span>
              <FiUser className="text-gray-600" />
            </div>
            <button onClick={handleLogout} className="text-gray-600">
              <FiLogOut size={24} />
            </button>
          </div>
        </div>

        <div className="w-full p-6 space-y-8">
          <section className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Recent Folders</h2>
              <div className="text-sm text-gray-500 space-x-4">
                <button className="hover:text-gray-800">Todays</button>
                <button className="text-gray-800 font-medium border-b-2 border-blue-500 pb-1">This Week</button>
                <button className="hover:text-gray-800">This Month</button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <FolderCard title="Movie Review" date="12/12/2021" color="bg-blue-100" />
              <FolderCard title="Class Notes" date="12/12/2021" color="bg-red-100" />
              <FolderCard title="Book Lists" date="12/12/2021" color="bg-yellow-100" />
              <NewItemCard type="folder" />
            </div>
          </section>

          <section className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">My Notes</h2>
              <div className="text-sm text-gray-500 space-x-4">
                <button className="hover:text-gray-800">Todays</button>
                <button className="text-gray-800 font-medium border-b-2 border-blue-500 pb-1">This Week</button>
                <button className="hover:text-gray-800">This Month</button>
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
      </main>

      {editingNote && (
        <EditNoteModal
          note={editingNote}
          onSave={handleUpdateNote}
          onClose={() => setEditingNote(null)}
        />
      )}
    </div>
  );
}

export default NotesPage;

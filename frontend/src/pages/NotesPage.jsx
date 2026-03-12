
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { FiSearch, FiUser, FiTrash2, FiClock, FiLogOut, FiEdit, FiFileText } from 'react-icons/fi';
import EditNoteModal from '../components/EditNoteModal';
import FolderCard from '../components/FolderCard';
import NewItemCard from '../components/NewItemCard';
import CreateFolderModal from '../components/CreateFolderModal';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSkeleton from '../components/LoadingSkeleton';

const NoteCard = ({ note, onDelete, onEdit, mousePos }) => {
  const [rect, setRect] = useState(null);
  const cardRef = useRef(null);

  const handleMouseEnter = () => {
    if (cardRef.current) {
      setRect(cardRef.current.getBoundingClientRect());
    }
  };

  return (
    <div ref={cardRef} onMouseEnter={handleMouseEnter} className="relative group cursor-pointer transition-transform duration-300 hover:scale-[1.02]">
      {/* === LIGHT MODE: BEHIND-CARD GLOW (like floating above a light) === */}
      {/* Wide soft haze behind the card */}
      <div className="absolute -inset-x-2 -bottom-4 top-[30%] rounded-[2rem] bg-amber-400/60 blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500 dark:hidden pointer-events-none" />
      {/* Intense bright bottom edge glow peeking out from under */}
      <div className="absolute bottom-0 left-[5%] right-[5%] h-[6px] rounded-full bg-amber-400 blur-[4px] opacity-70 group-hover:opacity-90 transition-opacity duration-500 dark:hidden pointer-events-none" />


      {/* === THE CARD (solid opaque surface) === */}
      <div
        onClick={() => onEdit(note)}
        className="relative w-full h-[220px] rounded-[2rem] overflow-hidden flex flex-col
          border border-gray-200/80 dark:border-white/10
          bg-gradient-to-b from-white to-gray-50 dark:from-transparent dark:to-transparent
          dark:bg-[#0f0f0f]/80
          backdrop-blur-xl
          shadow-[0_2px_8px_rgba(0,0,0,0.06)]
          dark:shadow-none
          p-6"
      >
        {/* Proximity Glow (inside card so it's visible) */}
        {mousePos && rect && (
          <div
            className="absolute inset-0 rounded-[2rem] pointer-events-none transition-opacity duration-300 hidden dark:block"
            style={{
              background: `radial-gradient(800px circle at ${mousePos.x - rect.left}px ${mousePos.y - rect.top}px, rgba(234, 88, 12, 0.15), transparent 40%)`
            }}
          />
        )}
        {mousePos && rect && (
          <div
            className="absolute inset-0 rounded-[2rem] pointer-events-none transition-opacity duration-300 block dark:hidden z-[1]"
            style={{
              background: `radial-gradient(600px circle at ${mousePos.x - rect.left}px ${mousePos.y - rect.top}px, rgba(245, 158, 11, 0.12), transparent 40%)`
            }}
          />
        )}
        {/* Light Mode: Subtle top edge highlight */}
        <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent dark:hidden pointer-events-none" />

        {/* Dark Mode: Bottom glow haze */}
        <div className="absolute -bottom-6 left-0 right-0 h-28 bg-gradient-to-t from-orange-600 to-transparent opacity-60 blur-2xl group-hover:opacity-90 transition-opacity duration-500 pointer-events-none hidden dark:block" />
        {/* Dark Mode: Bottom border line */}
        <div className="absolute bottom-0 left-[0%] right-[0%] h-[3px] bg-orange-400 blur-[1px] opacity-80 group-hover:opacity-100 group-hover:shadow-[0_0_20px_var(--tw-shadow-color)] shadow-orange-400 transition-all duration-500 pointer-events-none hidden dark:block" />

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <div className="relative w-12 h-12 rounded-2xl bg-amber-50 dark:bg-black border border-amber-200/60 dark:border-orange-500/30 flex items-center justify-center shadow-[0_2px_8px_rgba(245,180,60,0.15)] dark:shadow-[0_8px_16px_rgba(0,0,0,0.6),0_0_20px_rgba(234,88,12,0.2)] overflow-hidden group/icon transition-all">
              {/* Dark Mode: Intense top edge light reflection */}
              <div className="absolute top-0 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-orange-200 to-transparent opacity-0 dark:opacity-100 drop-shadow-[0_0_5px_rgba(251,146,60,1)]" />
              {/* Dark Mode: Soft inner top gradient blur */}
              <div className="absolute inset-0 bg-gradient-to-b from-orange-500/40 via-transparent to-transparent opacity-0 dark:opacity-100 pointer-events-none blur-[2px]" />
              <FiFileText className="relative z-10 text-amber-600 dark:text-orange-50 drop-shadow-none dark:drop-shadow-[0_0_12px_rgba(251,146,60,1)]" size={22} />
            </div>
            <div onClick={(e) => e.stopPropagation()} className="flex gap-1 -mr-2 -mt-2">
              <button onClick={() => onEdit(note)} className="p-2 text-gray-400 hover:text-amber-600 dark:text-gray-500 dark:hover:text-white transition-colors">
                <FiEdit size={18} />
              </button>
              <button onClick={() => onDelete(note.id)} className="p-2 text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-500 transition-colors">
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>

          <div className="mt-auto relative z-10">
            <h4 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white tracking-tight line-clamp-1">{note.title}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
              {note.content || "Empty note"}
            </p>
            <div className="text-gray-600 dark:text-white text-sm font-medium mt-auto flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
              Open note <span className="ml-1">→</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

const SearchBar = ({ mousePos, value, onChange }) => {
  const [rect, setRect] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      setRect(containerRef.current.getBoundingClientRect());
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center w-full max-w-[320px] focus-within:max-w-[400px] transition-all duration-300 group/search"
    >
      <div className="relative w-full flex items-center bg-white/60 dark:bg-black/40 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-full shadow-inner overflow-hidden focus-within:bg-white/90 dark:focus-within:bg-white/5 focus-within:border-orange-500/50 focus-within:shadow-[0_0_15px_rgba(249,115,22,0.1)] dark:focus-within:shadow-[0_0_15px_rgba(249,115,22,0.3)]">
        {/* Inner top light reflection */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/30 to-transparent pointer-events-none opacity-50 group-focus-within/search:opacity-100 transition-opacity duration-300" />

        {/* Proximity Glow from mouse tracking */}
        {mousePos && rect && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-60 group-hover/search:opacity-100 hidden dark:block"
            style={{
              background: `radial-gradient(800px circle at ${mousePos.x - rect.left}px ${mousePos.y - rect.top}px, rgba(234, 88, 12, 0.15), transparent 40%)`
            }}
          />
        )}
        {mousePos && rect && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-60 group-hover/search:opacity-100 block dark:hidden"
            style={{
              background: `radial-gradient(800px circle at ${mousePos.x - rect.left}px ${mousePos.y - rect.top}px, rgba(234, 88, 12, 0.05), transparent 40%)`
            }}
          />
        )}

        {/* Heavy bottom inner glow haze */}
        <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-gradient-to-t from-orange-600 to-transparent opacity-10 dark:opacity-40 blur-lg group-hover/search:opacity-30 dark:group-hover/search:opacity-60 transition-opacity duration-500 pointer-events-none" />

        {/* Intense bright bottom border line */}
        <div className="absolute bottom-0 left-[0%] right-[0%] h-[2px] bg-orange-400 blur-[1px] opacity-40 dark:opacity-80 group-focus-within/search:opacity-80 dark:group-focus-within/search:opacity-100 group-focus-within/search:shadow-[0_0_20px_var(--tw-shadow-color)] shadow-orange-400 transition-all duration-500 pointer-events-none" />

        <FiSearch className="absolute left-4 text-gray-400 dark:text-gray-400 group-focus-within/search:text-orange-500 dark:group-focus-within/search:text-orange-400 transition-colors z-10" />
        <input
          type="text"
          placeholder="Search notes and folders..."
          value={value}
          onChange={onChange}
          className="w-full bg-transparent py-2.5 pl-11 pr-4 outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 relative z-10 text-sm"
        />
      </div>
    </div>
  );
};

// ─── Time Filter Bar ───
const timeFilterOptions = [
  { key: 'all', label: 'All' },
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
];

const TimeFilterBar = ({ active, onChange }) => {
  const activeClass = "relative px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold text-orange-600 dark:text-white bg-white dark:bg-white/10 border border-transparent dark:border-white/20 shadow-sm dark:shadow-[0_0_15px_rgba(255,255,255,0.1)] overflow-hidden text-center";
  const inactiveClass = "px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-white/5 transition-all text-center";

  return (
    <div className="flex bg-orange-100/50 dark:bg-black/40 backdrop-blur-md border border-orange-200 dark:border-white/10 rounded-full p-1 shadow-inner">
      {timeFilterOptions.map(opt => (
        <button
          key={opt.key}
          onClick={() => onChange(active === opt.key ? 'all' : opt.key)}
          className={active === opt.key ? activeClass : inactiveClass}
        >
          {active === opt.key && (
            <div className="hidden dark:block absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-4 bg-white/40 blur-[6px] rounded-full" />
          )}
          <span className="relative z-10">{opt.label}</span>
        </button>
      ))}
    </div>
  );
};

const filterByTime = (items, filter) => {
  if (filter === 'all') return items;
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return items.filter(item => {
    const created = new Date(item.created_at);
    if (filter === 'today') return created >= startOfToday;
    if (filter === 'week') {
      const weekAgo = new Date(startOfToday);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return created >= weekAgo;
    }
    if (filter === 'month') {
      const monthAgo = new Date(startOfToday);
      monthAgo.setDate(monthAgo.getDate() - 30);
      return created >= monthAgo;
    }
    return true;
  });
};

function NotesPage({ session, mousePos }) {
  // ... existing state ...
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [folderTimeFilter, setFolderTimeFilter] = useState('all');
  const [noteTimeFilter, setNoteTimeFilter] = useState('all');
  const [noteToDelete, setNoteToDelete] = useState(null);

  useEffect(() => {
    fetchData();

    // Listen to sidebar events
    const onAddNoteEvent = () => handleCreateNote();
    const onAddFolderEvent = () => setIsCreateFolderModalOpen(true);

    window.addEventListener('noteflow:add-note', onAddNoteEvent);
    window.addEventListener('noteflow:add-folder', onAddFolderEvent);

    return () => {
      window.removeEventListener('noteflow:add-note', onAddNoteEvent);
      window.removeEventListener('noteflow:add-folder', onAddFolderEvent);
    };
  }, [selectedFolderId]);

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

  const handleDeleteNote = (noteId) => {
    const note = notes.find(n => n.id === noteId);
    setNoteToDelete(note);
  };

  const confirmDeleteNote = async () => {
    if (!noteToDelete) return;
    
    const { error } = await supabase.from('Notes').delete().eq('id', noteToDelete.id);
    if (error) {
      console.error('Error deleting note:', error);
    } else {
      setNotes(notes.filter((note) => note.id !== noteToDelete.id));
    }
    setNoteToDelete(null);
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

  // Wrap handleCreateNote in useCallback or don't put it in dependency array if not using it there, 
  // but since we are accessing selectedFolderId, we need latest closures. 
  // Above we passed `[selectedFolderId]` to useEffect so the event listener always has the latest selection.
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
      className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent group/board relative"
    >
      {/* Top Bar Navigation */}
      <div className="sticky top-0 z-50 px-6 w-full h-20 flex items-center justify-between bg-white/70 dark:bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        {/* Left: Title */}
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400 dark:from-orange-400 dark:to-orange-200 drop-shadow-sm dark:drop-shadow-[0_0_10px_rgba(249,115,22,0.8)] tracking-wide">
          MY NOTES
        </h1>

        {/* Center: Search Bar */}
        <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-md flex justify-center z-20">
          <SearchBar mousePos={mousePos} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>

        {/* Right: User & Logout */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3 bg-gray-100/60 dark:bg-black/40 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-full py-1.5 px-4 shadow-inner">
            <FiUser className="text-gray-500 dark:text-gray-400" size={16} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{session?.user?.email}</span>
          </div>

          <button onClick={handleLogout} className="relative p-2.5 rounded-full bg-gray-100/60 dark:bg-black/40 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:border-rose-300 dark:hover:border-rose-500/30 transition-all shadow-inner group/logout hover:shadow-[0_0_15px_rgba(244,63,94,0.1)] dark:hover:shadow-[0_0_15px_rgba(244,63,94,0.3)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-[1px] bg-gradient-to-r from-transparent via-white dark:via-white/30 to-transparent opacity-0 group-hover/logout:opacity-100 transition-opacity" />
            <FiLogOut size={20} className="relative z-10" />
          </button>
        </div>
      </div>

      <div className="w-full p-6 space-y-8">
        <section className="bg-white/80 dark:bg-transparent rounded-2xl py-6 xl:px-6 border border-orange-200 dark:border-transparent lg:shadow-sm dark:shadow-none">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-200">Recent Folders</h2>
            <TimeFilterBar active={folderTimeFilter} onChange={setFolderTimeFilter} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {loading ? (
              <LoadingSkeleton count={4} type="folder" />
            ) : (
              filterByTime(
                folders.filter(folder => folder.name.toLowerCase().includes(searchQuery.toLowerCase())),
                folderTimeFilter
              ).map((folder) => (
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
            <div className="flex items-center">
              {selectedFolderId && (
                <button onClick={() => setSelectedFolderId(null)} className="relative px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold text-gray-700 dark:text-white bg-red-100 dark:bg-red-500/20 border border-transparent dark:border-red-500/30 hover:bg-red-200 dark:hover:bg-red-500/40 transition-all text-center flex items-center justify-center mr-3 shadow-sm dark:shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                  Clear Filter
                </button>
              )}
              <TimeFilterBar active={noteTimeFilter} onChange={setNoteTimeFilter} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {loading ? (
              <LoadingSkeleton count={5} type="note" />
            ) : (
              filterByTime(
                notes
                  .filter(note => selectedFolderId ? note.folder_id === selectedFolderId : true)
                  .filter(note => note.title.toLowerCase().includes(searchQuery.toLowerCase())),
                noteTimeFilter
              )
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

      <ConfirmModal
        isOpen={!!noteToDelete}
        title="Delete Note"
        message={`Are you sure you want to delete "${noteToDelete?.title}"? This action cannot be undone.`}
        onConfirm={confirmDeleteNote}
        onCancel={() => setNoteToDelete(null)}
      />
    </main>
  )
};

export default NotesPage;

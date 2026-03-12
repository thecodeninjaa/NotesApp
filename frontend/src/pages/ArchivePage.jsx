import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { FiSearch, FiArchive, FiTrash2, FiFileText, FiRefreshCcw } from 'react-icons/fi';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSkeleton from '../components/LoadingSkeleton';

const ArchiveNoteCard = ({ note, onUnarchive, onDelete, mousePos }) => {
  const [rect, setRect] = useState(null);
  const cardRef = useRef(null);

  const handleMouseEnter = () => {
    if (cardRef.current) {
      setRect(cardRef.current.getBoundingClientRect());
    }
  };

  return (
    <div ref={cardRef} onMouseEnter={handleMouseEnter} className="relative group cursor-pointer transition-transform duration-300 hover:scale-[1.02]">
      {/* Light Mode: BEHIND-CARD GLOW */}
      <div className="absolute -inset-x-2 -bottom-4 top-[30%] rounded-[2rem] bg-indigo-400/60 blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500 dark:hidden pointer-events-none" />
      <div className="absolute bottom-0 left-[5%] right-[5%] h-[6px] rounded-full bg-indigo-400 blur-[4px] opacity-70 group-hover:opacity-90 transition-opacity duration-500 dark:hidden pointer-events-none" />

      {/* THE CARD */}
      <div
        className="relative w-full h-[220px] rounded-[2rem] overflow-hidden flex flex-col
          border border-gray-200/80 dark:border-white/10
          bg-gradient-to-b from-white to-gray-50 dark:from-transparent dark:to-transparent
          dark:bg-[#0f0f0f]/80
          backdrop-blur-xl
          shadow-[0_2px_8px_rgba(0,0,0,0.06)]
          dark:shadow-none
          p-6"
      >
        {/* Proximity Glow */}
        {mousePos && rect && (
          <div
            className="absolute inset-0 rounded-[2rem] pointer-events-none transition-opacity duration-300 hidden dark:block"
            style={{
              background: `radial-gradient(800px circle at ${mousePos.x - rect.left}px ${mousePos.y - rect.top}px, rgba(99, 102, 241, 0.15), transparent 40%)`
            }}
          />
        )}
        {mousePos && rect && (
          <div
            className="absolute inset-0 rounded-[2rem] pointer-events-none transition-opacity duration-300 block dark:hidden z-[1]"
            style={{
              background: `radial-gradient(600px circle at ${mousePos.x - rect.left}px ${mousePos.y - rect.top}px, rgba(99, 102, 241, 0.12), transparent 40%)`
            }}
          />
        )}

        {/* Dark Mode: Bottom glow haze */}
        <div className="absolute -bottom-6 left-0 right-0 h-28 bg-gradient-to-t from-indigo-600 to-transparent opacity-60 blur-2xl group-hover:opacity-90 transition-opacity duration-500 pointer-events-none hidden dark:block" />
        {/* Dark Mode: Bottom border line */}
        <div className="absolute bottom-0 left-[0%] right-[0%] h-[3px] bg-indigo-500 blur-[1px] opacity-80 group-hover:opacity-100 group-hover:shadow-[0_0_20px_var(--tw-shadow-color)] shadow-indigo-500 transition-all duration-500 pointer-events-none hidden dark:block" />

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <div className="relative w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-black border border-indigo-200/60 dark:border-indigo-500/30 flex items-center justify-center shadow-[0_2px_8px_rgba(99,102,241,0.15)] dark:shadow-[0_8px_16px_rgba(0,0,0,0.6),0_0_20px_rgba(79,70,229,0.2)] overflow-hidden transition-all">
              <FiFileText className="relative z-10 text-indigo-600 dark:text-indigo-50 drop-shadow-none dark:drop-shadow-[0_0_12px_rgba(79,70,229,1)]" size={22} />
            </div>
            {/* Actions */}
            <div onClick={(e) => e.stopPropagation()} className="flex gap-1 -mr-2 -mt-2">
              <button 
                onClick={() => onUnarchive(note.id)} 
                title="Unarchive Note"
                className="p-2 text-gray-400 hover:text-amber-600 dark:text-gray-500 dark:hover:text-amber-400 transition-colors"
              >
                <FiRefreshCcw size={18} />
              </button>
              <button 
                onClick={() => onDelete(note.id)} 
                title="Move to Trash"
                className="p-2 text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-500 transition-colors"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>

          <div className="mt-auto relative z-10 opacity-70">
            <h4 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white tracking-tight line-clamp-1">{note.title}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
              {note.content || "Empty note"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
};

const ArchivePage = ({ session, mousePos }) => {
  const [archivedNotes, setArchivedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [noteToDelete, setNoteToDelete] = useState(null);

  useEffect(() => {
    fetchArchivedNotes();
  }, []);

  const fetchArchivedNotes = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('Notes')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_archived', true)
        .neq('is_trashed', true)
        .order('created_at', { ascending: false });

      if (error) console.error('Error fetching archived notes:', error);
      else setArchivedNotes(data || []);
    }
    setLoading(false);
  };

  const handleUnarchiveNote = async (noteId) => {
    const { error } = await supabase
      .from('Notes')
      .update({ is_archived: false })
      .eq('id', noteId);

    if (error) {
      console.error('Error unarchiving note:', error);
    } else {
      setArchivedNotes(archivedNotes.filter(n => n.id !== noteId));
    }
  };

  const confirmDeleteNote = async () => {
    if (!noteToDelete) return;
    
    // Move to trash
    const { error } = await supabase
      .from('Notes')
      .update({ is_trashed: true, is_archived: false })
      .eq('id', noteToDelete.id);
      
    if (error) {
      console.error('Error moving archived note to trash:', error);
    } else {
      setArchivedNotes(archivedNotes.filter((note) => note.id !== noteToDelete.id));
    }
    setNoteToDelete(null);
  };

  const filteredNotes = archivedNotes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent group/board relative">
      {/* Top Bar Navigation */}
      <div className="sticky top-0 z-50 px-6 w-full h-20 flex items-center justify-between bg-white/70 dark:bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-indigo-400 dark:from-indigo-400 dark:to-indigo-200 drop-shadow-sm dark:drop-shadow-[0_0_10px_rgba(99,102,241,0.8)] tracking-wide flex items-center gap-2">
          ARCHIVE
        </h1>

        <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-md flex justify-center z-20">
          {/* Simple Search Bar for Archive */}
          <div className="relative flex items-center w-full max-w-[320px] focus-within:max-w-[400px] transition-all duration-300">
            <div className="relative w-full flex items-center bg-white/60 dark:bg-black/40 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-full shadow-inner overflow-hidden focus-within:border-indigo-500/50">
               <FiSearch className="absolute left-4 text-gray-400" />
               <input
                 type="text"
                 placeholder="Search archive..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-transparent py-2.5 pl-11 pr-4 outline-none text-gray-800 dark:text-gray-200 text-sm"
               />
            </div>
          </div>
        </div>
        
        <div className="w-24"></div> {/* spacer */}
      </div>

      <div className="w-full p-6 space-y-8">
        <section className="bg-white/80 dark:bg-transparent rounded-2xl py-6 xl:px-6 border border-indigo-200 dark:border-transparent lg:shadow-sm dark:shadow-none">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {loading ? (
              <LoadingSkeleton count={5} type="note" />
            ) : filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <ArchiveNoteCard
                  key={note.id}
                  note={note}
                  onUnarchive={handleUnarchiveNote}
                  onDelete={() => setNoteToDelete(note)}
                  mousePos={mousePos}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-gray-500 dark:text-gray-400">
                <FiArchive size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg">Archive is empty</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <ConfirmModal
        isOpen={!!noteToDelete}
        title="Move to Trash"
        message={`Are you sure you want to move "${noteToDelete?.title}" to the trash?`}
        onConfirm={confirmDeleteNote}
        onCancel={() => setNoteToDelete(null)}
      />
    </main>
  );
};

export default ArchivePage;

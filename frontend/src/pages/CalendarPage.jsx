import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { FiCalendar, FiFileText, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import LoadingSkeleton from '../components/LoadingSkeleton';

// Helper to format dates
const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric'
  }).format(date);
};

const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

const CalendarNoteCard = ({ note, mousePos }) => {
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
      <div className="absolute -inset-x-2 -bottom-4 top-[30%] rounded-[2rem] bg-emerald-400/60 blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500 dark:hidden pointer-events-none" />
      <div className="absolute bottom-0 left-[5%] right-[5%] h-[6px] rounded-full bg-emerald-400 blur-[4px] opacity-70 group-hover:opacity-90 transition-opacity duration-500 dark:hidden pointer-events-none" />

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
              background: `radial-gradient(800px circle at ${mousePos.x - rect.left}px ${mousePos.y - rect.top}px, rgba(16, 185, 129, 0.15), transparent 40%)`
            }}
          />
        )}
        {mousePos && rect && (
          <div
            className="absolute inset-0 rounded-[2rem] pointer-events-none transition-opacity duration-300 block dark:hidden z-[1]"
            style={{
              background: `radial-gradient(600px circle at ${mousePos.x - rect.left}px ${mousePos.y - rect.top}px, rgba(16, 185, 129, 0.12), transparent 40%)`
            }}
          />
        )}

        {/* Dark Mode: Bottom glow haze */}
        <div className="absolute -bottom-6 left-0 right-0 h-28 bg-gradient-to-t from-emerald-600 to-transparent opacity-60 blur-2xl group-hover:opacity-90 transition-opacity duration-500 pointer-events-none hidden dark:block" />
        {/* Dark Mode: Bottom border line */}
        <div className="absolute bottom-0 left-[0%] right-[0%] h-[3px] bg-emerald-500 blur-[1px] opacity-80 group-hover:opacity-100 group-hover:shadow-[0_0_20px_var(--tw-shadow-color)] shadow-emerald-500 transition-all duration-500 pointer-events-none hidden dark:block" />

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <div className="relative w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-black border border-emerald-200/60 dark:border-emerald-500/30 flex items-center justify-center shadow-[0_2px_8px_rgba(16,185,129,0.15)] dark:shadow-[0_8px_16px_rgba(0,0,0,0.6),0_0_20px_rgba(16,185,129,0.2)] overflow-hidden transition-all">
              <FiFileText className="relative z-10 text-emerald-600 dark:text-emerald-50 drop-shadow-none dark:drop-shadow-[0_0_12px_rgba(16,185,129,1)]" size={22} />
            </div>
            
            {/* Time badge */}
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/20 px-2 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/30">
              {new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          <div className="mt-auto relative z-10">
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

const CalendarPage = ({ session, mousePos }) => {
  const [allNotes, setAllNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchAllNotes();
  }, []);

  const fetchAllNotes = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('Notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) console.error('Error fetching notes:', error);
      else setAllNotes(data || []);
    }
    setLoading(false);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isSameDay = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  const getNotesForDate = (date) => {
    return allNotes.filter(note => {
      const noteDate = new Date(note.created_at);
      return isSameDay(noteDate, date);
    });
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month); // 0 (Sun) to 6 (Sat)
    
    const days = [];
    const today = new Date();

    // Padding for empty days at the start of the week
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="p-2 sm:p-4 opacity-0 border border-transparent"></div>);
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected = isSameDay(date, selectedDate);
      const isToday = isSameDay(date, today);
      const dayNotes = getNotesForDate(date);
      const hasNotes = dayNotes.length > 0;

      days.push(
        <div 
          key={day} 
          onClick={() => setSelectedDate(date)}
          className={`
            relative p-2 sm:p-4 min-h-[60px] sm:min-h-[80px] flex flex-col items-center justify-start cursor-pointer rounded-xl transition-all duration-200
            ${isSelected 
                ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-emerald-400' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 border border-transparent'}
            ${isToday && !isSelected ? 'text-orange-500 font-bold' : ''}
          `}
        >
          <span className={`text-sm sm:text-lg font-medium ${isToday && !isSelected ? 'text-orange-500' : ''}`}>
             {day}
          </span>
          
          {/* Activity dots */}
          <div className="flex gap-1 mt-1 sm:mt-2">
            {dayNotes.slice(0, 3).map((note, index) => (
                <div key={index} className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-500'}`} />
            ))}
            {dayNotes.length > 3 && (
                <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/50' : 'bg-emerald-300'}`} />
            )}
          </div>

          {/* Activity count badge - only visible on larger screens */}
          {hasNotes && (
             <div className="hidden sm:block absolute bottom-2 text-[10px] font-semibold opacity-70">
                {dayNotes.length} note{dayNotes.length !== 1 ? 's' : ''}
             </div>
          )}
        </div>
      );
    }

    return days;
  };

  const selectedDayNotes = getNotesForDate(selectedDate);

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent group/board relative flex flex-col lg:flex-row">
      
      {/* LEFT PANEL: CALENDAR GRID */}
      <div className="w-full lg:w-[45%] xl:w-[40%] p-6 flex-shrink-0 border-r border-gray-200/50 dark:border-white/10 relative">
        <div className="sticky top-6">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400 dark:from-emerald-400 dark:to-emerald-200 drop-shadow-sm dark:drop-shadow-[0_0_10px_rgba(16,185,129,0.8)] tracking-wide flex items-center gap-2 mb-8">
              CALENDAR
            </h1>

            <div className="bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-[2rem] p-6 border border-gray-200/50 dark:border-white/10 shadow-lg dark:shadow-none">
                
                {/* Month Navigator */}
                <div className="flex justify-between items-center mb-6">
                  <button 
                    onClick={handlePrevMonth}
                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors"
                  >
                     <FiChevronLeft size={20} />
                  </button>
                  <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    {formatDate(currentDate)}
                  </h2>
                  <button 
                    onClick={handleNextMonth}
                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors"
                  >
                     <FiChevronRight size={20} />
                  </button>
                </div>

                {/* Days of Week Header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider py-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                    {renderCalendarDays()}
                </div>
            </div>
        </div>
      </div>

      {/* RIGHT PANEL: NOTES FOR SELECTED DATE */}
      <div className="flex-1 p-6 lg:p-10 relative">
        <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-2xl shadow-inner border border-emerald-200 dark:border-emerald-500/30">
                {selectedDate.getDate()}
            </div>
            <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  {selectedDate.toLocaleDateString([], { weekday: 'long' })}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(selectedDate)}
                </p>
            </div>
        </div>

        <section className="bg-white/50 dark:bg-transparent rounded-2xl py-6 xl:px-6 border border-emerald-100 dark:border-transparent lg:shadow-sm dark:shadow-none min-h-[400px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              <LoadingSkeleton count={3} type="note" />
            ) : selectedDayNotes.length > 0 ? (
              selectedDayNotes.map((note) => (
                <CalendarNoteCard
                  key={note.id}
                  note={note}
                  mousePos={mousePos}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-gray-400 dark:text-gray-500 flex flex-col items-center">
                <FiCalendar size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg">No notes created on this day.</p>
              </div>
            )}
          </div>
        </section>
      </div>
      
    </main>
  );
};

export default CalendarPage;

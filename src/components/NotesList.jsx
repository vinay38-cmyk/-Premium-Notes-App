import React, { useState } from 'react';
import { Search, Plus, ListTodo, ShoppingBag, StickyNote, FileText } from 'lucide-react';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

export default function NotesList({ 
  notes, 
  selectedNoteId, 
  setSelectedNoteId, 
  onCreateNote 
}) {
  const [search, setSearch] = useState('');
  const [showTypeMenu, setShowTypeMenu] = useState(false);

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  const groupNotes = (notesList) => {
    const groups = {
      Today: [],
      Yesterday: [],
      Older: []
    };

    notesList.forEach(note => {
      const date = parseISO(note.updatedAt);
      if (isToday(date)) groups.Today.push(note);
      else if (isYesterday(date)) groups.Yesterday.push(note);
      else groups.Older.push(note);
    });

    return groups;
  };

  const groups = groupNotes(filteredNotes);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'todo': return <ListTodo size={14} />;
      case 'shopping': return <ShoppingBag size={14} />;
      case 'sticky': return <StickyNote size={14} />;
      default: return <FileText size={14} />;
    }
  };

  const noteTypes = [
    { type: 'text', label: 'Classic Note', icon: <FileText size={16} />, color: 'bg-blue-500' },
    { type: 'todo', label: 'Checklist', icon: <ListTodo size={16} />, color: 'bg-green-500' },
    { type: 'shopping', label: 'Shopping', icon: <ShoppingBag size={16} />, color: 'bg-orange-500' },
    { type: 'sticky', label: 'Sticky', icon: <StickyNote size={16} />, color: 'bg-yellow-500' },
  ];

  return (
    <main className="w-80 bg-white dark:bg-[#1C1C1E] flex flex-col border-r border-gray-200 dark:border-gray-800 shrink-0 relative overflow-hidden z-10 transition-colors duration-200">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-all" size={16} />
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-lg py-2 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-amber-500 transition-all font-medium placeholder:text-gray-400 dark:placeholder:text-gray-600"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {Object.entries(groups).map(([groupName, groupNotes]) => (
          groupNotes.length > 0 && (
            <div key={groupName}>
              <h3 className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50 dark:bg-gray-800/10 border-b border-gray-100/50 dark:border-gray-800/50">{groupName}</h3>
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {groupNotes.map(note => (
                  <motion.button
                    layoutId={note.id}
                    key={note.id}
                    onClick={() => setSelectedNoteId(note.id)}
                    className={`w-full text-left p-4 transition-all relative overflow-hidden group border-l-4 ${
                      selectedNoteId === note.id 
                        ? 'bg-amber-50/50 dark:bg-amber-500/10 border-amber-500' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800 border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h4 className={`font-bold text-sm truncate flex-1 pr-2 ${selectedNoteId === note.id ? 'text-gray-900 dark:text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                        {note.title || 'Untitled Note'}
                      </h4>
                      <span className={selectedNoteId === note.id ? 'text-amber-500' : 'text-gray-400'}>
                        {getTypeIcon(note.type)}
                      </span>
                    </div>
                    <p className={`text-xs line-clamp-1 mt-1 ${selectedNoteId === note.id ? 'text-gray-600 dark:text-gray-400' : 'text-gray-500 dark:text-gray-500'}`}>
                      {note.content || 'No additional text'}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-gray-400 font-medium">{format(parseISO(note.updatedAt), 'h:mm a')}</span>
                      <div className="flex gap-1">
                        {note.categories?.slice(0, 2).map(cat => (
                          <span key={cat} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-[9px] font-bold uppercase tracking-wider border border-gray-200/50 dark:border-gray-700/50">{cat}</span>
                        ))}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )
        ))}
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%]">
        <div className="relative">
          <AnimatePresence>
            {showTypeMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full mb-3 left-0 right-0 bg-white dark:bg-[#2C2C2E] rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-2 overflow-hidden z-50"
              >
                {noteTypes.map((t) => (
                  <button
                    key={t.type}
                    onClick={() => {
                      onCreateNote(t.type);
                      setShowTypeMenu(false);
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left group"
                  >
                    <div className={`p-2 rounded-lg text-white shadow-sm transition-transform group-hover:scale-110 ${t.color}`}>
                      {t.icon}
                    </div>
                    <div>
                      <div className="text-[11px] font-bold dark:text-white uppercase tracking-wider">{t.label}</div>
                      <div className="text-[10px] text-gray-400">Add new {t.type} note</div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            onClick={() => setShowTypeMenu(!showTypeMenu)}
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-amber-500/50 text-gray-800 dark:text-white rounded-xl py-3 px-6 flex items-center justify-between shadow-sm transition-all active:scale-[0.98] font-bold text-xs uppercase tracking-widest"
          >
            <span>Add Note</span>
            <div className={`transition-transform duration-300 text-amber-500 ${showTypeMenu ? 'rotate-180' : ''}`}>
              <Plus size={18} />
            </div>
          </button>
        </div>
      </div>
    </main>
  );
}

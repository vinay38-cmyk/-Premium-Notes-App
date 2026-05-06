import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  Share, 
  CheckCircle2, 
  Circle, 
  Plus, 
  ShoppingBasket,
  Laptop,
  UtilityPole,
  Type
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

const CATEGORY_MAP = {
  food: { color: 'bg-green-500', icon: <ShoppingBasket size={14} /> },
  groceries: { color: 'bg-blue-500', icon: <ShoppingBasket size={14} /> },
  electronics: { color: 'bg-purple-500', icon: <Laptop size={14} /> },
  utilities: { color: 'bg-orange-500', icon: <UtilityPole size={14} /> },
};

const SHOPPING_GROUPS = ['food', 'groceries', 'electronics', 'utilities'];

export default function Editor({ note, onUpdateNote, onDeleteNote }) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [items, setItems] = useState(note.items || []);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setItems(note.items || []);
  }, [note.id]);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    onUpdateNote(note.id, { title: val });
  };

  const handleContentChange = (e) => {
    const val = e.target.value;
    setContent(val);
    onUpdateNote(note.id, { content: val });
  };

  const addItem = (group = null) => {
    const newItem = { id: Date.now().toString(), text: '', completed: false, group };
    const newItems = [...items, newItem];
    setItems(newItems);
    onUpdateNote(note.id, { items: newItems });
  };

  const updateItem = (itemId, updates) => {
    const newItems = items.map(item => item.id === itemId ? { ...item, ...updates } : item);
    setItems(newItems);
    onUpdateNote(note.id, { items: newItems });
  };

  const removeItem = (itemId) => {
    const newItems = items.filter(item => item.id !== itemId);
    setItems(newItems);
    onUpdateNote(note.id, { items: newItems });
  };

  const renderItems = () => {
    if (note.type === 'todo') {
      return (
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-lg max-w-2xl">
          <ul className="space-y-3">
            {items.map(item => (
              <li key={item.id} className="flex items-center gap-3 group">
                <button 
                  onClick={() => updateItem(item.id, { completed: !item.completed })} 
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    item.completed ? 'bg-amber-500 border-amber-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {item.completed && <CheckCircle2 className="text-white" size={12} />}
                </button>
                <input
                  type="text"
                  placeholder="List item..."
                  value={item.text}
                  onChange={(e) => updateItem(item.id, { text: e.target.value })}
                  className={`bg-transparent outline-none flex-1 ${item.completed ? 'line-through text-gray-400' : ''}`}
                />
                <button 
                  onClick={() => removeItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
          <button onClick={() => addItem()} className="flex items-center gap-2 text-amber-500 text-sm font-bold uppercase tracking-wider hover:bg-amber-50 p-2 rounded-lg transition-all">
            <Plus size={16} />
            Add Objective
          </button>
        </div>
      );
    }

    if (note.type === 'shopping') {
      return (
        <div className="space-y-8 pb-20 max-w-2xl">
          {SHOPPING_GROUPS.map(group => {
            const groupItems = items.filter(i => i.group === group);
            return (
              <div key={group} className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-2">
                  {CATEGORY_MAP[group].icon}
                  <span>{group}</span>
                </div>
                {groupItems.map(item => (
                  <div key={item.id} className="flex items-center gap-3 group px-1">
                    <button onClick={() => updateItem(item.id, { completed: !item.completed })} className="text-gray-300">
                      {item.completed ? <CheckCircle2 className="text-green-500" size={18} /> : <Circle size={18} />}
                    </button>
                    <input
                      type="text"
                      placeholder={`Add to ${group}...`}
                      value={item.text}
                      onChange={(e) => updateItem(item.id, { text: e.target.value })}
                      className={`bg-transparent outline-none flex-1 text-base ${item.completed ? 'line-through text-gray-400 italic' : ''}`}
                    />
                    <button onClick={() => removeItem(item.id)} className="opacity-0 group-hover:opacity-100 text-gray-300">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => addItem(group)}
                  className="flex items-center gap-2 text-amber-500 text-[10px] font-bold uppercase tracking-widest hover:text-amber-600"
                >
                  <Plus size={14} />
                  <span>New Item</span>
                </button>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <textarea
        value={content}
        onChange={handleContentChange}
        placeholder="Start typing your note here..."
        className="w-full h-full bg-transparent outline-none resize-none text-gray-700 dark:text-gray-300 leading-relaxed text-lg pb-24 custom-scrollbar"
      />
    );
  };

  return (
    <section className={`flex-1 bg-white dark:bg-[#1C1C1E] flex flex-col transition-colors duration-200 ${note.type === 'sticky' ? 'm-4 rounded-3xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-900/10' : ''}`}>
      <header className="h-14 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4 text-gray-400">
          <button className="hover:text-amber-600 transition-colors"><Plus size={20} /></button>
          <button className="hover:text-amber-600 transition-colors"><Type size={20} /></button>
          <div className="h-6 w-px bg-gray-100 dark:bg-gray-800 mx-2"></div>
          <button className="hover:text-amber-600 font-serif font-bold text-lg">Aa</button>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 hover:text-amber-600 transition-colors">
            <Share size={14} />
            Share
          </button>
          <button 
            onClick={() => onDeleteNote(note.id)}
            className="text-[10px] font-bold text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </header>

      <article className="flex-1 overflow-y-auto no-scrollbar">
        <div className="p-10 max-w-3xl mx-auto w-full">
          <div className="text-center mb-10">
            <time className="text-[11px] font-bold text-gray-300 dark:text-gray-600 uppercase tracking-[.2em]">
              {format(parseISO(note.updatedAt), 'MMMM d, yyyy \at h:mm a')}
            </time>
          </div>
          
          <div className="space-y-6">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Note Title"
              className="w-full text-4xl font-bold tracking-tight text-gray-900 dark:text-white border-none p-0 focus:ring-0 placeholder:text-gray-100 dark:placeholder:text-gray-800"
            />
            
            <div className="h-full">
              {renderItems()}
            </div>
          </div>
        </div>
      </article>

      <footer className="px-10 py-4 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 bg-blue-400"></div>
            <div className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 bg-purple-400 shadow-sm"></div>
          </div>
          <span className="text-[10px] text-gray-400 font-medium">Cloud Sync Protected</span>
        </div>
        <div className="flex items-center gap-3">
          {note.categories?.map(cat => (
            <span key={cat} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-full text-[9px] font-bold uppercase tracking-wider">{cat}</span>
          ))}
          <div className="text-[10px] text-gray-300 dark:text-gray-700 italic">
            Modified recently
          </div>
        </div>
      </footer>
    </section>
  );
}

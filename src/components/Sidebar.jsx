import React, { useState } from 'react';
import { 
  Plus, 
  Folder, 
  Hash, 
  Sun, 
  Moon, 
  Settings,
  FolderPlus,
  Tag
} from 'lucide-react';
import { motion } from 'motion/react';

const CATEGORIES = ['food', 'groceries', 'electronics', 'utilities'];

export default function Sidebar({ 
  folders, 
  activeFolderId, 
  setActiveFolderId, 
  handleCreateFolder,
  activeCategory,
  setActiveCategory,
  isDarkMode,
  setIsDarkMode
}) {
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const submitFolder = (e) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      handleCreateFolder(newFolderName.trim());
      setNewFolderName('');
      setIsAddingFolder(false);
    }
  };

  return (
    <aside className="w-64 bg-[#F0F0F0]/80 backdrop-blur-md flex flex-col border-r border-gray-200 dark:border-gray-800 p-4 shrink-0 shadow-sm z-20">
      <div className="flex items-center justify-between mb-8 px-2">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Notes</h1>
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          {isDarkMode ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-gray-600" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6">
        <section>
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Folders</h3>
            <button 
              onClick={() => setIsAddingFolder(true)}
              className="text-gray-400 hover:text-amber-500"
            >
              <FolderPlus size={14} />
            </button>
          </div>
          
          <nav className="space-y-0.5">
            {folders.map(folder => (
              <button
                key={folder.id}
                onClick={() => {
                  setActiveFolderId(folder.id);
                  setActiveCategory(null);
                }}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-all group ${
                  activeFolderId === folder.id && !activeCategory
                    ? 'bg-amber-100/50 dark:bg-amber-500/20 text-amber-900 dark:text-amber-400 font-medium'
                    : 'text-gray-700 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-800'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Folder size={16} fill={activeFolderId === folder.id && !activeCategory ? "currentColor" : "none"} className="opacity-70" />
                  {folder.name}
                </span>
                {activeFolderId === folder.id && !activeCategory && <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
              </button>
            ))}
          </nav>

          {isAddingFolder && (
            <motion.form 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={submitFolder} 
              className="mt-2 px-3"
            >
              <input
                autoFocus
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name..."
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-2 py-1 text-sm outline-none ring-2 ring-orange-500/20"
                onBlur={() => !newFolderName && setIsAddingFolder(false)}
              />
            </motion.form>
          )}
        </section>

        <section>
          <div className="flex items-center gap-2 px-2 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            <Tag size={12} />
            <span>Categories</span>
          </div>
          <nav className="space-y-0.5">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setActiveFolderId('all');
                }}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm capitalize transition-all ${
                  activeCategory === cat
                    ? 'bg-blue-100/50 dark:bg-blue-500/20 text-blue-900 dark:text-blue-400 font-medium'
                    : 'text-gray-700 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-800'
                }`}
              >
                <Hash size={14} className="opacity-40" />
                {cat}
              </button>
            ))}
          </nav>
        </section>
      </div>

      <div className="mt-auto pt-6 space-y-4">
        <div className="flex items-center gap-3 px-2 py-3 bg-white/40 dark:bg-gray-800/40 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">NA</div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">Notes User</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Personal Cloud</p>
          </div>
        </div>
        
        <button className="w-full flex items-center gap-2 text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors text-xs px-2 mb-2">
          <Settings size={14} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}

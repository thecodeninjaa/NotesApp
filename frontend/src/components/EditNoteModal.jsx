import React, { useState, useEffect } from 'react';

function EditNoteModal({ note, onSave, onClose }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  const handleSave = () => {
    onSave({ ...note, title, content });
  };

  if (!note) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm dark:bg-black/50 overflow-y-auto h-full w-full flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-amber-50 dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-xl mx-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-medium mb-4 text-gray-800 dark:text-gray-200">Edit Note</h2>
        <div className="mb-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full bg-amber-50 dark:bg-gray-700 rounded-lg py-2 px-3 outline-none focus:shadow-lg focus:shadow-orange-300/50 text-gray-800 dark:text-gray-200 border-0 placeholder-gray-400 text-sm font-semibold"
          />
        </div>
        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing..."
            className="w-full bg-amber-50 dark:bg-gray-700 rounded-lg py-2 px-3 outline-none focus:shadow-lg focus:shadow-orange-300/50 text-gray-800 dark:text-gray-200 border-0 placeholder-gray-400 resize-none text-sm"
            rows="8"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white font-medium py-1.5 px-4 rounded-lg transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-1.5 px-4 rounded-lg transition-colors text-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditNoteModal;
import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

const CreateFolderModal = ({ onSave, onClose }) => {
    const [folderName, setFolderName] = useState('');
    const [folderColor, setFolderColor] = useState('bg-blue-100');

    const colorOptions = [
        { value: 'bg-blue-100', label: 'Blue' },
        { value: 'bg-pink-100', label: 'Pink' },
        { value: 'bg-yellow-100', label: 'Yellow' },
        { value: 'bg-green-100', label: 'Green' },
        { value: 'bg-purple-100', label: 'Purple' },
        { value: 'bg-rose-100', label: 'Rose' },
    ];

    const handleSave = () => {
        if (folderName.trim()) {
            onSave(folderName, folderColor);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-fadeIn">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                    <FiX size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Create New Folder</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Folder Name
                        </label>
                        <input
                            type="text"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-blue-500 text-gray-800 dark:text-gray-200"
                            placeholder="e.g. Work Projects"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Color Theme
                        </label>
                        <div className="flex gap-3 flex-wrap">
                            {colorOptions.map((color) => (
                                <button
                                    key={color.value}
                                    onClick={() => setFolderColor(color.value)}
                                    className={`w-8 h-8 rounded-full ${color.value} ${folderColor === color.value ? 'ring-2 ring-offset-2 ring-orange-500 dark:ring-blue-400' : ''} transition-all`}
                                    aria-label={color.label}
                                    type="button"
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!folderName.trim()}
                        className="px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium shadow-sm"
                    >
                        Create Folder
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateFolderModal;

'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface NewMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

const NewMapModal: React.FC<NewMapModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [mapName, setMapName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mapName.trim()) {
      onCreate(mapName.trim());
      setMapName('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Create New Seat Map</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Map Name
            </label>
            <input
              type="text"
              value={mapName}
              onChange={(e) => setMapName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Stadium Section A, Concert Hall"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              disabled={!mapName.trim()}
            >
              Create Map
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewMapModal;


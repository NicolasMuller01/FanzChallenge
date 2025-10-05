'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface EditLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newLabel: string) => void;
  currentLabel: string;
  title: string;
  placeholder: string;
}

const EditLabelModal: React.FC<EditLabelModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentLabel,
  title,
  placeholder,
}) => {
  const [label, setLabel] = useState(currentLabel);

  useEffect(() => {
    if (isOpen) {
      setLabel(currentLabel);
    }
  }, [isOpen, currentLabel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (label.trim()) {
      onSave(label.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
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
              Label
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={placeholder}
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
              disabled={!label.trim()}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLabelModal;


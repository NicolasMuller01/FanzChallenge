'use client';

import React from 'react';
import { 
  Monitor, 
  Table, 
  Coffee, 
  Music, 
  DoorOpen, 
  DoorClosed, 
  Bath, 
  ArrowUpDown,
  Plus,
  Trash2
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface ObjectToolbarProps {
  onAddObject: (type: string) => void;
  onCleanObjects: () => void;
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  selectedObjects: string[];
  totalObjects: number;
}

const ObjectToolbar: React.FC<ObjectToolbarProps> = ({
  onAddObject,
  onCleanObjects,
  selectedTool,
  onToolSelect,
  selectedObjects,
  totalObjects,
}) => {
  const objectTypes = [
    { id: 'screen', icon: Monitor, label: 'Screen', color: 'bg-blue-500' },
    { id: 'table', icon: Table, label: 'Table', color: 'bg-amber-500' },
    { id: 'bar', icon: Coffee, label: 'Bar', color: 'bg-orange-500' },
    { id: 'stage', icon: Music, label: 'Stage', color: 'bg-purple-500' },
    { id: 'entrance', icon: DoorOpen, label: 'Entrance', color: 'bg-green-500' },
    { id: 'exit', icon: DoorClosed, label: 'Exit', color: 'bg-red-500' },
    { id: 'restroom', icon: Bath, label: 'Restroom', color: 'bg-gray-500' },
    { id: 'elevator', icon: ArrowUpDown, label: 'Elevator', color: 'bg-indigo-500' },
  ];

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Plus className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Add Objects</h3>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {objectTypes.map((objectType) => {
          const Icon = objectType.icon;
          return (
            <button
              key={objectType.id}
              onClick={() => onAddObject(objectType.id)}
              className={cn(
                'p-3 rounded-lg border-2 transition-all hover:scale-105 flex flex-col items-center gap-1',
                selectedTool === objectType.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              )}
              title={objectType.label}
            >
              <div className={cn('w-8 h-8 rounded flex items-center justify-center text-white', objectType.color)}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-gray-700">
                {objectType.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Objects Info and Clean Button */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        {/* Objects Info */}


        {/* Clean Objects Button */}
        <button
          onClick={onCleanObjects}
          disabled={selectedObjects.length === 0}
          className={cn(
            "w-full p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2",
            selectedObjects.length > 0
              ? "border-red-200 bg-red-50 hover:bg-red-100 text-red-700"
              : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
          )}
          title={selectedObjects.length > 0 ? `Delete ${selectedObjects.length} selected objects` : "No objects selected"}
        >
          <Trash2 className="w-5 h-5" />
          <span className="text-sm font-medium">
            {selectedObjects.length > 0 
              ? `Delete Selected (${selectedObjects.length})` 
              : "Delete Selected"
            }
          </span>
        </button>
      </div>
    </div>
  );
};

export default ObjectToolbar;

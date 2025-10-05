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
  ArrowUpDown 
} from 'lucide-react';
import { VenueObject as VenueObjectType } from '@/types';
import { cn } from '@/utils/cn';

interface VenueObjectProps {
  object: VenueObjectType;
  isSelected: boolean;
  onSelect: (objectId: string, multiSelect: boolean) => void;
  onMove: (objectId: string, newX: number, newY: number) => void;
  onDoubleClick: (objectId: string) => void;
  selectedTool: string;
}

const VenueObject: React.FC<VenueObjectProps> = ({
  object,
  isSelected,
  onSelect,
  onMove,
  onDoubleClick,
  selectedTool,
}) => {
  const getIcon = () => {
    switch (object.type) {
      case 'screen':
        return <Monitor className="w-6 h-6" />;
      case 'table':
        return <Table className="w-6 h-6" />;
      case 'bar':
        return <Coffee className="w-6 h-6" />;
      case 'stage':
        return <Music className="w-6 h-6" />;
      case 'entrance':
        return <DoorOpen className="w-6 h-6" />;
      case 'exit':
        return <DoorClosed className="w-6 h-6" />;
      case 'restroom':
        return <Bath className="w-6 h-6" />;
      case 'elevator':
        return <ArrowUpDown className="w-6 h-6" />;
      default:
        return <div className="w-6 h-6 bg-gray-400 rounded" />;
    }
  };

  const getColor = () => {
    if (object.color) {
      return `border-2 border-gray-600`;
    }
    
    switch (object.type) {
      case 'screen':
        return 'bg-blue-500 border-blue-600';
      case 'table':
        return 'bg-amber-500 border-amber-600';
      case 'bar':
        return 'bg-orange-500 border-orange-600';
      case 'stage':
        return 'bg-purple-500 border-purple-600';
      case 'entrance':
        return 'bg-green-500 border-green-600';
      case 'exit':
        return 'bg-red-500 border-red-600';
      case 'restroom':
        return 'bg-gray-500 border-gray-600';
      case 'elevator':
        return 'bg-indigo-500 border-indigo-600';
      default:
        return 'bg-gray-500 border-gray-600';
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (selectedTool === 'delete' || selectedTool === 'text') {
      return;
    }
    
    onSelect(object.id, e.ctrlKey || e.metaKey);
    
    // Start dragging
    const startX = e.clientX;
    const startY = e.clientY;
    const startObjectX = object.position.x;
    const startObjectY = object.position.y;
    
    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const newX = startObjectX + deltaX;
      const newY = startObjectY + deltaY;
      onMove(object.id, newX, newY);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDoubleClick(object.id);
  };

  return (
    <div
      className={cn(
        'absolute border-2 rounded-lg flex flex-col items-center justify-center cursor-grab transition-all hover:scale-105',
        getColor(),
        isSelected && 'ring-4 ring-blue-400 ring-opacity-70 shadow-xl transform scale-110',
        selectedTool === 'delete' && 'cursor-not-allowed'
      )}
      style={{
        left: object.position.x,
        top: object.position.y,
        width: object.size.width,
        height: object.size.height,
        backgroundColor: object.color || undefined,
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      title={`${object.label} (${object.type})`}
    >
      <div className="text-white">
        {getIcon()}
      </div>
      <div className="text-xs font-bold text-center mt-1" style={{ color: object.color ? '#000' : '#fff' }}>
        {object.label}
      </div>
    </div>
  );
};

export default VenueObject;


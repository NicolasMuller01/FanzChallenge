'use client';

import React, { useState } from 'react';
import { 
  Move, 
  Group, 
  Trash2, 
  Type,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { templates, Template } from '@/utils/templates';

interface LeftSidebarProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  onTemplateSelect: (templateId: string) => void;
  totalSeats: number;
  totalRows: number;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  selectedTool,
  onToolSelect,
  onTemplateSelect,
  totalSeats,
  totalRows,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  
  const tools = [
    { id: 'move', icon: Move, label: 'Move' },
    { id: 'area-select', icon: Group, label: 'Area Select' },
  ];


  return (
    <div className={cn(
      "bg-white border-r border-gray-200 flex flex-col h-full transition-all duration-300",
      isMinimized ? "w-16" : "w-64"
    )}>
      {/* Header with minimize button */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isMinimized && <h3 className="font-semibold text-gray-900">Panel</h3>}
        <button 
          onClick={() => setIsMinimized(!isMinimized)}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
          title={isMinimized ? "Expandir panel" : "Minimizar panel"}
        >
          {isMinimized ? (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          )}
        </button>
      </div>

      {!isMinimized && (
        <>
          {/* Statistics */}
          <div className="p-4 border-b border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Estadísticas</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Filas
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {totalRows}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Asientos
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {totalSeats}
                </span>
              </div>
            </div>
          </div>

          {/* Tools */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Tools</h3>
            <div className="grid grid-cols-2 gap-2">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => onToolSelect(tool.id)}
                    className={cn(
                      'p-3 rounded-lg border-2 transition-all hover:bg-gray-50 flex flex-col items-center gap-1',
                      selectedTool === tool.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-600'
                    )}
                    title={tool.label}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{tool.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Templates */}
          <div className="flex-1 p-4">
            <h4 className="font-medium text-gray-900 mb-3">Templates</h4>
            <div className="space-y-2">
              {templates.map((template: Template) => (
                <button
                  key={template.id}
                  onClick={() => onTemplateSelect(template.id)}
                  className="w-full p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{template.preview}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-700">
                        {template.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {template.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <p>• Click & drag to move seats within rows</p>
              <p>• Drag rows to reposition entire sections</p>
              <p>• Add objects from the toolbar above</p>
            </div>
          </div>
        </>
      )}

      {/* Minimized state - show only icons */}
      {isMinimized && (
        <div className="flex-1 p-2 space-y-2">
          {/* Tools in minimized state */}
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => onToolSelect(tool.id)}
                className={cn(
                  'w-full p-3 rounded-lg border-2 transition-all hover:bg-gray-50 flex flex-col items-center gap-1',
                  selectedTool === tool.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600'
                )}
                title={tool.label}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;

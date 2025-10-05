'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Download, Upload, FileText, Tag } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SeatMapToolbarProps {
  hasMap: boolean;
  selectedRows: string[];
  selectedSeats: string[];
  onAddRow: () => void;
  onAddSeat: (rowId: string) => void;
  onDeleteRows: () => void;
  onDeleteSeats: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onBatchLabel: () => void;
}

const SeatMapToolbar: React.FC<SeatMapToolbarProps> = ({
  hasMap,
  selectedRows,
  selectedSeats,
  onAddRow,
  onAddSeat,
  onDeleteRows,
  onDeleteSeats,
  onExport,
  onImport,
  onBatchLabel,
}) => {
  const [showAddSeatMenu, setShowAddSeatMenu] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
    }
  };

  const canDeleteRows = hasMap && selectedRows.length > 0;
  const canDeleteSeats = hasMap && selectedSeats.length > 0;
  const canAddSeat = hasMap && selectedRows.length === 1;

  return (
    <div className="bg-white border-b border-gray-200 p-4 flex flex-wrap items-center gap-2">
      {/* Add Row Button */}
      <button
        onClick={onAddRow}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
          'bg-blue-600 text-white hover:bg-blue-700',
          'disabled:bg-gray-300 disabled:cursor-not-allowed'
        )}
        disabled={!hasMap}
      >
        <Plus className="w-4 h-4" />
        Add Row
      </button>

      {/* Add Seat Button */}
      <div className="relative group">
        <button
          onClick={() => setShowAddSeatMenu(!showAddSeatMenu)}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
            'bg-green-600 text-white hover:bg-green-700',
            'disabled:bg-gray-300 disabled:cursor-not-allowed'
          )}
          disabled={!canAddSeat}
          title={!canAddSeat ? "Selecciona una fila primero para agregar asientos" : "Agregar asiento a la fila seleccionada"}
        >
          <Plus className="w-4 h-4" />
          Add Seat
        </button>

        {/* Tooltip */}
        {!canAddSeat && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
            Selecciona una fila primero para agregar asientos
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        )}

        {showAddSeatMenu && canAddSeat && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <button
              onClick={() => {
                onAddSeat(selectedRows[0]);
                setShowAddSeatMenu(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
            >
              Add to selected row
            </button>
          </div>
        )}
      </div>

      {/* Delete Rows Button */}
      <button
        onClick={onDeleteRows}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
          'bg-red-600 text-white hover:bg-red-700',
          'disabled:bg-gray-300 disabled:cursor-not-allowed'
        )}
        disabled={!canDeleteRows}
      >
        <Trash2 className="w-4 h-4" />
        Delete Rows ({selectedRows.length})
      </button>

      {/* Delete Seats Button */}
      <button
        onClick={onDeleteSeats}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
          'bg-red-600 text-white hover:bg-red-700',
          'disabled:bg-gray-300 disabled:cursor-not-allowed'
        )}
        disabled={!canDeleteSeats}
      >
        <Trash2 className="w-4 h-4" />
        Delete Seats ({selectedSeats.length})
      </button>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      {/* Batch Labeling Button */}
      <button
        onClick={onBatchLabel}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
          'bg-purple-600 text-white hover:bg-purple-700',
          'disabled:bg-gray-300 disabled:cursor-not-allowed'
        )}
        disabled={!hasMap}
      >
        <Tag className="w-4 h-4" />
        Batch Label
      </button>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      {/* Export Button */}
      <button
        onClick={onExport}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
          'bg-green-600 text-white hover:bg-green-700',
          'disabled:bg-gray-300 disabled:cursor-not-allowed'
        )}
        disabled={!hasMap}
      >
        <Download className="w-4 h-4" />
        Export JSON
      </button>

      {/* Import Button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
          'bg-blue-600 text-white hover:bg-blue-700'
        )}
      >
        <Upload className="w-4 h-4" />
        Import JSON
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="hidden"
        />
      </button>
    </div>
  );
};

export default SeatMapToolbar;


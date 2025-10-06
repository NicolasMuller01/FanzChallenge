'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { BatchLabelingOptions } from '@/types';
import { cn } from '@/utils/cn';

interface BatchLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (options: BatchLabelingOptions) => void;
  rowCount: number; // Number of selected rows
}

const BatchLabelModal: React.FC<BatchLabelModalProps> = ({
  isOpen,
  onClose,
  onApply,
  rowCount,
}) => {
  const [options, setOptions] = useState<BatchLabelingOptions>({
    rowPrefix: 'Row',
    seatPrefix: 'A',
    startNumber: 1,
    endNumber: rowCount,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(options);
    onClose();
  };

  const handleChange = (field: keyof BatchLabelingOptions, value: string | number) => {
    setOptions(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Batch Labeling</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {rowCount === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-2">
              <X className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay filas seleccionadas</h3>
            <p className="text-sm text-gray-600 mb-4">
              Selecciona una o más filas para aplicar etiquetas en lote.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <div className="mb-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>{rowCount}</strong> {rowCount === 1 ? 'fila seleccionada' : 'filas seleccionadas'} para etiquetar
            </p>
          </div>
        )}

        {rowCount > 0 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Row Prefix
              </label>
              <input
                type="text"
                value={options.rowPrefix}
                onChange={(e) => handleChange('rowPrefix', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Platea, Section"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seat Prefix
              </label>
              <input
                type="text"
                value={options.seatPrefix}
                onChange={(e) => handleChange('seatPrefix', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., A, 1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Number
                </label>
                <input
                  type="number"
                  value={options.startNumber}
                  onChange={(e) => handleChange('startNumber', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Number
                </label>
                <input
                  type="number"
                  value={options.endNumber}
                  onChange={(e) => handleChange('endNumber', parseInt(e.target.value) || rowCount)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-600">
                <strong>Preview:</strong> Las filas seleccionadas serán etiquetadas como "{options.rowPrefix} {options.startNumber}" hasta "{options.rowPrefix} {options.endNumber}"
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Los asientos serán etiquetados como "{options.seatPrefix}1", "{options.seatPrefix}2", etc.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                Aplicar Etiquetas
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BatchLabelModal;


'use client';

import React, { useState, useCallback } from 'react';
import { Plus, FileText } from 'lucide-react';
import { useSeatMap } from '@/hooks/useSeatMap';
import { useTools } from '@/hooks/useTools';
import SeatMapCanvas from '@/components/SeatMapCanvas';
import SeatMapToolbar from '@/components/SeatMapToolbar';
import ObjectToolbar from '@/components/ObjectToolbar';
import LeftSidebar from '@/components/LeftSidebar';
import NewMapModal from '@/components/NewMapModal';
import BatchLabelModal from '@/components/BatchLabelModal';
import EditLabelModal from '@/components/EditLabelModal';
import { BatchLabelingOptions } from '@/types';
import { cn } from '@/utils/cn';

export default function HomePage() {
  const {
    state,
    createNewMap,
    addRow,
    addSeat,
    deleteRow,
    deleteMultipleRows,
    deleteSeat,
    deleteMultipleSeats,
    updateSeat,
    updateRow,
    moveSeat,
    moveRow,
    toggleSeatAvailability,
    applyBatchLabels,
    selectRow,
    selectSeat,
    clearSelection,
    exportMap,
    importMap,
    loadTemplate,
    addObject,
    selectObject,
    moveObject,
    deleteObject,
    deleteSelectedObjects,
    validateAndCleanObjects,
    moveMultipleRows,
    moveMultipleObjects,
    selectMultipleRows,
    selectMultipleObjects,
    clearInitialPositions,
  } = useSeatMap();

  const {
    toolState,
    selectTool,
    startDrawing,
    updateDrawing,
    finishDrawing,
    getCursorStyle,
    canDraw,
    canMove,
    canAreaSelect,
    canDelete,
  } = useTools();

  const [showNewMapModal, setShowNewMapModal] = useState(false);
  const [showBatchLabelModal, setShowBatchLabelModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<{
    type: 'row' | 'seat';
    id: string;
    rowId?: string;
    currentLabel: string;
  } | null>(null);

  const handleCreateNewMap = useCallback((name: string) => {
    createNewMap(name);
  }, [createNewMap]);

  const handleAddRow = useCallback(() => {
    if (!state.currentMap) return;
    
    const rowNumber = state.currentMap.rows.length + 1;
    addRow(`Row ${rowNumber}`, 50, rowNumber < 20 ? 50 * rowNumber : 50 * rowNumber - 20);
  }, [state.currentMap, addRow]);

  const handleAddSeat = useCallback((rowId: string) => {
    if (!state.currentMap) return;
    
    const row = state.currentMap.rows.find(r => r.id === rowId);
    if (!row) return;
    
    const seatNumber = row.seats.length + 1;
    addSeat(rowId, `A${seatNumber}`, 10 + (seatNumber - 1) * 40, 30);
  }, [state.currentMap, addSeat]);

  const handleDeleteRows = useCallback(() => {
    if (!state.currentMap || state.selectedRows.length === 0) return;
    
    if (confirm(`Are you sure you want to delete ${state.selectedRows.length} row(s)?`)) {
      deleteMultipleRows(state.selectedRows);
    }
  }, [state.currentMap, state.selectedRows, deleteMultipleRows]);

  const handleDeleteSeats = useCallback(() => {
    if (!state.currentMap || state.selectedSeats.length === 0) return;
    
    if (confirm(`Are you sure you want to delete ${state.selectedSeats.length} seat(s)?`)) {
      deleteMultipleSeats(state.selectedSeats);
    }
  }, [state.currentMap, state.selectedSeats, deleteMultipleSeats]);

  const handleExport = useCallback(() => {
    if (!state.currentMap) return;
    
    const mapName = prompt('Enter a name for your seat map:');
    if (mapName) {
      exportMap(mapName);
    }
  }, [state.currentMap, exportMap]);

  const handleImport = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      const result = importMap(text);
      
      if (result.success) {
        alert('Seat map imported successfully!');
      } else {
        alert(`Import failed: ${result.error}`);
      }
    } catch (error) {
      alert('Failed to read file. Please try again.');
    }
  }, [importMap]);

  const handleBatchLabel = useCallback((options: BatchLabelingOptions) => {
    applyBatchLabels(options);
  }, [applyBatchLabels]);

  const handleRowClick = useCallback((rowId: string, multiSelect: boolean) => {
    selectRow(rowId, multiSelect);
  }, [selectRow]);

  const handleSeatClick = useCallback((seatId: string, multiSelect: boolean) => {
    selectSeat(seatId, multiSelect);
  }, [selectSeat]);

  const handleCanvasClick = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  const handleSeatMove = useCallback((seatId: string, rowId: string, newX: number, newY: number) => {
    moveSeat(seatId, rowId, newX, newY);
  }, [moveSeat]);

  const handleRowMove = useCallback((rowId: string, newX: number, newY: number) => {
    moveRow(rowId, newX, newY);
  }, [moveRow]);

  const handleRowDoubleClick = useCallback((rowId: string) => {
    const row = state.currentMap?.rows.find(r => r.id === rowId);
    if (row) {
      setShowEditModal({
        type: 'row',
        id: rowId,
        currentLabel: row.label,
      });
    }
  }, [state.currentMap]);

  const handleSeatDoubleClick = useCallback((seatId: string, rowId: string) => {
    // Toggle seat availability on double click
    toggleSeatAvailability(seatId, rowId);
  }, [toggleSeatAvailability]);

  const handleObjectClick = useCallback((objectId: string, multiSelect: boolean) => {
    selectObject(objectId, multiSelect);
  }, [selectObject]);

  const handleObjectMove = useCallback((objectId: string, newX: number, newY: number) => {
    moveObject(objectId, newX, newY);
  }, [moveObject]);

  const handleObjectDoubleClick = useCallback((objectId: string) => {
    // For now, just select the object
    selectObject(objectId, false);
  }, [selectObject]);

  const handleMultipleRowMove = useCallback((rowIds: string[], deltaX: number, deltaY: number) => {
    moveMultipleRows(rowIds, deltaX, deltaY);
  }, [moveMultipleRows]);

  const handleMultipleObjectMove = useCallback((objectIds: string[], deltaX: number, deltaY: number) => {
    moveMultipleObjects(objectIds, deltaX, deltaY);
  }, [moveMultipleObjects]);

  const handleSelectMultipleRows = useCallback((rowIds: string[]) => {
    selectMultipleRows(rowIds);
  }, [selectMultipleRows]);

  const handleSelectMultipleObjects = useCallback((objectIds: string[]) => {
    selectMultipleObjects(objectIds);
  }, [selectMultipleObjects]);

  const handleAreaSelection = useCallback((selectedIds: string[]) => {
    // Separate row IDs and object IDs
    const rowIds = selectedIds
      .filter(id => id.startsWith('row-'))
      .map(id => id.replace('row-', ''));
    
    const objectIds = selectedIds
      .filter(id => id.startsWith('object-'))
      .map(id => id.replace('object-', ''));
    
    
    // Select the found elements
    if (rowIds.length > 0) {
      selectMultipleRows(rowIds);
    }
    if (objectIds.length > 0) {
      selectMultipleObjects(objectIds);
    }
  }, [selectMultipleRows, selectMultipleObjects]);

  const handleAddObject = useCallback((objectType: string) => {
    // Add object at center of canvas
    addObject(objectType, 10, 10);
  }, [addObject]);

  const handleCleanObjects = useCallback(() => {
    deleteSelectedObjects();
  }, [deleteSelectedObjects]);

  const handleSaveLabel = useCallback((newLabel: string) => {
    if (!showEditModal) return;
    
    if (showEditModal.type === 'row') {
      updateRow(showEditModal.id, newLabel);
    } else if (showEditModal.type === 'seat' && showEditModal.rowId) {
      updateSeat(showEditModal.rowId, showEditModal.id, newLabel);
    }
  }, [showEditModal, updateRow, updateSeat]);

  const handleToolSelect = useCallback((tool: string) => {
    selectTool(tool);
  }, [selectTool]);

  const handleTemplateSelect = useCallback((templateId: string) => {
    loadTemplate(templateId);
  }, [loadTemplate]);


  // Calculate validation status
  const totalSeats = state.currentMap?.rows.reduce((acc, row) => acc + row.seats.length, 0) || 0;
  const totalRows = state.currentMap?.rows.length || 0;
  const categories = 3; // Mock categories for now

  const validations = {
    noDuplicates: true, // Mock validation
    allLabeled: state.currentMap?.rows.every(row => 
      row.label && row.seats.every(seat => seat.label)
    ) || false,
    allCategorized: true, // Mock validation
    categoriesOnMultipleTypes: true, // Mock validation
    focalPointSet: true, // Mock validation
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">SeatMapBuilder (Fanz)</h1>
              <p className="text-xs text-gray-600">
                {state.currentMap ? state.currentMap.name : 'No map loaded'}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowNewMapModal(true)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              'bg-blue-600 text-white hover:bg-blue-700'
            )}
          >
            <Plus className="w-4 h-4" />
            New Map
          </button>
        </div>
      </header>

      {/* Toolbar */}
      {state.currentMap && (
        <SeatMapToolbar
          hasMap={!!state.currentMap}
          selectedRows={state.selectedRows}
          selectedSeats={state.selectedSeats}
          onAddRow={handleAddRow}
          onAddSeat={handleAddSeat}
          onDeleteRows={handleDeleteRows}
          onDeleteSeats={handleDeleteSeats}
          onExport={handleExport}
          onImport={handleImport}
          onBatchLabel={() => setShowBatchLabelModal(true)}
        />
      )}

      {/* Object Toolbar */}
      {state.currentMap && (
        <ObjectToolbar
          onAddObject={handleAddObject}
          onCleanObjects={handleCleanObjects}
          selectedTool={toolState.selectedTool}
          onToolSelect={handleToolSelect}
          selectedObjects={state.selectedObjects}
          totalObjects={state.currentMap.objects.length}
        />
      )}


      {/* Main Content */}
      <main className="flex-1 flex">
        {/* Left Sidebar */}
        {state.currentMap && <LeftSidebar
          selectedTool={toolState.selectedTool}
          onToolSelect={handleToolSelect}
          onTemplateSelect={handleTemplateSelect}
          totalSeats={totalSeats}
          totalRows={totalRows}
        />}
        

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-white border border-gray-200 relative overflow-hidden">
            {state.currentMap ? (
              <div className="w-full h-full">
                <SeatMapCanvas
                  rows={state.currentMap.rows}
                  objects={state.currentMap.objects || []}
                  selectedRows={state.selectedRows}
                  selectedSeats={state.selectedSeats}
                  selectedObjects={state.selectedObjects}
                  onRowClick={handleRowClick}
                  onSeatClick={handleSeatClick}
                  onObjectClick={handleObjectClick}
                  onCanvasClick={handleCanvasClick}
                  onSeatMove={handleSeatMove}
                  onRowMove={handleRowMove}
                  onObjectMove={handleObjectMove}
                  onSeatDoubleClick={handleSeatDoubleClick}
                  onObjectDoubleClick={handleObjectDoubleClick}
                  onMultipleRowMove={handleMultipleRowMove}
                  onMultipleObjectMove={handleMultipleObjectMove}
                  onSelectMultipleRows={handleSelectMultipleRows}
                  onSelectMultipleObjects={handleSelectMultipleObjects}
                  onAreaSelection={handleAreaSelection}
                  onClearInitialPositions={clearInitialPositions}
                  selectedTool={toolState.selectedTool}
                  cursorStyle={getCursorStyle()}
                />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎭</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Seat Map Loaded</h3>
                  <p className="text-gray-600 mb-4">Create a new map or import an existing one to get started.</p>
                  <button
                    onClick={() => setShowNewMapModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Create New Map
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <NewMapModal
        isOpen={showNewMapModal}
        onClose={() => setShowNewMapModal(false)}
        onCreate={handleCreateNewMap}
      />

      <BatchLabelModal
        isOpen={showBatchLabelModal}
        onClose={() => setShowBatchLabelModal(false)}
        onApply={handleBatchLabel}
        rowCount={state.selectedRows.length}
      />

      {showEditModal && (
        <EditLabelModal
          isOpen={!!showEditModal}
          onClose={() => setShowEditModal(null)}
          onSave={handleSaveLabel}
          currentLabel={showEditModal.currentLabel}
          title={`Edit ${showEditModal.type === 'row' ? 'Row' : 'Seat'} Label`}
          placeholder={`Enter ${showEditModal.type === 'row' ? 'row' : 'seat'} label`}
        />
      )}
    </div>
  );
}
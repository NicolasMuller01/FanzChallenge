'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Seat, Row, VenueObject } from '@/types';
import { cn } from '@/utils/cn';
import VenueObjectComponent from './VenueObject';
import AreaSelector from './AreaSelector';

interface SeatMapCanvasProps {
  rows: Row[];
  objects: VenueObject[];
  selectedRows: string[];
  selectedSeats: string[];
  selectedObjects: string[];
  onRowClick: (rowId: string, multiSelect: boolean) => void;
  onSeatClick: (seatId: string, multiSelect: boolean) => void;
  onObjectClick: (objectId: string, multiSelect: boolean) => void;
  onCanvasClick: () => void;
  onSeatMove: (seatId: string, rowId: string, newX: number, newY: number) => void;
  onRowMove: (rowId: string, newX: number, newY: number) => void;
  onObjectMove: (objectId: string, newX: number, newY: number) => void;
  onSeatDoubleClick: (seatId: string, rowId: string) => void;
  onObjectDoubleClick: (objectId: string) => void;
  onMultipleRowMove: (rowIds: string[], deltaX: number, deltaY: number) => void;
  onMultipleObjectMove: (objectIds: string[], deltaX: number, deltaY: number) => void;
  onSelectMultipleRows: (rowIds: string[]) => void;
  onSelectMultipleObjects: (objectIds: string[]) => void;
  onAreaSelection: (selectedIds: string[]) => void;
  onClearInitialPositions: () => void;
  selectedTool: string;
  cursorStyle: string;
}

const SeatMapCanvas: React.FC<SeatMapCanvasProps> = ({
  rows,
  objects,
  selectedRows,
  selectedSeats,
  selectedObjects,
  onRowClick,
  onSeatClick,
  onObjectClick,
  onCanvasClick,
  onSeatMove,
  onRowMove,
  onObjectMove,
  onSeatDoubleClick,
  onObjectDoubleClick,
  onMultipleRowMove,
  onMultipleObjectMove,
  onSelectMultipleRows,
  onSelectMultipleObjects,
  onAreaSelection,
  onClearInitialPositions,
  selectedTool,
  cursorStyle,
}) => {
  const [draggedItem, setDraggedItem] = useState<{
    type: 'row' | 'seat' | 'object';
    id: string;
    rowId?: string;
    startX: number;
    startY: number;
    startObjectX?: number;
    startObjectY?: number;
    startRowX?: number;
    startRowY?: number;
  } | null>(null);

  const [selectionArea, setSelectionArea] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((
    e: React.MouseEvent,
    type: 'row' | 'seat' | 'object',
    id: string,
    rowId?: string,
    startObjectX?: number,
    startObjectY?: number
  ) => {
    e.stopPropagation();
    
    console.log("handleMouseDown called:", { type, id, selectedTool, selectedRows, selectedObjects });
    
    // Handle area selection - only for canvas clicks, not element clicks
    if (selectedTool === 'area-select' && type === 'row') {
      // This is a row click during area select - allow dragging
      console.log("Row click during area select - allowing drag");
    } else if (selectedTool === 'area-select') {
      // This is not a row click - handle as area selection
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const startX = e.clientX - rect.left;
        const startY = e.clientY - rect.top;
        setSelectionArea({
          startX,
          startY,
          endX: startX,
          endY: startY,
        });
      }
      return;
    }
    
    // Handle text tool
    if (selectedTool === 'text') {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // For now, just show an alert - you can implement text input here
        const text = prompt('Enter text:');
        if (text) {
          // You can add text object here
          console.log('Adding text:', text, 'at', x, y);
        }
      }
      return;
    }
    
    // Allow dragging with select tool (default) or move tool
    if (selectedTool === 'delete' || selectedTool === 'text') {
      return;
    }
    
    // For rows, store the initial row position
    let startRowX, startRowY;
    if (type === 'row') {
      const row = rows.find(r => r.id === id);
      if (row) {
        startRowX = row.position.x;
        startRowY = row.position.y;
      }
    }
    
    setDraggedItem({
      type,
      id,
      rowId,
      startX: e.clientX,
      startY: e.clientY,
      startObjectX,
      startObjectY,
      startRowX,
      startRowY,
    });
  }, [selectedTool, rows]);

  const handleObjectMouseDown = useCallback((
    e: React.MouseEvent,
    type: 'object',
    id: string,
    startObjectX: number,
    startObjectY: number
  ) => {
    handleMouseDown(e, type, id, undefined, startObjectX, startObjectY);
  }, [handleMouseDown]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    // Handle area selection
    if (selectedTool === 'area-select' && selectionArea) {
      setSelectionArea(prev => prev ? {
        ...prev,
        endX: currentX,
        endY: currentY,
      } : null);
      return;
    }

    if (!draggedItem) return;

    if (draggedItem.type === 'seat' && draggedItem.rowId) {
      // For seats, calculate relative position within the row
      const row = rows.find(r => r.id === draggedItem.rowId);
      if (row) {
        const relativeX = currentX - row.position.x;
        const relativeY = currentY - row.position.y;
        onSeatMove(draggedItem.id, draggedItem.rowId, relativeX, relativeY);
      }
    } else if (draggedItem.type === 'row' && draggedItem.startRowX !== undefined && draggedItem.startRowY !== undefined) {
      // For rows, calculate new position based on mouse movement
      const deltaX = e.clientX - draggedItem.startX;
      const deltaY = e.clientY - draggedItem.startY;
      
      if (selectedTool === 'area-select' && selectedRows.length > 1 && selectedRows.includes(draggedItem.id)) {
        // Move multiple selected rows
        console.log("Moving multiple rows:", selectedRows, "delta:", deltaX, deltaY);
        onMultipleRowMove(selectedRows, deltaX, deltaY);
      } else {
        // Move single row
        const newX = draggedItem.startRowX + deltaX;
        const newY = draggedItem.startRowY + deltaY;
        onRowMove(draggedItem.id, newX, newY);
      }
    } else if (draggedItem.type === 'object' && draggedItem.startObjectX !== undefined && draggedItem.startObjectY !== undefined) {
      // For objects, calculate new position based on mouse movement
      const deltaX = e.clientX - draggedItem.startX;
      const deltaY = e.clientY - draggedItem.startY;
      
      if (selectedTool === 'area-select' && selectedObjects.length > 1 && selectedObjects.includes(draggedItem.id)) {
        // Move multiple selected objects
        console.log("Moving multiple objects:", selectedObjects, "delta:", deltaX, deltaY);
        onMultipleObjectMove(selectedObjects, deltaX, deltaY);
      } else {
        // Move single object
        const newX = draggedItem.startObjectX + deltaX;
        const newY = draggedItem.startObjectY + deltaY;
        onObjectMove(draggedItem.id, newX, newY);
      }
    }
  }, [draggedItem, selectedTool, selectedRows, selectedObjects, onSeatMove, onRowMove, onObjectMove, onMultipleRowMove, onMultipleObjectMove]);

  const handleMouseUp = useCallback(() => {
    if (selectedTool === 'area-select' && selectionArea) {
      // Find elements within the selection area
      const selectedRowIds: string[] = [];
      const selectedObjectIds: string[] = [];
      
      // Calculate selection bounds
      const minX = Math.min(selectionArea.startX, selectionArea.endX);
      const maxX = Math.max(selectionArea.startX, selectionArea.endX);
      const minY = Math.min(selectionArea.startY, selectionArea.endY);
      const maxY = Math.max(selectionArea.startY, selectionArea.endY);
      
      // Check rows
      rows.forEach(row => {
        const rowX = row.position.x;
        const rowY = row.position.y;
        
        if (rowX >= minX && rowX <= maxX && rowY >= minY && rowY <= maxY) {
          selectedRowIds.push(row.id);
        }
      });
      
      // Check objects
      objects.forEach(obj => {
        const objX = obj.position.x;
        const objY = obj.position.y;
        
        if (objX >= minX && objX <= maxX && objY >= minY && objY <= maxY) {
          selectedObjectIds.push(obj.id);
        }
      });
      
      // Select the found elements
      if (selectedRowIds.length > 0) {
        onSelectMultipleRows(selectedRowIds);
      }
      if (selectedObjectIds.length > 0) {
        onSelectMultipleObjects(selectedObjectIds);
      }
      
      setSelectionArea(null);
    }
    
    // Clear initial positions when movement ends
    onClearInitialPositions();
    setDraggedItem(null);
  }, [selectedTool, selectionArea, rows, objects, onSelectMultipleRows, onSelectMultipleObjects, onClearInitialPositions]);

  const handleRowClick = useCallback((e: React.MouseEvent, rowId: string) => {
    e.stopPropagation();
    onRowClick(rowId, e.ctrlKey || e.metaKey);
  }, [onRowClick]);

  const handleSeatClick = useCallback((e: React.MouseEvent, seatId: string) => {
    e.stopPropagation();
    onSeatClick(seatId, e.ctrlKey || e.metaKey);
  }, [onSeatClick]);

  const handleAreaSelection = useCallback((selectedIds: string[]) => {
    // console.log("Area selection changed:", selectedIds);
    onAreaSelection(selectedIds);
  }, [onAreaSelection]);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    console.log("Canvas mouse down - selectedTool:", selectedTool);
    
    // Don't interfere with react-selecto for area-select tool
    if (selectedTool === 'area-select') {
      return;
    }
    
    // Handle text tool on canvas
    if (selectedTool === 'text') {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const text = prompt('Enter text:');
        if (text) {
          console.log('Adding text:', text, 'at', x, y);
        }
      }
      return;
    }
  }, [selectedTool]);

  // Create selectable element IDs as CSS selectors
  const selectableElements = [
    ...rows.map(row => `#row-${row.id}`),
    ...objects.map(obj => `#object-${obj.id}`),
  ];
  
  // Debug info
  console.log("Selectable elements:", selectableElements);
  console.log("Rows count:", rows.length);
  console.log("Objects count:", objects.length);
  console.log("Selected rows:", selectedRows);
  console.log("Selected objects:", selectedObjects);

  return (
    <div
      ref={canvasRef}
      className={cn(
        "relative w-full h-full bg-white overflow-auto min-h-[600px] canvas-container",
        draggedItem ? 'cursor-grabbing' : cursorStyle
      )}
      onClick={selectedTool === 'area-select' ? undefined : onCanvasClick}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Canvas Boundary - Fixed size */}
      <div 
        className="absolute border-2 border-dashed border-gray-400 rounded-lg pointer-events-none"
        style={{
          left: '20px',
          top: '20px',
          width: '1200px',
          height: '800px',
        }}
      >
        <div className="absolute top-2 left-2 text-xs text-gray-500 bg-white px-2 py-1 rounded">
          Canvas Area (1200x800)
        </div>
      </div>

      {/* Selection Area */}
      {selectionArea && (
        <div
          className="absolute border-2 border-blue-500 bg-blue-200 bg-opacity-20 pointer-events-none"
          style={{
            left: Math.min(selectionArea.startX, selectionArea.endX),
            top: Math.min(selectionArea.startY, selectionArea.endY),
            width: Math.abs(selectionArea.endX - selectionArea.startX),
            height: Math.abs(selectionArea.endY - selectionArea.startY),
          }}
        />
      )}


      <AreaSelector
        isActive={selectedTool === 'area-select'}
        onSelectionChange={handleAreaSelection}
        selectableElements={selectableElements}
      >
        {/* Venue Objects */}
        {objects?.map((object) => (
          <div key={object.id} id={`object-${object.id}`}>
            <VenueObjectComponent
              object={object}
              isSelected={selectedObjects.includes(object.id)}
              onSelect={onObjectClick}
              onMove={(objectId, newX, newY) => onObjectMove(objectId, newX, newY)}
              onDoubleClick={onObjectDoubleClick}
              selectedTool={selectedTool}
            />
          </div>
        ))}

        {rows.map((row, rowIndex) => (
          <div
            key={row.id}
            id={`row-${row.id}`}
            className={cn(
              'absolute border-2 border-transparent p-1 rounded-lg cursor-move min-w-[200px] transition-all',
              selectedRows.includes(row.id) 
                ? 'border-blue-500 bg-blue-100 shadow-xl ring-4 ring-blue-400 ring-opacity-70 transform scale-105' 
                : 'hover:border-gray-300 hover:bg-gray-50'
            )}
            style={{
              left: row.position.x,
              top: row.position.y + 60, // Offset for stage
            }}
            onClick={(e) => handleRowClick(e, row.id)}
            onMouseDown={(e) => handleMouseDown(e, 'row', row.id)}
          >
          <div className="font-semibold text-sm mb-3 text-gray-700 text-center">
            {row.label}
          </div>
          <div className="flex flex-wrap gap-1 justify-center">
            {row.seats.map((seat, seatIndex) => (
              <div
                key={seat.id}
                className={cn(
                  'w-8 h-8 border-2 rounded-full flex items-center justify-center text-xs font-bold cursor-grab transition-all hover:scale-110',
                  // Color coding based on availability
                  seat.isAvailable === false
                    ? 'bg-red-500 border-red-600 text-white' // Not available
                    : seat.isAvailable === true
                    ? 'bg-green-500 border-green-600 text-white' // Available
                    : // Default color coding based on row index
                    rowIndex % 3 === 0 
                    ? 'bg-blue-500 border-blue-600 text-white' 
                    : rowIndex % 3 === 1
                    ? 'bg-purple-500 border-purple-600 text-white'
                    : 'bg-indigo-500 border-indigo-600 text-white',
                  selectedSeats.includes(seat.id) && 'ring-4 ring-yellow-400 ring-opacity-50'
                )}
                onClick={(e) => handleSeatClick(e, seat.id)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onSeatDoubleClick(seat.id, row.id);
                }}
                onMouseDown={(e) => handleMouseDown(e, 'seat', seat.id, row.id)}
                title={`${seat.label} - ${seat.isAvailable === false ? 'Not Available' : seat.isAvailable === true ? 'Available' : 'Unknown'} (Double-click to toggle)`}
              >
                {seat.label}
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {rows.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎭</span>
            </div>
            <p className="text-lg font-medium">No rows created yet</p>
            <p className="text-sm">Click "Add Row" to get started</p>
          </div>
        </div>
      )}
      </AreaSelector>
    </div>
  );
};

export default SeatMapCanvas;

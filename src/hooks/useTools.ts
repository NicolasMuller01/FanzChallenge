import { useState, useCallback } from 'react';

export interface ToolState {
  selectedTool: string;
  isDrawing: boolean;
  startPosition: { x: number; y: number } | null;
  currentPosition: { x: number; y: number } | null;
}

export const useTools = () => {
  const [toolState, setToolState] = useState<ToolState>({
    selectedTool: 'move',
    isDrawing: false,
    startPosition: null,
    currentPosition: null,
  });


  const selectTool = useCallback((tool: string) => {
    setToolState(prev => ({
      ...prev,
      selectedTool: tool,
      isDrawing: false,
      startPosition: null,
      currentPosition: null,
    }));
  }, []);

  const startDrawing = useCallback((x: number, y: number) => {
    if (toolState.selectedTool === 'select') return;
    
    setToolState(prev => ({
      ...prev,
      isDrawing: true,
      startPosition: { x, y },
      currentPosition: { x, y },
    }));
  }, [toolState.selectedTool]);

  const updateDrawing = useCallback((x: number, y: number) => {
    if (!toolState.isDrawing) return;
    
    setToolState(prev => ({
      ...prev,
      currentPosition: { x, y },
    }));
  }, [toolState.isDrawing]);

  const finishDrawing = useCallback(() => {
    setToolState(prev => ({
      ...prev,
      isDrawing: false,
      startPosition: null,
      currentPosition: null,
    }));
  }, []);

  const getCursorStyle = useCallback(() => {
    switch (toolState.selectedTool) {
      case 'move':
        return 'cursor-move';
      case 'text':
        return 'cursor-text';
      case 'area-select':
        return 'crosshair';
      case 'delete':
        return 'cursor-not-allowed';
      default:
        return 'cursor-move';
    }
  }, [toolState.selectedTool]);

  const canDraw = useCallback(() => {
    return toolState.selectedTool === 'text';
  }, [toolState.selectedTool]);

  const canMove = useCallback(() => {
    return toolState.selectedTool === 'move';
  }, [toolState.selectedTool]);

  const canAreaSelect = useCallback(() => {
    return toolState.selectedTool === 'area-select';
  }, [toolState.selectedTool]);

  const canDelete = useCallback(() => {
    return toolState.selectedTool === 'delete';
  }, [toolState.selectedTool]);

  return {
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
  };
};

import { useState, useCallback } from 'react';

export interface ToolState {
  selectedTool: string;
}

export const useTools = () => {
  const [toolState, setToolState] = useState<ToolState>({
    selectedTool: 'move',
  });


  const selectTool = useCallback((tool: string) => {
    setToolState(prev => ({
      ...prev,
      selectedTool: tool,
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


  return {
    toolState,
    selectTool,
    getCursorStyle,
  };
};

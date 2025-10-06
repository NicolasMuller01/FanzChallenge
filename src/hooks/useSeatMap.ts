import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { SeatMap, Row, Seat, VenueObject, SeatMapState, BatchLabelingOptions } from '@/types';
import {
  generateId,
  createEmptySeatMap,
  createRow,
  createSeat,
  addSeatToRow,
  removeSeatFromRow,
  updateSeatLabel,
  updateRowLabel,
  applyBatchLabeling,
  exportSeatMap,
  importSeatMap,
  downloadJSON,
} from '@/utils/seatmap';
import { getTemplateById } from '@/utils/templates';

// LocalStorage functions
const saveToLocalStorage = (seatMap: SeatMap) => {
  try {
    localStorage.setItem('seatmap-builder-data', JSON.stringify(seatMap));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const loadFromLocalStorage = (): SeatMap | null => {
  try {
    const data = localStorage.getItem('seatmap-builder-data');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

const clearLocalStorage = () => {
  try {
    localStorage.removeItem('seatmap-builder-data');
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

export const useSeatMap = () => {
  const [state, setState] = useState<SeatMapState>({
    currentMap: null,
    selectedRows: [],
    selectedSeats: [],
    selectedObjects: [],
    isEditing: false,
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = loadFromLocalStorage();
    if (savedData) {
      setState(prev => ({
        ...prev,
        currentMap: savedData,
      }));
    }
  }, []);

  // Save to localStorage whenever currentMap changes
  useEffect(() => {
    if (state.currentMap) {
      saveToLocalStorage(state.currentMap);
    }
  }, [state.currentMap]);

  const createNewMap = useCallback((name: string) => {
    // Clear localStorage when creating a new map
    clearLocalStorage();
    
    const newMap = createEmptySeatMap(name);
    setState(prev => ({
      ...prev,
      currentMap: newMap,
      selectedRows: [],
      selectedSeats: [],
      isEditing: false,
    }));

    // Show toast
    toast.success(`Nuevo mapa "${name}" creado exitosamente!`);
  }, []);

  const addRow = useCallback((label: string, x: number = 0, y: number = 0) => {
    if (!state.currentMap) return;

    const newRow = createRow(label, x, y);
    const updatedMap = {
      ...state.currentMap,
      rows: [...state.currentMap.rows, newRow],
      updatedAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      currentMap: updatedMap,
    }));

    // Show toast
    toast.success(`Fila "${label}" agregada exitosamente!`);
  }, [state.currentMap]);

  const addSeat = useCallback((rowId: string, label: string, x: number = 0, y: number = 0) => {
    if (!state.currentMap) return;

    const newSeat = createSeat(rowId, label, x, y);
    const updatedRows = state.currentMap.rows.map(row =>
      row.id === rowId ? addSeatToRow(row, newSeat) : row
    );

    const updatedMap = {
      ...state.currentMap,
      rows: updatedRows,
      updatedAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      currentMap: updatedMap,
    }));

    // Show toast
    toast.success(`Asiento "${label}" agregado exitosamente!`);
  }, [state.currentMap]);

  const deleteRow = useCallback((rowId: string) => {
    if (!state.currentMap) return;

    const updatedRows = state.currentMap.rows.filter(row => row.id !== rowId);
    const updatedMap = {
      ...state.currentMap,
      rows: updatedRows,
      updatedAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      currentMap: updatedMap,
      selectedRows: prev.selectedRows.filter(id => id !== rowId),
    }));

    // Show toast
    toast.success('Fila eliminada exitosamente!');
  }, [state.currentMap]);

  const deleteMultipleRows = useCallback((rowIds: string[]) => {
    if (!state.currentMap || rowIds.length === 0) return;

    // Create a set for faster lookup
    const rowIdsSet = new Set(rowIds);
    
    // Filter out the selected rows
    const updatedRows = state.currentMap.rows.filter(row => !rowIdsSet.has(row.id));

    const updatedMap = {
      ...state.currentMap,
      rows: updatedRows,
      updatedAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      currentMap: updatedMap,
      selectedRows: [],
    }));

    // Show toast
    toast.success(`${rowIds.length} filas eliminadas exitosamente!`);
  }, [state.currentMap]);

  const deleteSeat = useCallback((rowId: string, seatId: string) => {
    if (!state.currentMap) return;

    const updatedRows = state.currentMap.rows.map(row =>
      row.id === rowId ? removeSeatFromRow(row, seatId) : row
    );

    const updatedMap = {
      ...state.currentMap,
      rows: updatedRows,
      updatedAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      currentMap: updatedMap,
      selectedSeats: prev.selectedSeats.filter(id => id !== seatId),
    }));

    // Show toast
    toast.success('Asiento eliminado exitosamente!');
  }, [state.currentMap]);

  const deleteMultipleSeats = useCallback((seatIds: string[]) => {
    if (!state.currentMap || seatIds.length === 0) return;

    // Create a set for faster lookup
    const seatIdsSet = new Set(seatIds);
    
    // Update all rows to remove the selected seats
    const updatedRows = state.currentMap.rows.map(row => ({
      ...row,
      seats: row.seats.filter(seat => !seatIdsSet.has(seat.id))
    }));

    const updatedMap = {
      ...state.currentMap,
      rows: updatedRows,
      updatedAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      currentMap: updatedMap,
      selectedSeats: [],
    }));

    // Show toast
    toast.success(`${seatIds.length} asientos eliminados exitosamente!`);
  }, [state.currentMap]);

  const updateSeat = useCallback((rowId: string, seatId: string, newLabel: string) => {
    if (!state.currentMap) return;

    const updatedRows = state.currentMap.rows.map(row =>
      row.id === rowId ? updateSeatLabel(row, seatId, newLabel) : row
    );

    const updatedMap = {
      ...state.currentMap,
      rows: updatedRows,
      updatedAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      currentMap: updatedMap,
    }));
  }, [state.currentMap]);

  const moveSeat = useCallback((seatId: string, rowId: string, newX: number, newY: number) => {
    if (!state.currentMap) return;

    const updatedRows = state.currentMap.rows.map(row => {
      if (row.id === rowId) {
        return {
          ...row,
          seats: row.seats.map(seat =>
            seat.id === seatId
              ? {
                  ...seat,
                  position: {
                    x: Math.max(0, newX), // Direct position setting
                    y: Math.max(0, newY),
                  },
                }
              : seat
          ),
        };
      }
      return row;
    });

    const updatedMap = {
      ...state.currentMap,
      rows: updatedRows,
      updatedAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      currentMap: updatedMap,
    }));
  }, [state.currentMap]);

  const moveRow = useCallback((rowId: string, newX: number, newY: number) => {
    if (!state.currentMap) return;

    const updatedRows = state.currentMap.rows.map(row =>
      row.id === rowId
        ? {
            ...row,
            position: {
              x: Math.max(0, newX), // Direct position setting
              y: Math.max(0, newY),
            },
          }
        : row
    );

    const updatedMap = {
      ...state.currentMap,
      rows: updatedRows,
      updatedAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      currentMap: updatedMap,
    }));
  }, [state.currentMap]);

  const selectMultipleObjects = useCallback((objectIds: string[]) => {
    setState(prev => ({
      ...prev,
      selectedObjects: objectIds,
      selectedRows: [],
      selectedSeats: [],
    }));
  }, []);

  const selectMultipleRows = useCallback((rowIds: string[]) => {
    setState(prev => ({
      ...prev,
      selectedRows: rowIds,
      selectedSeats: [],
      selectedObjects: [],
    }));
  }, []);

  const moveMultipleRows = useCallback((rowIds: string[], deltaX: number, deltaY: number) => {
    if (!state.currentMap) return;

   

    // Store initial positions if not already stored
    if (!state.initialRowPositions) {
      const initialPositions: { [key: string]: { x: number; y: number } } = {};
      rowIds.forEach(id => {
        const row = state.currentMap?.rows.find(r => r.id === id);
        if (row) {
          initialPositions[id] = { x: row.position.x, y: row.position.y };
        }
      });
      setState(prev => ({
        ...prev,
        initialRowPositions: initialPositions,
      }));
    }

    const updatedRows = state.currentMap.rows.map(row => {
      if (rowIds.includes(row.id) && state.initialRowPositions?.[row.id]) {
        const initialPos = state.initialRowPositions[row.id];
        const newX = Math.max(0, initialPos.x + deltaX);
        const newY = Math.max(0, initialPos.y + deltaY);
     
        return {
          ...row,
          position: {
            x: newX,
            y: newY,
          },
        };
      }
      return row;
    });

    const updatedMap = {
      ...state.currentMap,
      rows: updatedRows,
      updatedAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      currentMap: updatedMap,
    }));
  }, [state.currentMap, state.initialRowPositions]);

  const moveMultipleObjects = useCallback((objectIds: string[], deltaX: number, deltaY: number) => {
    if (!state.currentMap) return;


    // Store initial positions if not already stored
    if (!state.initialObjectPositions) {
      const initialPositions: { [key: string]: { x: number; y: number } } = {};
      objectIds.forEach(id => {
        const obj = state.currentMap?.objects.find(o => o.id === id);
        if (obj) {
          initialPositions[id] = { x: obj.position.x, y: obj.position.y };
        }
      });
      setState(prev => ({
        ...prev,
        initialObjectPositions: initialPositions,
      }));
    }

    const updatedObjects = state.currentMap.objects.map(obj => {
      if (objectIds.includes(obj.id) && state.initialObjectPositions?.[obj.id]) {
        const initialPos = state.initialObjectPositions[obj.id];
        const newX = Math.max(0, initialPos.x + deltaX);
        const newY = Math.max(0, initialPos.y + deltaY);
     
        return {
          ...obj,
          position: {
            x: newX,
            y: newY,
          },
        };
      }
      return obj;
    });

    const updatedMap = {
      ...state.currentMap,
      objects: updatedObjects,
      updatedAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      currentMap: updatedMap,
    }));
  }, [state.currentMap, state.initialObjectPositions]);

  const clearInitialPositions = useCallback(() => {
    setState(prev => ({
      ...prev,
      initialRowPositions: undefined,
      initialObjectPositions: undefined,
    }));
  }, []);

  const toggleSeatAvailability = useCallback((seatId: string, rowId: string) => {
    if (!state.currentMap) return;

    const updatedRows = state.currentMap.rows.map(row => {
      if (row.id === rowId) {
        return {
          ...row,
          seats: row.seats.map(seat =>
            seat.id === seatId
              ? {
                  ...seat,
                  isAvailable: seat.isAvailable === undefined ? false : !seat.isAvailable,
                }
              : seat
          ),
        };
      }
      return row;
    });

    const updatedMap = {
      ...state.currentMap,
      rows: updatedRows,
      updatedAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      currentMap: updatedMap,
    }));
  }, [state.currentMap]);

  const updateRow = useCallback((rowId: string, newLabel: string) => {
    if (!state.currentMap) return;

    const updatedRows = state.currentMap.rows.map(row =>
      row.id === rowId ? updateRowLabel(row, newLabel) : row
    );

    const updatedMap = {
      ...state.currentMap,
      rows: updatedRows,
      updatedAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      currentMap: updatedMap,
    }));
  }, [state.currentMap]);

  const applyBatchLabels = useCallback((options: BatchLabelingOptions) => {
    if (!state.currentMap || state.selectedRows.length === 0) return;

    // Only apply batch labeling to selected rows
    const selectedRows = state.currentMap.rows.filter(row => state.selectedRows.includes(row.id));
    const updatedSelectedRows = applyBatchLabeling(selectedRows, options);
    
    // Create a map of updated rows for quick lookup
    const updatedRowsMap = new Map(updatedSelectedRows.map(row => [row.id, row]));
    
    // Update only the selected rows, keep others unchanged
    const updatedRows = state.currentMap.rows.map(row => 
      updatedRowsMap.has(row.id) ? updatedRowsMap.get(row.id)! : row
    );
    
    const updatedMap = {
      ...state.currentMap,
      rows: updatedRows,
      updatedAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      currentMap: updatedMap,
    }));

    // Show toast notification
    toast.success(`Etiquetas aplicadas a ${state.selectedRows.length} filas seleccionadas!`);
  }, [state.currentMap, state.selectedRows]);

  const selectRow = useCallback((rowId: string, multiSelect: boolean = false) => {
    setState(prev => ({
      ...prev,
      selectedRows: multiSelect
        ? prev.selectedRows.includes(rowId)
          ? prev.selectedRows.filter(id => id !== rowId)
          : [...prev.selectedRows, rowId]
        : [rowId],
      selectedSeats: multiSelect ? prev.selectedSeats : [],
    }));
  }, []);

  const selectSeat = useCallback((seatId: string, multiSelect: boolean = false) => {
    setState(prev => ({
      ...prev,
      selectedSeats: multiSelect
        ? prev.selectedSeats.includes(seatId)
          ? prev.selectedSeats.filter(id => id !== seatId)
          : [...prev.selectedSeats, seatId]
        : [seatId],
      selectedRows: multiSelect ? prev.selectedRows : [],
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedRows: [],
      selectedSeats: [],
    }));
  }, []);

  const exportMap = useCallback((filename: string) => {
    if (!state.currentMap) return;

    const exportData = exportSeatMap(state.currentMap);
    downloadJSON(exportData, filename);
  }, [state.currentMap]);

  const importMap = useCallback((jsonData: string) => {
    const result = importSeatMap(jsonData);
    
    if (result.success && result.data) {
      setState(prev => ({
        ...prev,
        currentMap: result.data!,
        selectedRows: [],
        selectedSeats: [],
        isEditing: false,
      }));
    }

    return result;
  }, []);


  const loadTemplate = useCallback((templateId: string) => {
    const template = getTemplateById(templateId);
    
    if (template) {
      const templateMap = template.createMap();
      
      // Update row IDs for seats
      const updatedRows = templateMap.rows.map(row => ({
        ...row,
        seats: row.seats.map(seat => ({
          ...seat,
          rowId: row.id,
        })),
      }));
      
      const updatedMap = {
        ...templateMap,
        rows: updatedRows,
        objects: templateMap.objects || [], // Ensure objects array exists
      };
      
      setState(prev => ({
        ...prev,
        currentMap: updatedMap,
        selectedRows: [],
        selectedSeats: [],
        selectedObjects: [],
        isEditing: false,
      }));

      // Show toast
      toast.success(`Template "${template.name}" cargado exitosamente!`);
    }
  }, []);

  const addObject = useCallback((type: string, x: number, y: number) => {
    if (!state.currentMap) return;

    const newObject: VenueObject = {
      id: generateId(),
      type: type as any,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} 1`,
      position: { x, y },
      size: { width: 80, height: 60 },
      isSelected: false,
    };

    const updatedMap = {
      ...state.currentMap,
      objects: [...state.currentMap.objects, newObject],
      updatedAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      currentMap: updatedMap,
    }));
  }, [state.currentMap]);

  const selectObject = useCallback((objectId: string, multiSelect: boolean = false) => {
    setState(prev => ({
      ...prev,
      selectedObjects: multiSelect
        ? prev.selectedObjects.includes(objectId)
          ? prev.selectedObjects.filter(id => id !== objectId)
          : [...prev.selectedObjects, objectId]
        : [objectId],
      selectedRows: multiSelect ? prev.selectedRows : [],
      selectedSeats: multiSelect ? prev.selectedSeats : [],
    }));
  }, []);

  const moveObject = useCallback((objectId: string, newX: number, newY: number) => {
    if (!state.currentMap) return;

    const updatedObjects = state.currentMap.objects.map(obj =>
      obj.id === objectId
        ? {
            ...obj,
            position: { x: Math.max(0, newX), y: Math.max(0, newY) },
          }
        : obj
    );

    const updatedMap = {
      ...state.currentMap,
      objects: updatedObjects,
      updatedAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      currentMap: updatedMap,
    }));
  }, [state.currentMap]);

  const deleteObject = useCallback((objectId: string) => {
    if (!state.currentMap) return;

    const updatedObjects = state.currentMap.objects.filter(obj => obj.id !== objectId);
    const updatedMap = {
      ...state.currentMap,
      objects: updatedObjects,
      updatedAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      currentMap: updatedMap,
      selectedObjects: prev.selectedObjects.filter(id => id !== objectId),
    }));

    // Show toast
    toast.success('Objeto eliminado exitosamente!');
  }, [state.currentMap]);

  const deleteSelectedObjects = useCallback(() => {
    if (!state.currentMap || state.selectedObjects.length === 0) return;

    const updatedObjects = state.currentMap.objects.filter(obj => !state.selectedObjects.includes(obj.id));
    const updatedMap = {
      ...state.currentMap,
      objects: updatedObjects,
      updatedAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      currentMap: updatedMap,
      selectedObjects: [],
    }));

    // Show toast
    toast.success(`${state.selectedObjects.length} objetos eliminados exitosamente!`);
  }, [state.currentMap, state.selectedObjects]);


  return {
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
    selectMultipleRows,
    selectMultipleObjects,
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
    moveMultipleRows,
    moveMultipleObjects,
    clearInitialPositions,
  };
};

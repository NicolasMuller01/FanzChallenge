import { Seat, Row, SeatMap, BatchLabelingOptions, ExportData, ImportResult } from '@/types';

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const createEmptySeatMap = (name: string): SeatMap => {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    name,
    rows: [],
    objects: [],
    createdAt: now,
    updatedAt: now,
  };
};

export const createRow = (label: string, x: number = 0, y: number = 0): Row => {
  return {
    id: generateId(),
    label,
    seats: [],
    position: { x, y },
    isSelected: false,
  };
};

export const createSeat = (rowId: string, label: string, x: number = 0, y: number = 0): Seat => {
  return {
    id: generateId(),
    label,
    rowId,
    position: { x, y },
    isSelected: false,
  };
};

export const addSeatToRow = (row: Row, seat: Seat): Row => {
  return {
    ...row,
    seats: [...row.seats, seat],
  };
};

export const removeSeatFromRow = (row: Row, seatId: string): Row => {
  return {
    ...row,
    seats: row.seats.filter(seat => seat.id !== seatId),
  };
};

export const updateSeatLabel = (row: Row, seatId: string, newLabel: string): Row => {
  return {
    ...row,
    seats: row.seats.map(seat =>
      seat.id === seatId ? { ...seat, label: newLabel } : seat
    ),
  };
};

export const updateRowLabel = (row: Row, newLabel: string): Row => {
  return {
    ...row,
    label: newLabel,
  };
};

export const applyBatchLabeling = (
  rows: Row[],
  options: BatchLabelingOptions
): Row[] => {
  const { rowPrefix, seatPrefix, startNumber, endNumber } = options;
  
  return rows.map((row, rowIndex) => {
    const rowNumber = startNumber + rowIndex;
    const updatedRow = {
      ...row,
      label: `${rowPrefix} ${rowNumber}`,
    };

    // Apply batch labeling to seats
    const updatedSeats = row.seats.map((seat, seatIndex) => ({
      ...seat,
      label: `${seatPrefix}${seatIndex + 1}`,
    }));

    return {
      ...updatedRow,
      seats: updatedSeats,
    };
  });
};

export const exportSeatMap = (seatMap: SeatMap): ExportData => {
  return {
    mapName: seatMap.name,
    seatMap: {
      ...seatMap,
      updatedAt: new Date().toISOString(),
    },
  };
};

export const importSeatMap = (jsonData: string): ImportResult => {
  try {
    const data = JSON.parse(jsonData);
    
    // Basic validation
    if (!data.seatMap || !data.seatMap.rows || !Array.isArray(data.seatMap.rows)) {
      return {
        success: false,
        error: 'Invalid seat map format. Missing required fields.',
      };
    }

    // Validate each row
    for (const row of data.seatMap.rows) {
      if (!row.id || !row.label || !Array.isArray(row.seats)) {
        return {
          success: false,
          error: 'Invalid row format. Each row must have id, label, and seats array.',
        };
      }

      // Validate each seat
      for (const seat of row.seats) {
        if (!seat.id || !seat.label || !seat.rowId) {
          return {
            success: false,
            error: 'Invalid seat format. Each seat must have id, label, and rowId.',
          };
        }
      }
    }

    return {
      success: true,
      data: {
        ...data.seatMap,
        objects: data.seatMap.objects || [], // Ensure objects array exists
      },
    };
  } catch (error) {
    return {
      success: false,
      error: 'Invalid JSON format.',
    };
  }
};

export const downloadJSON = (data: ExportData, filename: string): void => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

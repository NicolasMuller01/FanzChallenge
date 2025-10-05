export interface Seat {
  id: string;
  label: string;
  rowId: string;
  position: {
    x: number;
    y: number;
  };
  isSelected?: boolean;
  isAvailable?: boolean;
  category?: string;
}

export interface VenueObject {
  id: string;
  type: 'screen' | 'table' | 'bar' | 'stage' | 'entrance' | 'exit' | 'restroom' | 'elevator';
  label: string;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  isSelected?: boolean;
  color?: string;
}

export interface Row {
  id: string;
  label: string;
  seats: Seat[];
  position: {
    x: number;
    y: number;
  };
  isSelected?: boolean;
}

export interface SeatMap {
  id: string;
  name: string;
  rows: Row[];
  objects: VenueObject[];
  createdAt: string;
  updatedAt: string;
}

export interface SeatMapState {
  currentMap: SeatMap | null;
  selectedRows: string[];
  selectedSeats: string[];
  selectedObjects: string[];
  isEditing: boolean;
  initialRowPositions?: { [key: string]: { x: number; y: number } };
  initialObjectPositions?: { [key: string]: { x: number; y: number } };
}

export interface BatchLabelingOptions {
  rowPrefix: string;
  seatPrefix: string;
  startNumber: number;
  endNumber: number;
}

export interface ExportData {
  mapName: string;
  seatMap: SeatMap;
}

export interface ImportResult {
  success: boolean;
  data?: SeatMap;
  error?: string;
}

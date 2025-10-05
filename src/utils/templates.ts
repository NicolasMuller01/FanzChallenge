import { SeatMap, Row, Seat } from '@/types';
import { generateId } from './seatmap';

export interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  createMap: () => SeatMap;
}

export const templates: Template[] = [
  {
    id: 'large-theatre',
    name: 'Large Theatre',
    description: 'Professional theater with multiple sections',
    preview: '🎭',
    createMap: () => {
      const rows = [];
      const objects = [];
      
      // Central section - Red seats
      for (let i = 0; i < 5; i++) {
        const rowId = generateId();
        const seats = [];
        
        for (let j = 0; j < 5; j++) {
          seats.push({
            id: generateId(),
            label: `C${i + 1}${j + 1}`,
            rowId: rowId,
            position: { x: j * 100, y: 0 },
            isAvailable: true,
            category: 'premium',
          });
        }
        
        rows.push({
          id: rowId,
          label: `Central Row ${i + 1}`,
          seats,
          position: { x: 400, y: 200 + i * 40 },
        });
      }
      
      // Left section - Red seats (trapezoidal)
      for (let i = 0; i < 5; i++) {
        const rowId = generateId();
        const seats = [];
        const seatCount = 5 + Math.floor(i / 2); // Increasing width
        
        for (let j = 0; j < seatCount; j++) {
          seats.push({
            id: generateId(),
            label: `L${i + 1}${j + 1}`,
            rowId: rowId,
            position: { x: j * 35, y: 0 },
            isAvailable: Math.random() > 0.2, // 80% available
            category: 'premium',
          });
        }
        
        rows.push({
          id: rowId,
          label: `Left Row ${i + 1}`,
          seats,
          position: { x: 140, y: 200 + i * 40 },
        });
      }
      
      // Right section - Red seats (trapezoidal)
      for (let i = 0; i < 5; i++) {
        const rowId = generateId();
        const seats = [];
        const seatCount = 6 + Math.floor(i / 2); // Increasing width
        
        for (let j = 0; j < seatCount; j++) {
          seats.push({
            id: generateId(),
            label: `R${i + 1}${j + 1}`,
            rowId: rowId,
            position: { x: j * 35, y: 0 },
            isAvailable: Math.random() > 0.2, // 80% available
            category: 'premium',
          });
        }
        
        rows.push({
          id: rowId,
          label: `Right Row ${i + 1}`,
          seats,
          position: { x: 650, y: 200 + i * 40 },
        });
      }
      
      // Side sections - Green seats
      for (let i = 0; i < 5; i++) {
        const rowId = generateId();
        const seats = [];
        
        for (let j = 0; j < 2; j++) {
          seats.push({
            id: generateId(),
            label: `S${i + 1}${j + 1}`,
            rowId: rowId,
            position: { x: j * 35, y: 0 },
            isAvailable: Math.random() > 0.1, // 90% available
            category: 'standard',
          });
        }
        
        rows.push({
          id: rowId,
          label: `Side Row ${i + 1}`,
          seats,
          position: { x: 20, y: 200 + i * 40 },
        });
      }
      
      // Add General Admission area
      objects.push({
        id: generateId(),
        type: 'stage' as const,
        label: 'General Admission',
        position: { x: 200, y: 100 },
        size: { width: 100, height: 60 },
        isSelected: false,
        color: '#ff6b6b',
      });
      
      return {
        id: generateId(),
        name: 'Theater',
        rows,
        objects,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    },
  },
  {
    id: 'small-theatre',
    name: 'Small Theatre',
    description: 'Basic theatre layout',
    preview: '🎭',
    createMap: () => {
      const rows = [];
      
      // Simple straight rows
      for (let i = 0; i < 6; i++) {
        const rowId = generateId();
        const seats = [];
        
        for (let j = 0; j < 12; j++) {
          seats.push({
            id: generateId(),
            label: `${i + 1}${j + 1}`,
            rowId: rowId, // Use the actual rowId
            position: { x: j * 35, y: 0 },
            isAvailable: true,
            category: 'standard',
          });
        }
        
        rows.push({
          id: rowId,
          label: `Row ${i + 1}`,
          seats,
          position: { x: 150, y: 200 + i * 60 },
        });
      }
      
      return {
        id: generateId(),
        name: 'Theatre',
        rows,
        objects: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    },
  },
  {
    id: 'gala-dinner',
    name: 'Gala Dinner',
    description: 'Elegant dining layout',
    preview: '🍽️',
    createMap: () => {
      const rows = [];
      
      // Simple U-shaped layout
      for (let i = 0; i < 4; i++) {
        const rowId = generateId();
        const seats = [];
        
        for (let j = 0; j < 8; j++) {
          seats.push({
            id: generateId(),
            label: `${i + 1}${j + 1}`,
            rowId: rowId, // Use the actual rowId
            position: { x: j * 40, y: 0 },
            isAvailable: true,
            category: 'standard',
          });
        }
        
        rows.push({
          id: rowId,
          label: `Row ${i + 1}`,
          seats,
          position: { x: 200, y: 300 + i * 50 },
        });
      }
      
      return {
        id: generateId(),
        name: 'Conference Room',
        rows,
        objects: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    },
  },
  {
    id: 'trade-show',
    name: 'Trade Show',
    description: 'Exhibition booth layout',
    preview: '🏢',
    createMap: () => {
      const rows = [];
      
      // Simple table layout
      for (let i = 0; i < 3; i++) {
        const rowId = generateId();
        const seats = [];
        
        for (let j = 0; j < 4; j++) {
          seats.push({
            id: generateId(),
            label: `${i + 1}${j + 1}`,
            rowId: rowId, // Use the actual rowId
            position: { x: j * 60, y: 0 },
            isAvailable: true,
            category: 'dining',
          });
        }
        
        rows.push({
          id: rowId,
          label: `Table ${i + 1}`,
          seats,
          position: { x: 200, y: 200 + i * 100 },
        });
      }
      
      return {
        id: generateId(),
        name: 'Restaurant',
        rows,
        objects: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    },
  },
];

export const getTemplateById = (id: string): Template | undefined => {
  return templates.find(template => template.id === id);
};

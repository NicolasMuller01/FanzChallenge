# SeatMapBuilder (Fanz)

A visual seat map editor built with React, TypeScript, and Next.js that allows users to create, edit, and manage seating arrangements with export/import functionality.

## Features

### Core Functionality
- **Visual Seat Map Editor**: Interactive canvas for creating and editing rows and seats
- **Row Management**: Create, edit, delete, and position rows
- **Seat Management**: Add, edit, delete, and position individual seats within rows
- **Selection System**: Single and multi-select for rows and seats
- **Drag & Drop**: Move rows and seats around the canvas

### Labeling System
- **Individual Labeling**: Edit row and seat labels with double-click
- **Batch Labeling**: Fast labeling for multiple rows and seats with customizable patterns
- **Mandatory Labels**: All rows and seats must have labels before export

### Import/Export
- **JSON Export**: Download seat maps as structured JSON files
- **JSON Import**: Upload and validate existing seat map files
- **Schema Validation**: Ensures data integrity during import

### Session Management
- **New Map**: Start fresh with empty state
- **Map Persistence**: Continue editing and re-export without data loss
- **State Management**: All data stored in memory (no database required)

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: Custom React hooks
- **File Handling**: Native browser APIs

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main application page
├── components/            # React components
│   ├── SeatMapCanvas.tsx  # Main canvas component
│   ├── SeatMapToolbar.tsx # Toolbar with actions
│   ├── NewMapModal.tsx    # Create new map modal
│   ├── BatchLabelModal.tsx # Batch labeling modal
│   └── EditLabelModal.tsx # Edit individual labels modal
├── hooks/                 # Custom React hooks
│   └── useSeatMap.ts      # Main state management hook
├── types/                 # TypeScript type definitions
│   ├── index.ts           # Type exports
│   └── seatmap.ts         # Seat map data types
└── utils/                 # Utility functions
    ├── cn.ts              # CSS class utility
    └── seatmap.ts         # Seat map operations
```

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd seatmap-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## JSON Schema

The seat map data structure follows this schema:

```typescript
interface SeatMap {
  id: string;           // Unique identifier
  name: string;         // Map name
  rows: Row[];          // Array of rows
  createdAt: string;    // ISO timestamp
  updatedAt: string;    // ISO timestamp
}

interface Row {
  id: string;           // Unique identifier
  label: string;        // Row label (required)
  seats: Seat[];        // Array of seats in this row
  position: {           // Canvas position
    x: number;
    y: number;
  };
}

interface Seat {
  id: string;           // Unique identifier
  label: string;        // Seat label (required)
  rowId: string;        // Parent row ID
  position: {           // Position within row
    x: number;
    y: number;
  };
}
```

### Export Format
```json
{
  "mapName": "Stadium Section A",
  "seatMap": {
    "id": "unique-id",
    "name": "Stadium Section A",
    "rows": [...],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Usage Guide

### Creating a New Map
1. Click "New Map" button
2. Enter a name for your seat map
3. Click "Create Map"

### Adding Rows and Seats
1. Click "Add Row" to create a new row
2. Select a row and click "Add Seat" to add seats to that row
3. Use drag & drop to position rows on the canvas

### Batch Labeling
1. Click "Batch Label" in the toolbar
2. Configure your labeling pattern:
   - Row Prefix (e.g., "Platea", "Section")
   - Seat Prefix (e.g., "A", "1")
   - Start/End numbers
3. Click "Apply Labels"

### Editing Labels
- **Double-click** any row or seat to edit its label
- Labels are mandatory for all rows and seats

### Export/Import
- **Export**: Click "Export JSON" and enter a filename
- **Import**: Click "Import JSON" and select a valid seat map file

## Key Design Decisions

### Architecture
- **Modular Components**: Each component has a single responsibility
- **Custom Hooks**: State management separated from UI components
- **Type Safety**: Comprehensive TypeScript interfaces
- **Utility Functions**: Reusable functions for data operations

### State Management
- **In-Memory Storage**: No database required, all state in React
- **Immutable Updates**: State updates create new objects
- **Centralized Logic**: All seat map operations in useSeatMap hook

### User Experience
- **Visual Feedback**: Clear selection states and hover effects
- **Keyboard Shortcuts**: Ctrl/Cmd+click for multi-selection
- **Confirmation Dialogs**: Prevent accidental deletions
- **Responsive Design**: Works on different screen sizes

### Data Validation
- **Schema Validation**: Import validation ensures data integrity
- **Required Fields**: All rows and seats must have labels
- **Error Handling**: Graceful error messages for invalid operations

## Assumptions

1. **No Database**: All data stored in memory during session
2. **Browser Support**: Modern browsers with ES6+ support
3. **File Size**: Reasonable seat map sizes (hundreds of seats, not thousands)
4. **Single User**: No concurrent editing or user management
5. **Desktop First**: Optimized for desktop use, mobile support basic

## Future Enhancements

- **Undo/Redo**: History management for operations
- **Templates**: Pre-built seat map templates
- **Advanced Positioning**: Snap-to-grid, alignment tools
- **Visual Themes**: Customizable colors and styles
- **Collaboration**: Real-time multi-user editing
- **Analytics**: Usage statistics and insights

## Troubleshooting

### Common Issues

1. **Import fails**: Ensure JSON file follows the correct schema
2. **Performance slow**: Large seat maps may need optimization
3. **Drag not working**: Check browser compatibility
4. **Export issues**: Ensure all rows and seats have labels

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project is created as a technical test for Fanz. All rights reserved.
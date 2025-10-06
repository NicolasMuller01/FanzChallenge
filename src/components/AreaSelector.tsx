'use client';

import React, { useRef, useEffect } from 'react';
import Selecto from 'react-selecto';

interface AreaSelectorProps {
  isActive: boolean;
  onSelectionChange: (selectedIds: string[]) => void;
  children: React.ReactNode;
  selectableElements: string[]; // These should be CSS selectors like ["#row-123", "#object-456"]
}

const AreaSelector: React.FC<AreaSelectorProps> = ({
  isActive,
  onSelectionChange,
  children,
  selectableElements,
}) => {
  const selectoRef = useRef<Selecto>(null);

  // Remove the problematic useEffect - Selecto will handle targets via props

  const handleSelect = (e: any) => {
    if (isActive) {
      const selectedIds = e.selected.map((element: HTMLElement) => element.id).filter(Boolean);  
      // Don't call onSelectionChange here, only on selectEnd
    }
  };

  const handleSelectEnd = (e: any) => {
    if (isActive) {
      const selectedIds = e.selected.map((element: HTMLElement) => element.id).filter(Boolean);
      onSelectionChange(selectedIds);
    }
  };

  if (!isActive) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <Selecto
        ref={selectoRef}
        dragContainer=".canvas-container"
        selectableTargets={isActive ? selectableElements : []}
        selectByClick={false}
        selectFromInside={false}
        continueSelect={false}
        ratio={0}
        onSelect={handleSelect}
        onSelectEnd={handleSelectEnd}
        scrollOptions={{
          container: ".canvas-container",
          throttleTime: 30,
          threshold: 0,
        }}
        hitRate={0}
      />
    </>
  );
};

export default AreaSelector;

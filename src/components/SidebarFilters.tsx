/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BRANDS, MODELS, MATERIALS, COLORS } from '../data';
import { FilterState } from '../types';
import NeomorphicCard from './NeomorphicCard';
import { ChevronDown, ChevronRight, RefreshCw, Layers, ShieldCheck, Sliders, Palette } from 'lucide-react';

interface SidebarFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
}

export default function SidebarFilters({ filters, onChange, onReset }: SidebarFiltersProps) {
  const [openSection, setOpenSection] = useState<Record<string, boolean>>({
    brand: true,
    model: true,
    material: true,
    elasticity: true,
    color: true
  });

  const [elasticity, setElasticity] = useState<number>(85); // Default high elasticity (Fit)

  const toggleSection = (sect: string) => {
    setOpenSection(prev => ({ ...prev, [sect]: !prev[sect] }));
  };

  const handleBrandChange = (brand: string) => {
    const updatedBrand = filters.brand === brand ? '' : brand;
    onChange({
      ...filters,
      brand: updatedBrand,
      // Reset model when brand changes
      model: ''
    });
  };

  const handleModelChange = (model: string) => {
    onChange({
      ...filters,
      model: filters.model === model ? '' : model
    });
  };

  const handleMaterialChange = (material: string) => {
    onChange({
      ...filters,
      material: filters.material === material ? '' : material
    });
  };

  const handleColorChange = (color: string) => {
    onChange({
      ...filters,
      color: filters.color === color ? '' : color
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full lg:w-64 shrink-0">
      {/* Sidebar Label Panel */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2 font-semibold text-slate-700">
          <Sliders className="w-5 height-5 text-sky-500" />
          <span className="text-lg tracking-wide uppercase font-mono text-xs">Filter Controls</span>
        </div>
        <button 
          onClick={onReset}
          className="neo-btn p-2 rounded-lg text-slate-500 hover:text-orange-500 active:text-orange-600 transition-colors"
          title="Reset All Filters"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* 1. BRAND SECTION (In the sketch, brand appears as an outstanding colored slab!) */}
      <NeomorphicCard className="overflow-hidden">
        <button 
          onClick={() => toggleSection('brand')}
          className={`w-full flex items-center justify-between p-4 font-semibold text-sm transition-all text-left ${
            filters.brand ? 'bg-orange-500 text-white shadow-[0_4px_12px_rgba(249,115,22,0.3)]' : 'text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-sans">Brand</span>
            {filters.brand && <span className="text-xs bg-white text-orange-500 px-2 py-0.5 rounded-full font-mono">{filters.brand}</span>}
          </div>
          {openSection.brand ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {openSection.brand && (
          <div className="p-3 flex flex-col gap-2 bg-slate-50/30">
            {BRANDS.map(brand => {
              const matches = filters.brand === brand;
              return (
                <button
                  key={brand}
                  onClick={() => handleBrandChange(brand)}
                  className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                    matches 
                      ? 'neo-in bg-slate-200 text-orange-600 font-semibold' 
                      : 'hover:bg-slate-200/50 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{brand}</span>
                    <span className={`w-3 h-3 rounded-full border ${matches ? 'bg-orange-500 border-orange-600' : 'border-slate-300'}`} />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </NeomorphicCard>

      {/* 2. COMPATIBLE MODELS */}
      <NeomorphicCard className="overflow-hidden">
        <button 
          onClick={() => toggleSection('model')}
          className="w-full flex items-center justify-between p-4 font-semibold text-slate-700 text-sm border-b border-slate-200/50"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-500" />
            <span>Device Model</span>
          </div>
          {openSection.model ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        
        {openSection.model && (
          <div className="p-3 max-h-48 overflow-y-auto flex flex-col gap-1.5 bg-slate-10/10">
            {filters.brand ? (
              MODELS[filters.brand].map(model => {
                const checked = filters.model === model;
                return (
                  <button
                    key={model}
                    onClick={() => handleModelChange(model)}
                    className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition-all ${
                      checked ? 'neo-in text-sky-600 font-semibold' : 'text-slate-600 hover:bg-slate-200/40'
                    }`}
                  >
                    {model}
                  </button>
                );
              })
            ) : (
              <div className="text-xs text-slate-400 p-2 text-center italic">
                Select a Brand above to see specific smartphone models
              </div>
            )}
          </div>
        )}
      </NeomorphicCard>

      {/* 3. CASE MATERIALS */}
      <NeomorphicCard className="overflow-hidden">
        <button 
          onClick={() => toggleSection('material')}
          className="w-full flex items-center justify-between p-4 font-semibold text-slate-700 text-sm border-b border-slate-200/50"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-500" />
            <span>Material</span>
          </div>
          {openSection.material ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {openSection.material && (
          <div className="p-3 flex flex-col gap-1 bg-slate-10/10">
            {MATERIALS.map(material => {
              const selected = filters.material === material;
              return (
                <button
                  key={material}
                  onClick={() => handleMaterialChange(material)}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition-all ${
                    selected ? 'neo-in text-indigo-600 font-semibold' : 'text-slate-600 hover:bg-slate-200/40'
                  }`}
                >
                  {material}
                </button>
              );
            })}
          </div>
        )}
      </NeomorphicCard>

      {/* 4. ELASTICITY / FIT PROFILE VALUE */}
      <NeomorphicCard className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-slate-700 font-semibold text-sm">Elast (Fit level)</span>
          <span className="font-mono text-xs text-sky-500 font-bold bg-sky-50 px-2 py-0.5 rounded">{elasticity}% Elastic</span>
        </div>
        <div className="neo-input-wrap p-2.5 flex items-center">
          <input 
            type="range" 
            min="10" 
            max="100" 
            value={elasticity} 
            onChange={(e) => setElasticity(parseInt(e.target.value))}
            className="w-full accent-orange-500 h-2 bg-slate-200 rounded-lg cursor-pointer appearance-none"
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>Tough / Rigid</span>
          <span>Flexible Gel</span>
        </div>
      </NeomorphicCard>

      {/* 5. PRICE RANGE FILTER (INR) */}
      <NeomorphicCard className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-slate-700 font-semibold text-sm">Price Range</span>
          <span className="font-mono text-xs text-sky-500 font-bold bg-sky-50 px-2 py-0.5 rounded">
            ₹{filters.priceRange[0].toLocaleString('en-IN')} – ₹{filters.priceRange[1].toLocaleString('en-IN')}
          </span>
        </div>

        {/* Min price slider */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-slate-400 font-mono">Min Price</span>
          <div className="neo-input-wrap p-2.5 flex items-center">
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={filters.priceRange[0]}
              onChange={(e) => {
                const newMin = parseInt(e.target.value);
                onChange({
                  ...filters,
                  priceRange: [Math.min(newMin, filters.priceRange[1]), filters.priceRange[1]]
                });
              }}
              className="w-full accent-orange-500 h-2 bg-slate-200 rounded-lg cursor-pointer appearance-none"
            />
          </div>
        </div>

        {/* Max price slider */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-slate-400 font-mono">Max Price</span>
          <div className="neo-input-wrap p-2.5 flex items-center">
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={filters.priceRange[1]}
              onChange={(e) => {
                const newMax = parseInt(e.target.value);
                onChange({
                  ...filters,
                  priceRange: [filters.priceRange[0], Math.max(newMax, filters.priceRange[0])]
                });
              }}
              className="w-full accent-orange-500 h-2 bg-slate-200 rounded-lg cursor-pointer appearance-none"
            />
          </div>
        </div>

        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>₹0</span>
          <span>₹10,000</span>
        </div>
      </NeomorphicCard>

      {/* 6. COLOR SCHEME SWATCH GRID */}
      <NeomorphicCard className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
          <Palette className="w-4 h-4 text-sky-500" />
          <span>Color Palette</span>
        </div>
        <div className="grid grid-cols-4 gap-2.5">
          {COLORS.map(color => {
            const isSelected = filters.color === color.name;
            return (
              <button
                key={color.name}
                onClick={() => handleColorChange(color.name)}
                className={`group relative w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isSelected 
                    ? 'ring-2 ring-orange-500 ring-offset-2 scale-110 shadow-md' 
                    : 'neo-btn hover:scale-105'
                }`}
                title={color.name}
                style={{
                  background: color.gradient || color.hex,
                }}
              >
                {/* Visual overlay representing shiny lens or 3D look in the color ball */}
                <div className="absolute inset-0.5 rounded-full bg-white/10 filter blur-[0.5px] pointer-events-none" />
                {isSelected && (
                  <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
                )}
              </button>
            );
          })}
        </div>
        {filters.color && (
          <div className="text-xs text-center text-slate-500 bg-slate-100 py-1.5 px-3 rounded-lg font-mono">
            Filtering by: <span className="font-bold text-orange-600">{filters.color}</span>
          </div>
        )}
      </NeomorphicCard>
    </div>
  );
}

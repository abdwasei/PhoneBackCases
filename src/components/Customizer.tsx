/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import NeomorphicCard from './NeomorphicCard';
import PhoneRender from './PhoneRender';
import { Product, CustomCoverConfig } from '../types';
import { Sparkles, ShoppingBag, Smartphone, Cpu, Type } from 'lucide-react';

interface CustomizerProps {
  onAddCustomToCart: (customProduct: Product) => void;
}

export default function Customizer({ onAddCustomToCart }: CustomizerProps) {
  const [baseModel, setBaseModel] = useState('iPhone 15 Pro');
  const [material, setMaterial] = useState('Silicone');
  const [baseColor, setBaseColor] = useState('#FF6B00'); // Hermès Orange
  const [pattern, setPattern] = useState<'solid' | 'marble' | 'paisley' | 'wave' | 'leather'>('solid');
  const [textColor, setTextColor] = useState('#ffffff');
  const [customText, setCustomText] = useState('CREATOR');
  const [isAdded, setIsAdded] = useState(false);

  const colorsList = [
    { name: 'Hermès Orange', hex: '#FF6B00' },
    { name: 'Sky Blue', hex: '#38bdf8' },
    { name: 'Midnight Charcoal', hex: '#1e293b' },
    { name: 'Forest Emerald', hex: '#064e3b' },
    { name: 'Blush Berry', hex: '#ec4899' },
    { name: 'Royal Gold', hex: '#ca8a04' },
    { name: 'Vintage Leather Brown', hex: '#854d0e' }
  ];

  const textColorsList = [
    { name: 'Vibrant White', hex: '#ffffff' },
    { name: 'Obsidian Black', hex: '#0f172a' },
    { name: 'Sunset Yellow', hex: '#fef08a' },
    { name: 'Electric Turquoise', hex: '#22d3ee' }
  ];

  const handlePatternChange = (p: 'solid' | 'marble' | 'paisley' | 'wave' | 'leather') => {
    setPattern(p);
    if (p === 'leather') {
      setMaterial('Leather');
    } else {
      setMaterial('Flexi-Tough');
    }
  };

  const currentConfig: CustomCoverConfig = {
    baseModel,
    material,
    color: baseColor,
    pattern,
    textColor,
    customText
  };

  const handleAddToCart = () => {
    // Generate a unique customized product
    const customProduct: Product = {
      id: `custom-${Date.now()}`,
      title: `${baseModel} - Customized Design`,
      price: 29.99,
      brand: baseModel.includes('iPhone') ? 'Apple' : baseModel.includes('Galaxy') ? 'Samsung' : 'Google',
      model: baseModel,
      material: material,
      color: colorsList.find(c => c.hex === baseColor)?.name || 'Custom',
      imageType: 'custom',
      description: `Bespoke customizable case meticulously assembled on demand. Fitted for ${baseModel} using premium ${material} materials. Custom text print: "${customText}".`,
      rating: 5.0,
      reviewsCount: 1,
      customConfig: currentConfig
    };

    onAddCustomToCart(customProduct);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <NeomorphicCard className="p-6">
      <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-stretch">
        
        {/* Visual 3D Phone Preview Column */}
        <div className="flex flex-col items-center justify-center bg-slate-100/40 rounded-2xl p-6 border border-white/20 relative grow min-w-[240px]">
          <div className="absolute top-3 left-4 flex items-center gap-1 text-slate-400 font-mono text-[10px]">
            <Cpu className="w-3.5 h-3.5" />
            <span>REALTIME RENDER VIEW</span>
          </div>

          <div className="py-2 transform transition-transform duration-300 hover:scale-105 active:scale-95">
            <PhoneRender 
              imageType="custom" 
              customConfig={currentConfig} 
              size="lg" 
            />
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
              Price: <span className="font-sans font-semibold text-orange-500 text-sm">$29.99</span>
            </p>
          </div>
        </div>

        {/* Configurations Column */}
        <div className="flex flex-col flex-1 gap-6 w-full">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500 animate-pulse" />
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">Studio Custom Maker</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Select your smartphone model, play with background patterns, and etch your custom text print.
            </p>
          </div>

          {/* 1. Phone Model Sector */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Smartphone className="w-4 h-4 text-sky-500" />
              Target Smartphone
            </span>
            <div className="neo-input-wrap p-2 flex gap-2">
              {['iPhone 15 Pro', 'Galaxy S24', 'Pixel 8 Pro'].map(model => (
                <button
                  key={model}
                  onClick={() => setBaseModel(model)}
                  className={`flex-1 text-center py-2 text-xs font-medium rounded-xl transition-all ${
                    baseModel === model 
                      ? 'bg-sky-500 text-white shadow-md' 
                      : 'hover:bg-slate-200/50 text-slate-600'
                  }`}
                >
                  {model}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Patterns Background */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider font-mono">
              Surface Pattern Theme
            </span>
            <div className="grid grid-cols-5 gap-1.5">
              {(['solid', 'marble', 'paisley', 'wave', 'leather'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => handlePatternChange(p)}
                  className={`capitalize text-center py-2 text-[10px] sm:text-xs font-medium rounded-xl transition-all ${
                    pattern === p 
                      ? 'bg-orange-500 text-white shadow-md font-semibold' 
                      : 'neo-btn text-slate-600 hover:text-slate-800'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Color Palette Swatches */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider font-mono">
              Enclosure Colors
            </span>
            <div className="flex flex-wrap gap-2.5">
              {colorsList.map(c => (
                <button
                  key={c.name}
                  onClick={() => setBaseColor(c.hex)}
                  className={`width-8 height-8 w-8 h-8 rounded-full border-2 transition-transform ${
                    baseColor === c.hex 
                      ? 'border-orange-500 scale-110 shadow-md ring-2 ring-orange-100' 
                      : 'border-white hover:scale-105 shadow-sm'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* 4. Custom text / monogram engraving */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Type className="w-4 h-4 text-sky-500" />
                Case Print Stamp
              </span>
              <div className="neo-input-wrap px-3 py-1 flex items-center">
                <input
                  type="text"
                  maxLength={14}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value.toUpperCase())}
                  className="w-full bg-transparent text-sm font-semibold outline-none text-slate-700 py-1.5 placeholder-slate-400"
                  placeholder="Stamp letters..."
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider font-mono">
                Stamp Ink Color
              </span>
              <div className="flex gap-2">
                {textColorsList.map(tc => (
                  <button
                    key={tc.name}
                    onClick={() => setTextColor(tc.hex)}
                    className={`width-7 height-7 w-7 h-7 rounded-md border transition-transform ${
                      textColor === tc.hex 
                        ? 'border-orange-500 scale-110 shadow-sm' 
                        : 'border-slate-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: tc.hex }}
                    title={tc.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Checkout studio submission Button */}
          <button
            onClick={handleAddToCart}
            className={`w-full neo-btn-orange py-3.5 px-6 font-bold text-sm tracking-wide uppercase transition-all flex items-center justify-center gap-2 ${
              isAdded ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200' : ''
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            {isAdded ? 'Custom Masterpiece Added!' : 'Add Custom Cover to My Cart - $29.99'}
          </button>
        </div>
      </div>
    </NeomorphicCard>
  );
}

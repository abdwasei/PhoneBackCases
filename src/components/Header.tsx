/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingCart, Menu, Search, MapPin, ClipboardList, UserCheck, ChevronDown, Check, Save } from 'lucide-react';
import NeomorphicCard from './NeomorphicCard';
import { FilterState, UserProfile } from '../types';

interface HeaderProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  cartItemsCount: number;
  user: UserProfile;
  onOpenCart: () => void;
  onOpenProfile: () => void;
  onOpenReturns: () => void;
}

export default function Header({
  filters,
  onFilterChange,
  cartItemsCount,
  user,
  onOpenCart,
  onOpenProfile,
  onOpenReturns
}: HeaderProps) {
  const [searchValue, setSearchValue] = useState(filters.search);
  const [activeBrandDropdown, setActiveBrandDropdown] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Manual Location persistence
  const [town, setTown] = useState(() => localStorage.getItem('neo_loc_town') || 'San Francisco');
  const [district, setDistrict] = useState(() => localStorage.getItem('neo_loc_district') || 'San Francisco County');
  const [stateName, setStateName] = useState(() => localStorage.getItem('neo_loc_state') || 'California');
  const [pinCode, setPinCode] = useState(() => localStorage.getItem('neo_loc_pincode') || '94107');

  // Intermediate form states
  const [inputTown, setInputTown] = useState(town);
  const [inputDistrict, setInputDistrict] = useState(district);
  const [inputStateName, setInputStateName] = useState(stateName);
  const [inputPinCode, setInputPinCode] = useState(pinCode);

  const handleToggleLocationModal = () => {
    if (!isLocationModalOpen) {
      setInputTown(town);
      setInputDistrict(district);
      setInputStateName(stateName);
      setInputPinCode(pinCode);
    }
    setIsLocationModalOpen(!isLocationModalOpen);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({
      ...filters,
      search: searchValue
    });
  };

  const selectBrandCategory = (brand: string) => {
    onFilterChange({
      ...filters,
      category: brand,
      brand: brand === 'All' ? '' : brand,
      model: '' // Reset product model on category change
    });
    setActiveBrandDropdown(false);
  };

  const handleApplyLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTown || !inputDistrict || !inputStateName || !inputPinCode) return;
    
    setTown(inputTown);
    setDistrict(inputDistrict);
    setStateName(inputStateName);
    setPinCode(inputPinCode);
    
    localStorage.setItem('neo_loc_town', inputTown);
    localStorage.setItem('neo_loc_district', inputDistrict);
    localStorage.setItem('neo_loc_state', inputStateName);
    localStorage.setItem('neo_loc_pincode', inputPinCode);
    
    setIsLocationModalOpen(false);
  };

  return (
    <header className="w-full flex flex-col gap-4 py-3 pb-6 border-b border-slate-200/50">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
        
        {/* ==================== TOP BAR LEFT ==================== */}
        <div className="flex flex-wrap items-center gap-3.5 w-full lg:w-auto">
          {/* Menu Drawer Hamburger icon */}
          <button 
            className="neo-btn p-3.5 rounded-2xl text-slate-600 hover:text-sky-500 hover:scale-105 active:scale-95 flex items-center justify-center font-bold"
            onClick={onOpenProfile}
            title="App Menu Options"
          >
            <Menu className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* User Account clicker */}
          <button
            onClick={onOpenProfile}
            className="neo-btn px-4 py-2.5 rounded-2xl text-left hover:scale-[1.02] active:scale-95 transition-all text-slate-700 flex items-center gap-3"
            title={user.isLoggedIn ? "View User Account Parameters" : "Sign In to Your Account"}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${user.isLoggedIn ? 'bg-orange-100 border-orange-200 animate-pulse' : 'bg-sky-100 border-sky-200'}`}>
              <UserCheck className={`w-4 h-4 ${user.isLoggedIn ? 'text-orange-500' : 'text-sky-500'}`} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">
                {user.isLoggedIn ? 'User Account' : 'Guest Portal'}
              </p>
              <p className="text-xs font-bold leading-none mt-0.5 truncate max-w-[110px]">
                {user.isLoggedIn ? user.name.split(' ')[0] : 'Sign In / Sign Up'}
              </p>
            </div>
          </button>

          {/* Geolocated Location box */}
          <div className="relative">
            <button
              onClick={handleToggleLocationModal}
              className="neo-btn px-4 py-2.5 rounded-2xl text-left hover:scale-[1.02] active:scale-95 transition-all text-slate-700 flex items-center gap-2.5"
            >
              <MapPin className="w-4.5 h-4.5 text-sky-500 animate-bounce" />
              <div>
                <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">Location</p>
                <p className="text-xs font-bold leading-none mt-0.5 max-w-[125px] truncate flex items-center gap-1.5">
                  <span>{town}</span>
                  <span className="text-[9px] font-mono font-semibold text-slate-400">({pinCode})</span>
                  <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                </p>
              </div>
            </button>

            {/* Float selection locations popup */}
            {isLocationModalOpen && (
              <form 
                onSubmit={handleApplyLocation}
                className="absolute top-14 left-0 w-72 md:w-80 z-40 bg-[#F0F2F5] neo-out p-4 flex flex-col gap-3 rounded-2xl shadow-xl border border-white/20"
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/50">
                  <span className="text-[10px] font-mono text-slate-400 font-bold tracking-widest uppercase">
                    Manual Delivery Hub
                  </span>
                  <MapPin className="w-3.5 h-3.5 text-sky-500" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-semibold text-slate-500 px-1 font-mono uppercase tracking-wider">
                      Town / Village
                    </label>
                    <div className="neo-input-wrap px-2 py-0.5 flex items-center">
                      <input 
                        type="text" 
                        placeholder="e.g. Indiranagar"
                        value={inputTown} 
                        onChange={(e) => setInputTown(e.target.value)}
                        className="w-full bg-transparent text-xs text-slate-700 outline-none py-0.5 h-7 font-sans"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-semibold text-slate-500 px-1 font-mono uppercase tracking-wider">
                      District
                    </label>
                    <div className="neo-input-wrap px-2 py-0.5 flex items-center">
                      <input 
                        type="text" 
                        placeholder="e.g. Bengaluru"
                        value={inputDistrict} 
                        onChange={(e) => setInputDistrict(e.target.value)}
                        className="w-full bg-transparent text-xs text-slate-700 outline-none py-0.5 h-7 font-sans"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-semibold text-slate-500 px-1 font-mono uppercase tracking-wider">
                      State
                    </label>
                    <div className="neo-input-wrap px-2 py-0.5 flex items-center">
                      <input 
                        type="text" 
                        placeholder="e.g. Karnataka"
                        value={inputStateName} 
                        onChange={(e) => setInputStateName(e.target.value)}
                        className="w-full bg-transparent text-xs text-slate-700 outline-none py-0.5 h-7 font-sans"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-semibold text-slate-500 px-1 font-mono uppercase tracking-wider">
                      PIN / ZIP Code
                    </label>
                    <div className="neo-input-wrap px-2 py-0.5 flex items-center">
                      <input 
                        type="text" 
                        placeholder="e.g. 560038"
                        value={inputPinCode} 
                        onChange={(e) => setInputPinCode(e.target.value)}
                        className="w-full bg-transparent text-xs text-slate-700 outline-none py-0.5 h-7 font-mono tracking-wider"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="neo-btn-blue w-full py-2.5 px-4 text-xs font-mono font-bold uppercase tracking-wider h-10 flex items-center justify-center gap-1.5 mt-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Location</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ==================== TOP BAR CENTER (Search Bar) ==================== */}
        <form 
          onSubmit={handleSearchSubmit}
          className="flex-1 w-full lg:max-w-xl mx-0 lg:mx-4"
        >
          {/* Prominent Deep Neomorphic Slot Groove */}
          <div className="neo-input-wrap p-2 flex items-center gap-2 justify-between w-full h-14">
            
            {/* Left drop selector capsule (e.g., showing 'All' initial) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveBrandDropdown(!activeBrandDropdown)}
                className="neo-btn-blue h-10 px-4.5 flex items-center gap-1.5 text-xs font-bold rounded-xl whitespace-nowrap"
              >
                <span className="capitalize">{filters.category || 'All'}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {activeBrandDropdown && (
                <div className="absolute top-12 left-0 w-36 bg-[#F0F2F5] neo-out p-1.5 flex flex-col gap-1 z-30 rounded-xl">
                  {['All', 'Apple', 'Samsung', 'Google', 'OnePlus'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => selectBrandCategory(b)}
                      className="w-full text-left py-1.5 px-3 text-xs text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      {b}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Interactive Query Input */}
            <input 
              type="text"
              placeholder="search designs... (e.g. Silicone, Abstract, Leather)"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="flex-1 bg-transparent border-none text-slate-700 font-semibold placeholder-slate-400/85 outline-none text-sm px-2.5 h-full"
            />

            {/* Orange click action button */}
            <button
              type="submit"
              className="neo-btn-orange w-10 h-10 flex items-center justify-center shrink-0 border-none rounded-xl"
              title="Execute Search Code"
            >
              <Search className="w-4.5 h-4.5 stroke-[2.5]" />
            </button>
          </div>
        </form>

        {/* ==================== TOP BAR RIGHT ==================== */}
        <div className="flex items-center gap-3.5 w-full lg:w-auto justify-end">
          
          {/* Returns & Orders clickable card */}
          <button
            onClick={onOpenReturns}
            className="neo-btn px-4 py-2.5 rounded-2xl text-left text-slate-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
            title="Review Order History Logs"
          >
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center border border-white/40 shadow-sm">
              <ClipboardList className="w-4 h-4 text-sky-500" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">Returns</p>
              <p className="text-xs font-bold leading-none mt-0.5">& Orders</p>
            </div>
          </button>

          {/* Dynamic Interactive Cart element */}
          <button
            onClick={onOpenCart}
            className="neo-btn px-4.5 py-2.5 rounded-2xl text-slate-700 hover:scale-[1.03] active:scale-95 transition-all flex items-center gap-3 relative"
            title="Open Interactive Cart Drawer"
          >
            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center relative shadow-sm">
              <ShoppingCart className="w-4.5 h-4.5 text-sky-500 stroke-[2]" />
            </div>
            
            <div className="text-left">
              <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">Checkout</p>
              <p className="text-xs font-bold leading-none mt-0.5">My Bag</p>
            </div>

            {/* Dynamic Orange Items Counter Bubble (matching style exactly!) */}
            <div className="width-6 height-6 w-6 h-6 rounded-full bg-orange-500 shadow-[0_3px_10px_rgba(249,115,22,0.45)] text-white font-mono text-xs font-bold border-2 border-white flex items-center justify-center absolute -top-1.5 -right-1.5 transition-transform duration-300 scale-100 hover:scale-110">
              {cartItemsCount}
            </div>
          </button>

        </div>

      </div>
    </header>
  );
}

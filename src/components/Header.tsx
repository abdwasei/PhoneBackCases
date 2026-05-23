/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingCart, Menu, Search, MapPin, ClipboardList, UserCheck, ChevronDown } from 'lucide-react';
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
  const [selectedLocation, setSelectedLocation] = useState('San Francisco, CA');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const locationsList = [
    'San Francisco, CA',
    'Silicon Valley, CA',
    'Austin, Texas',
    'Seattle, WA',
    'New York, NY',
    'London, UK'
  ];

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

  const changeLocation = (loc: string) => {
    setSelectedLocation(loc);
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
              onClick={() => setIsLocationModalOpen(!isLocationModalOpen)}
              className="neo-btn px-4 py-2.5 rounded-2xl text-left hover:scale-[1.02] active:scale-95 transition-all text-slate-700 flex items-center gap-2.5"
            >
              <MapPin className="w-4.5 h-4.5 text-sky-500 animate-bounce" />
              <div>
                <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">Location</p>
                <p className="text-xs font-bold leading-none mt-0.5 max-w-[115px] truncate flex items-center gap-1">
                  <span>{selectedLocation.split(',')[0]}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </p>
              </div>
            </button>

            {/* Float selection locations popup */}
            {isLocationModalOpen && (
              <div className="absolute top-14 left-0 w-48 z-40 bg-[#F0F2F5] neo-out p-2 flex flex-col gap-1 rounded-xl">
                <span className="text-[9px] font-mono p-1 text-slate-400 font-bold tracking-widest uppercase">Target Hubs</span>
                {locationsList.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => changeLocation(loc)}
                    className="w-full text-left py-1.5 px-2.5 text-xs text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    {loc}
                  </button>
                ))}
              </div>
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

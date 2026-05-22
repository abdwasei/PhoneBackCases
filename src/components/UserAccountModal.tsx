/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserProfile } from '../types';
import NeomorphicCard from './NeomorphicCard';
import { X, User, Save, Gift, CheckCircle, Award } from 'lucide-react';

interface UserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

export default function UserAccountModal({
  isOpen,
  onClose,
  user,
  onUpdateUser
}: UserAccountModalProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [address, setAddress] = useState(user.address);
  const [city, setCity] = useState(user.city);
  const [postalCode, setPostalCode] = useState(user.postalCode);
  const [phone, setPhone] = useState(user.phone);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      email,
      address,
      city,
      postalCode,
      phone
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2500);
  };

  const loyaltyTier = user.points >= 500 ? 'Platinum Creator' : user.points >= 250 ? 'Gold Elite' : 'Silver Bronze';
  const progressToNextTier = Math.min((user.points / 500) * 100, 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      {/* Frame panel */}
      <NeomorphicCard className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto z-10 p-6 bg-[#F0F2F5]">
        
        {/* Profile Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 mb-5">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-sky-500" />
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Your Profile Account</h2>
          </div>
          <button 
            onClick={onClose}
            className="neo-btn p-2 rounded-lg text-slate-500 hover:text-red-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Loyalty Reward Program status cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <NeomorphicCard className="p-4" depth="sm">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-1">
              <span>VIP LOGY LEVEL</span>
              <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded">{loyaltyTier}</span>
            </div>
            <div className="flex items-baseline gap-1 mt-1.5">
              <span className="text-2xl font-black text-slate-800 tracking-tight">{user.points}</span>
              <span className="text-xs font-semibold text-slate-400 font-mono">points</span>
            </div>
            {/* progress bar */}
            <div className="w-full h-1.5 bg-slate-200 rounded-full mt-3 overflow-hidden neo-in">
              <div 
                className="h-full bg-sky-500 rounded-full transition-all duration-500" 
                style={{ width: `${progressToNextTier}%` }} 
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-mono">
              {user.points >= 500 ? 'Top Tier Unlocked! Unlimited Free Shipping' : `${500 - user.points} pts left to Platinum tier!`}
            </p>
          </NeomorphicCard>

          <NeomorphicCard className="p-4 flex flex-col justify-between" depth="sm">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span>PROMO SAVINGS CREDIT</span>
              <Gift className="w-4 h-4 text-orange-500" />
            </div>
            <div className="mt-2">
              <span className="text-xl font-bold text-slate-800">$15.00</span>
              <span className="text-[10px] text-slate-400 block font-mono">Gift voucher index balances</span>
            </div>
            <div className="text-[10px] font-mono mt-1 text-emerald-600 font-semibold bg-emerald-50 py-1 px-2 rounded self-start">
              Code &apos;NEOFEED&apos; active
            </div>
          </NeomorphicCard>
        </div>

        {/* User profile fields editing form */}
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest mb-1">Shipping & Billing Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 px-1">Full Name</label>
              <div className="neo-input-wrap px-3 py-1.5 flex items-center">
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-700 outline-none py-1 h-7 font-sans"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 px-1">Email Address</label>
              <div className="neo-input-wrap px-3 py-1.5 flex items-center">
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-700 outline-none py-1 h-7 font-sans"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 px-1">Delivery Address</label>
            <div className="neo-input-wrap px-3 py-2 flex items-center">
              <input 
                type="text" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-700 outline-none py-0.5 h-7 font-sans"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 px-1">City</label>
              <div className="neo-input-wrap px-3 py-1.5 flex items-center">
                <input 
                  type="text" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-700 outline-none py-1 h-7 font-sans"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 px-1">Postal Post Code</label>
              <div className="neo-input-wrap px-3 py-1.5 flex items-center">
                <input 
                  type="text" 
                  value={postalCode} 
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-705 outline-none py-1 h-7 font-sans"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mb-2">
            <label className="text-xs font-semibold text-slate-600 px-1">Cell Contact Phone</label>
            <div className="neo-input-wrap px-3 py-1.5 flex items-center">
              <input 
                type="text" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-700 outline-none py-1 h-7 font-sans"
                required
              />
            </div>
          </div>

          {/* Action trigger button */}
          <div className="flex items-center gap-3 mt-4 border-t border-slate-200/50 pt-4">
            <button
              type="submit"
              className="neo-btn-blue flex-1 py-3 px-6 text-xs font-mono font-bold uppercase tracking-wider h-11 flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              Save Account Credentials
            </button>
            {saveSuccess && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100 animate-fade-in animate-pulse">
                <Award className="w-4 h-4 text-emerald-500 animate-spin" />
                <span>Synchronized Offline</span>
              </div>
            )}
          </div>
        </form>
      </NeomorphicCard>
    </div>
  );
}

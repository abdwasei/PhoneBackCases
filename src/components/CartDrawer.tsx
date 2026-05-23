/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CartItem } from '../types';
import PhoneRender from './PhoneRender';
import NeomorphicCard from './NeomorphicCard';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Award, CheckCircle } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckoutSuccess: (purchasedItems: CartItem[], finalTotal: number) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckoutSuccess
}: CartDrawerProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [addressDetails, setAddressDetails] = useState({
    name: 'Sarah Jenkins',
    address: '476 Neomorphic Blvd, Suite 3D, San Francisco, CA 94107',
    promoCode: ''
  });
  
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 5.99;
  const tax = subtotal * 0.0825; // 8.25% CA Sales Tax
  const promoDiscount = addressDetails.promoCode.toLowerCase() === 'neofeed' ? subtotal * 0.15 : 0;
  const total = subtotal + shipping + tax - promoDiscount;
  
  // Progress up to free shipping
  const freeShippingThreshold = 50;
  const freeShippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = Math.max(freeShippingThreshold - subtotal, 0);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate premium billing delay
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutComplete(true);
    }, 1800);
  };

  const finalizeCheckout = () => {
    onCheckoutSuccess(cartItems, total);
    setCheckoutComplete(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Dark backdrop blur blur */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slideout Frame */}
      <div className="relative w-full max-w-md h-full bg-[#F0F2F5] shadow-2xl flex flex-col z-10 transition-transform duration-300">
        
        {/* Drawer Header */}
        <div className="p-5 flex items-center justify-between border-b border-slate-200/60 bg-[#edf1f6]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-sky-500" />
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Your Cart</h2>
            <span className="text-xs bg-orange-500 text-white font-mono px-2 py-0.5 rounded-full font-bold">
              {cartItems.reduce((acc, current) => acc + current.quantity, 0)} items
            </span>
          </div>
          <button 
            onClick={onClose}
            className="neo-btn p-2 rounded-lg text-slate-500 hover:text-red-500 active:text-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Regular Cart Content / Success Screen Switchers */}
        {checkoutComplete ? (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center bg-[#F0F2F5]">
            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-500 mb-4 animate-bounce">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Order Confirmed!</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-xs">
              Thank you for supporting craftsmanship. Your customized neomorphic phone covers have been commissioned and our logistics crew are packing them up.
            </p>

            <NeomorphicCard className="p-4 my-6 w-full max-w-xs">
              <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-2">
                <span>ESTIMATED DELIVERY</span>
                <span className="font-bold text-slate-700">3-4 business days</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-4">
                <span>REWARDS EARNED</span>
                <span className="font-bold text-orange-500 flex items-center gap-0.5">
                  <Award className="w-3.5 h-3.5" />
                  +{Math.round(subtotal * 10)} pts
                </span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-sm font-semibold">
                <span>Grand Total Paid</span>
                <span className="text-emerald-600">₹{total.toFixed(2)}</span>
              </div>
            </NeomorphicCard>

            <button 
              onClick={finalizeCheckout}
              className="w-full neo-btn-blue py-3.5 font-bold uppercase tracking-wider text-xs"
            >
              Back to Catalog
            </button>
          </div>
        ) : (
          <>
            {/* Free Shipping Tracker */}
            {cartItems.length > 0 && (
              <div className="p-4 bg-white/25 border-b border-slate-200/50">
                <div className="flex justify-between items-center text-xs font-medium text-slate-600 mb-1">
                  <span>{remainingForFreeShipping > 0 ? `Add ₹${remainingForFreeShipping.toFixed(2)} more for Free Shipping` : '🤩 You got Free Standard Shipping!'}</span>
                  <span>{Math.round(freeShippingProgress)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden neo-in">
                  <div 
                    className="h-full bg-orange-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
                  <ShoppingBag className="w-16 h-16 text-slate-300 stroke-[1.5] mb-4" />
                  <p className="font-semibold text-slate-600">Your shopping bag is clean & empty</p>
                  <p className="text-xs text-slate-400 mt-1.5 max-w-[240px]">Explore our luxury case collections and add the perfect shield for your iPhone or Galaxy!</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <NeomorphicCard key={item.id} className="p-3 flex items-center gap-3.5 relative overflow-hidden">
                    
                    {/* Tiny Case Render representation */}
                    <div className="neo-in p-1 rounded-xl bg-slate-100 flex items-center justify-center">
                      <PhoneRender 
                        imageType={item.product.imageType} 
                        customConfig={item.product.customConfig} 
                        size="sm" 
                      />
                    </div>

                    {/* Meta details right */}
                    <div className="flex-1 flex flex-col gap-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 tracking-tight truncate">
                        {item.product.title}
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                          {item.selectedModel || item.product.model}
                        </span>
                        <span className="text-[10px] bg-sky-50 text-sky-600 px-1.5 py-0.5 rounded font-mono">
                          {item.product.material}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2.5">
                        <span className="text-sm font-semibold text-orange-600">
                          ₹{(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        
                        {/* Compact Plus Minus Controls */}
                        <div className="neo-input-wrap py-0.5 px-1.5 flex items-center gap-2">
                          <button 
                            onClick={() => item.quantity > 1 ? onUpdateQuantity(item.id, item.quantity - 1) : onRemoveItem(item.id)}
                            className="text-slate-500 p-0.5 hover:text-orange-500 active:scale-90"
                          >
                            <Minus className="w-3 H-3 h-3 w-3" />
                          </button>
                          <span className="text-xs font-mono font-bold text-slate-700 min-w-3 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="text-slate-500 p-0.5 hover:text-sky-500 active:scale-90"
                          >
                            <Plus className="w-3 h-3 w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Trash Button */}
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="absolute top-2 right-2 text-slate-300 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </NeomorphicCard>
                ))
              )}
            </div>

            {/* Billing Footer */}
            {cartItems.length > 0 && (
              <div className="p-5 bg-[#edf1f6] border-t border-slate-200/80 flex flex-col gap-3">
                
                {/* Promo Code area */}
                <div className="flex gap-2 mb-1.5">
                  <div className="neo-input-wrap px-3 py-1 flex items-center flex-1">
                    <input 
                      type="text" 
                      placeholder="TRY PROMO: NEOFEED" 
                      value={addressDetails.promoCode}
                      onChange={(e) => setAddressDetails({ ...addressDetails, promoCode: e.target.value })}
                      className="w-full bg-transparent text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-700 outline-none"
                    />
                  </div>
                  {addressDetails.promoCode.toLowerCase() === 'neofeed' && (
                    <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-1.5 rounded flex items-center justify-center font-bold">
                      15% Applied!
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5 text-xs text-slate-500 font-mono">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-sans font-semibold text-slate-700">₹{subtotal.toFixed(2)}</span>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Promo (15% off)</span>
                      <span>-₹{promoDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax (8.25%)</span>
                    <span className="font-sans font-semibold text-slate-700">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-sans font-semibold text-slate-700">
                      {shipping === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="border-t border-slate-200/80 pt-2 flex justify-between text-base font-bold text-slate-800">
                    <span className="font-sans font-bold">Order Total</span>
                    <span className="font-sans font-bold text-orange-600">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Simulated Checkout Button */}
                <button
                  disabled={isCheckingOut || cartItems.length === 0}
                  onClick={handleCheckout}
                  className="w-full neo-btn-orange mt-2 py-3.5 px-6 font-bold text-sm tracking-wide uppercase flex items-center justify-center gap-2"
                >
                  {isCheckingOut ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Validating Security Token...</span>
                    </div>
                  ) : (
                    <>
                      <span>Submit Secure Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

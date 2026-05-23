/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Order } from '../types';
import NeomorphicCard from './NeomorphicCard';
import PhoneRender from './PhoneRender';
import { X, Package, ShieldAlert, ArrowLeft, CheckCircle, Barcode } from 'lucide-react';

interface ReturnsOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onReturnOrder: (orderId: string, itemIds: string[], reason: string) => void;
}

export default function ReturnsOrdersModal({
  isOpen,
  onClose,
  orders,
  onReturnOrder
}: ReturnsOrdersModalProps) {
  const [activeStep, setActiveStep] = useState<'list' | 'reason' | 'success'>('list');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [returnReason, setReturnReason] = useState('Changed my mind');
  const [generatedLabelCode, setGeneratedLabelCode] = useState('');

  if (!isOpen) return null;

  const handleStartReturn = (order: Order) => {
    setSelectedOrder(order);
    setActiveStep('reason');
  };

  const handleSubmitReturn = () => {
    if (!selectedOrder) return;
    
    // Process return globally
    const itemIds = selectedOrder.items.map(i => i.product.id);
    onReturnOrder(selectedOrder.id, itemIds, returnReason);
    
    // Generate mock shipping token barcode
    const randomBarcode = `NEO-RET-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedLabelCode(randomBarcode);
    setActiveStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      {/* Frame Container */}
      <NeomorphicCard className="relative w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col z-10 p-6 bg-[#F0F2F5]">
        
        {/* Header toolbar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 mb-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-sky-500" />
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Returns & Order History</h2>
          </div>
          <button 
            onClick={onClose}
            className="neo-btn p-2 rounded-lg text-slate-500 hover:text-red-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Wizard Steps */}
        {activeStep === 'list' && (
          <div className="flex-1 overflow-y-auto flex flex-col gap-4 max-h-[60vh] pr-1">
            <p className="text-xs text-slate-500 leading-relaxed mb-1">
              Check the shipping status of your recent commissions or start a prepaid return within 30 days. No label-printing required.
            </p>

            {orders.length === 0 ? (
              <div className="text-center py-10 text-slate-400 font-mono text-xs">
                No purchases logged yet. Complete standard checkout to see orders.
              </div>
            ) : (
              orders.map(order => (
                <NeomorphicCard key={order.id} className="p-4" depth="sm">
                  {/* Grid header details */}
                  <div className="flex justify-between items-start border-b border-slate-200/50 pb-2.5 mb-3 text-xs font-mono">
                    <div>
                      <span className="font-bold text-slate-700">{order.id}</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">Placed: {order.date}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' :
                        order.status === 'Returned' ? 'bg-red-50 text-red-500' : 'bg-sky-50 text-sky-500'
                      }`}>
                        {order.status}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">₹${order.total.toFixed(0)} Total</p>
                    </div>
                  </div>

                  {/* Order Products */}
                  <div className="flex flex-col gap-2 mb-3">
                    {order.items.map(item => (
                      <div key={item.id} className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center neo-in p-0.5">
                          <PhoneRender imageType={item.product.imageType} customConfig={item.product.customConfig} size="sm" className="scale-75" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate">{item.product.title}</p>
                          <p className="text-[10px] text-slate-400 font-mono">Qty: {item.quantity} • Model: {item.selectedModel || item.product.model}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between text-[11px] font-mono border-t border-slate-200/30 pt-3">
                    <span className="text-slate-400">Tracking: <span className="text-slate-600 font-semibold">{order.trackingNumber}</span></span>
                    {order.status === 'Delivered' && (
                      <button
                        onClick={() => handleStartReturn(order)}
                        className="neo-btn-orange px-3 py-1 font-semibold text-[10px] rounded"
                      >
                        File Return
                      </button>
                    )}
                  </div>
                </NeomorphicCard>
              ))
            )}
          </div>
        )}

        {activeStep === 'reason' && selectedOrder && (
          <div className="flex-1 flex flex-col gap-4">
            <button 
              onClick={() => setActiveStep('list')}
              className="neo-btn self-start px-2.5 py-1 text-xs text-slate-600 flex items-center gap-1 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>

            <h3 className="text-sm font-semibold text-slate-800">
              Why are you returning <span className="text-orange-600 font-bold">{selectedOrder.id}</span>?
            </h3>

            <div className="neo-in p-4 flex flex-col gap-2.5">
              {[
                'Wrong cover fits for my device model',
                'Color is different than expected',
                'Materials are not to my style specifications',
                'Ordered multiple models to check aesthetics',
                'Changed my mind'
              ].map(reason => (
                <button
                  key={reason}
                  onClick={() => setReturnReason(reason)}
                  className={`w-full text-left p-2.5 text-xs rounded-xl transition-all ${
                    returnReason === reason 
                      ? 'bg-orange-500 text-white shadow-md font-semibold' 
                      : 'hover:bg-slate-350 bg-slate-200/50 text-slate-600'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            <button
              onClick={handleSubmitReturn}
              className="neo-btn-orange w-full py-3 mt-4 text-xs tracking-wider font-bold h-11 uppercase"
            >
              Process Slip & Cancel Order
            </button>
          </div>
        )}

        {activeStep === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-orange-100 text-orange-500 mb-4 animate-bounce">
              <ShieldAlert className="w-9 h-9" />
            </div>
            
            <h3 className="text-lg font-bold text-slate-800">Return Processed Successfully!</h3>
            <p className="text-xs text-slate-500 mt-2 max-w-xs">
              Your refund of <span className="font-semibold text-orange-600">₹${selectedOrder?.total.toFixed(0)}</span> has been queued. Present the digital scan coupon below at any dropoff point.
            </p>

            <NeomorphicCard className="p-4 my-6 flex flex-col items-center justify-center bg-white border border-slate-200" depth="sm">
              <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase mb-2">Prepaid FedEx Air Slip</span>
              <Barcode className="w-48 h-12 text-slate-800" />
              <span className="text-xs font-mono font-bold text-slate-700 mt-2">{generatedLabelCode}</span>
            </NeomorphicCard>

            <button
              onClick={() => {
                setActiveStep('list');
                setSelectedOrder(null);
              }}
              className="neo-btn-blue w-full py-2.5 text-xs font-bold uppercase tracking-wider"
            >
              Back to My Profile Hub
            </button>
          </div>
        )}
      </NeomorphicCard>
    </div>
  );
}

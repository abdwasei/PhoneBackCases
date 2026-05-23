/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, CartItem, Order, UserProfile, FilterState } from './types';
import { INITIAL_PRODUCTS, INITIAL_USER, INITIAL_ORDERS, MODELS } from './data';
import Header from './components/Header';
import SidebarFilters from './components/SidebarFilters';
import PhoneRender from './components/PhoneRender';
import NeomorphicCard from './components/NeomorphicCard';
import Customizer from './components/Customizer';
import CartDrawer from './components/CartDrawer';
import ReturnsOrdersModal from './components/ReturnsOrdersModal';
import UserAccountModal from './components/UserAccountModal';
import { ShoppingCart, Star, Heart, CheckCircle2, ChevronRight, Award, Flame, BadgeAlert, Grid, Palette, HelpCircle } from 'lucide-react';

export default function App() {
  // Global Persisted States
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Interface Toggle States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isReturnsOpen, setIsReturnsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'catalog' | 'custom'>('catalog');
  
  // Filter States
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'All',
    brand: '',
    model: '',
    material: '',
    color: '',
    priceRange: [0, 10000]
  });

  // Selected Product Details for quick select modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('');

  // Toast notification state
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'info' }[]>([]);

  // Load from LocalStorage if available
  useEffect(() => {
    const savedCart = localStorage.getItem('neo_cart');
    const savedUser = localStorage.getItem('neo_user');
    const savedOrders = localStorage.getItem('neo_orders');
    
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  // Sync to LocalStorage
  const syncCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('neo_cart', JSON.stringify(newCart));
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    const isLoggingOut = user.isLoggedIn && !updatedUser.isLoggedIn;
    const isLoggingIn = !user.isLoggedIn && updatedUser.isLoggedIn;
    
    setUser(updatedUser);
    localStorage.setItem('neo_user', JSON.stringify(updatedUser));
    
    if (isLoggingOut) {
      addToast('Secure session terminated. Signed out successfully.', 'info');
    } else if (isLoggingIn) {
      addToast(`Session established! Welcome, ${updatedUser.name.split(' ')[0]}`, 'success');
    } else {
      addToast('Account profile details updated successfully.', 'success');
    }
  };

  const handleReturnOrder = (orderId: string, itemIds: string[], reason: string) => {
    const updatedOrders = orders.map(ord => {
      if (ord.id === orderId) {
        return { ...ord, status: 'Returned' as const };
      }
      return ord;
    });
    setOrders(updatedOrders);
    localStorage.setItem('neo_orders', JSON.stringify(updatedOrders));
    
    // Partially refund loyalty point balances
    setUser(prev => {
      const nextUser = { ...prev, points: Math.max(0, prev.points - 100) };
      localStorage.setItem('neo_user', JSON.stringify(nextUser));
      return nextUser;
    });
    addToast(`Prepaid cancellation slip successfully queued for ${orderId}`, 'info');
  };

  const addToast = (message: string, type: 'success' | 'info' = 'success') => {
    const id = `${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  // Cart operations
  const handleAddToCart = (product: Product, modelSelection?: string) => {
    const targetModel = modelSelection || product.model || 'iPhone 15 Pro';
    
    // Check if customized item is identical
    const existingIndex = cart.findIndex(item => 
      item.product.id === product.id && 
      (item.selectedModel === targetModel || item.product.imageType === 'custom')
    );

    let newCart = [...cart];
    if (existingIndex > -1) {
      newCart[existingIndex].quantity += 1;
    } else {
      newCart.push({
        id: `${product.id}-${targetModel}-${Date.now()}`,
        product,
        quantity: 1,
        selectedModel: targetModel
      });
    }
    syncCart(newCart);
    addToast(`Bespoke ${product.title} added to your Cart!`, 'success');
    setSelectedProduct(null); // Close modal if open
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    const newCart = cart.map(item => {
      if (item.id === id) {
        return { ...item, quantity: qty };
      }
      return item;
    });
    syncCart(newCart);
  };

  const handleRemoveItem = (id: string) => {
    const newCart = cart.filter(item => item.id !== id);
    syncCart(newCart);
    addToast('Item removed from shopping bag', 'info');
  };

  const handleCheckoutSuccess = (items: CartItem[], finalTotal: number) => {
    // Generate new order summary log
    const newOrder: Order = {
      id: `ORD-${Math.floor(90000 + Math.random() * 10000)}`,
      date: new Date().toISOString().split('T')[0],
      items,
      total: finalTotal,
      status: 'Processing',
      trackingNumber: `TRK-${Math.floor(10000000 + Math.random() * 90000000)}`
    };

    const nextOrders = [newOrder, ...orders];
    setOrders(nextOrders);
    localStorage.setItem('neo_orders', JSON.stringify(nextOrders));

    // Clear cart
    syncCart([]);

    // Reward points additions (e.g. 10 points per ₹100 spent!)
    const pointsAccrued = Math.round(finalTotal * 10);
    const nextUser = {
      ...user,
      points: user.points + pointsAccrued
    };
    setUser(nextUser);
    localStorage.setItem('neo_user', JSON.stringify(nextUser));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      brand: '',
      model: '',
      material: '',
      color: '',
      priceRange: [0, 10000]
    });
  };

  const handleOpenProductSelect = (product: Product) => {
    setSelectedProduct(product);
    // Auto populate compatible model drop selection list
    const defaults = MODELS[product.brand] ? MODELS[product.brand][0] : 'iPhone 15';
    setSelectedModel(defaults);
  };

  // Filtering algorithmic core
  const filteredProducts = products.filter(product => {
    // search text matching
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchesTitle = product.title.toLowerCase().includes(q);
      const matchesDesc = product.description.toLowerCase().includes(q);
      const matchesColor = product.color.toLowerCase().includes(q);
      if (!matchesTitle && !matchesDesc && !matchesColor) return false;
    }

    // Category / Brand filter
    if (filters.brand && product.brand !== filters.brand) return false;
    
    // Model filter
    if (filters.model && product.model !== filters.model) return false;
    
    // Material filter
    if (filters.material && product.material !== filters.material) return false;

    // Color swatches filter
    if (filters.color && product.color !== filters.color) return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-[#F0F2F5] py-6 px-4 sm:px-6 lg:px-8 relative selection:bg-orange-200">
      
      {/* Floating dynamic status toast messages */}
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2.5 max-w-sm w-full font-mono text-xs">
        {toasts.map(t => (
          <div 
            key={t.id} 
            className={`neo-out p-3.5 rounded-xl flex items-center gap-2.5 border border-white/40 drop-shadow-[0_8px_16px_rgba(0,0,0,0.1)] transition-all animate-bounce ${
              t.type === 'success' ? 'bg-[#F0F2F5] border-emerald-300' : 'bg-[#F0F2F5] border-sky-350'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 shrink-0 ${t.type === 'success' ? 'text-emerald-500' : 'text-sky-500'}`} />
            <span className="text-slate-700 font-semibold">{t.message}</span>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* ==================== SITE NAVIGATION TOPBAR ==================== */}
        <Header 
          filters={filters}
          onFilterChange={setFilters}
          cartItemsCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          user={user}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenReturns={() => setIsReturnsOpen(true)}
        />

        {/* ==================== WORKSPACE MODE TAB SWITCHER ==================== */}
        <div className="flex items-center justify-between mt-3 bg-slate-200/50 p-1.5 rounded-2xl neo-in max-w-sm">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeTab === 'catalog' 
                ? 'bg-sky-500 text-white shadow-md' 
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Case Grid View</span>
          </button>
          
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeTab === 'custom' 
                ? 'bg-orange-500 text-white shadow-md' 
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Customize Studio</span>
          </button>
        </div>

        {/* ==================== WORKSPACE CONTENT ==================== */}
        {activeTab === 'custom' ? (
          /* Bespoke Design Studio Workspace */
          <div className="py-2 animate-fade-in-up">
            <Customizer onAddCustomToCart={(customProduct) => handleAddToCart(customProduct, customProduct.model)} />
          </div>
        ) : (
          /* Main E-Catalog Layout with Sidebar */
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Left Sidebar Filter Section */}
            <SidebarFilters 
              filters={filters}
              onChange={setFilters}
              onReset={handleResetFilters}
            />

            {/* Right Products Feed */}
            <div className="flex-1 w-full">
              
              {/* Feed Meta Controls */}
              <div className="flex items-center justify-between mb-5 px-1 text-xs text-slate-500 font-mono">
                <span>Displaying <span className="font-bold text-slate-800">{filteredProducts.length}</span> cover layouts</span>
                {filters.category !== 'All' && (
                  <span className="bg-sky-50 text-sky-600 px-2 py-0.5 rounded">Category: {filters.category}</span>
                )}
              </div>

              {/* Grid Layout of Cards */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 neo-out p-8 bg-[#F0F2F5]">
                  <p className="font-semibold text-slate-700 text-sm">No phone covers match your specifications</p>
                  <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
                    Try wiping your color filters or category query indices in search. Better yet, build your own design.
                  </p>
                  <button 
                    onClick={handleResetFilters}
                    className="neo-btn-blue mt-5 py-2 px-4 text-xs font-bold uppercase font-mono"
                  >
                    Reset Filter Fields
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => (
                    <NeomorphicCard 
                      key={product.id}
                      onClick={() => handleOpenProductSelect(product)}
                      className="p-4 flex flex-col justify-between items-center text-center cursor-pointer group"
                    >
                      {/* Product Badges (Top Left corner alignment) */}
                      <div className="w-full flex items-center justify-between px-1 mb-2">
                        {product.isPopular ? (
                          <span className="bg-orange-100 text-orange-600 text-[10px] font-mono leading-none font-bold py-1 px-2 rounded-md flex items-center gap-0.5 shadow-sm border border-orange-200">
                            <Flame className="w-3 h-3 text-orange-500 animate-pulse" />
                            <span>POPULAR</span>
                          </span>
                        ) : product.isNew ? (
                          <span className="bg-emerald-50 text-emerald-600 text-[10px] font-mono leading-none font-bold py-1 px-2 rounded-md shadow-sm border border-emerald-100">
                            NEW DESIGN
                          </span>
                        ) : (
                          <span />
                        )}
                        <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded">{product.brand}</span>
                      </div>

                      {/* Cover Vector Image */}
                      <div className="h-76 w-full transform duration-300 group-hover:scale-105 flex items-center justify-center overflow-hidden rounded-2xl bg-white/5">
                        {product.imageUrl ? (
                          <img 
                            src={`${import.meta.env.BASE_URL}images/${product.imageUrl}`}
                            alt={product.title}
                            className="w-full h-full object-cover mix-blend-multiply"
                          />
                        ) : (
                          <PhoneRender imageType={product.imageType} size="md" />
                        )}
                      </div>

                      {/* Meta information details */}
                      <div className="w-full text-left mt-3 pt-3 border-t border-slate-200/50 flex flex-col gap-1 relative">
                        <p className="text-xs text-slate-400 font-mono font-medium truncate uppercase">{product.model}</p>
                        <h3 className="text-sm font-bold text-slate-800 tracking-tight tracking-tight line-clamp-1">{product.title}</h3>
                        
                        {/* Rating row */}
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className="flex items-center text-amber-500">
                            <Star className="w-3 H-3 fill-amber-500" />
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono font-bold">{product.rating.toFixed(1)} ({product.reviewsCount})</span>
                        </div>

                        {/* Price and Cart checkout interactive triggers */}
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-base font-bold text-orange-500 font-mono">
                            ₹{product.price.toFixed(2)}
                          </span>

                          {/* Quick Sky-Blue Cart click trigger button (replicating the image icon) */}
                          <button
                            onClick={(e) => {
                              // Prevent click from bubbling up, opening the detail modal
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                            className="neo-btn-blue w-9 h-9 flex items-center justify-center rounded-full hover:scale-110 active:scale-95 transition-all shadow-[0_3px_10px_rgba(56,189,248,0.4)]"
                            title="Quick Add Layout To Cart"
                          >
                            <ShoppingCart className="w-4 h-4 text-white stroke-[2.5]" />
                          </button>
                        </div>
                      </div>
                    </NeomorphicCard>
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

      </div>

      {/* ==================== 1. CART FLYOVER SLIDE DRAWER ==================== */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckoutSuccess={handleCheckoutSuccess}
      />

      {/* ==================== 2. RETURNS & RECENT ORDER MODAL ==================== */}
      <ReturnsOrdersModal 
        isOpen={isReturnsOpen}
        onClose={() => setIsReturnsOpen(false)}
        orders={orders}
        onReturnOrder={handleReturnOrder}
      />

      {/* ==================== 3. USER PROFILE ACCOUNT DETAILS MODAL ==================== */}
      <UserAccountModal 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onUpdateUser={handleUpdateUser}
      />

      {/* ==================== 4. PRODUCT SELECT CONFIGURATION MODAL ==================== */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedProduct(null)} />
          
          <NeomorphicCard className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto p-6 z-10 flex flex-col md:flex-row gap-6 bg-[#F0F2F5]">
            {/* Micro cover image preview left */}
            <div className="flex items-center justify-center bg-slate-100 rounded-2xl overflow-hidden border border-white/20 shrink-0 w-48 h-76">
              {selectedProduct.imageUrl ? (
                <img 
                  src={`${import.meta.env.BASE_URL}images/${selectedProduct.imageUrl}`}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover mix-blend-multiply"
                />
              ) : (
                <div className="p-4">
                  <PhoneRender imageType={selectedProduct.imageType} size="md" />
                </div>
              )}
            </div>

            {/* Info contents right */}
            <div className="flex-1 flex flex-col gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase bg-slate-200 text-slate-600 px-2 py-0.5 rounded">
                  {selectedProduct.brand} • {selectedProduct.material}
                </span>
                <h2 className="text-lg font-bold text-slate-800 mt-1">{selectedProduct.title}</h2>
                <span className="text-xl font-black text-orange-500 font-mono block mt-1">₹{selectedProduct.price.toFixed(2)}</span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* Model selection dropdown within modal */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-slate-600">Choose custom fit model:</span>
                <div className="neo-input-wrap px-3 py-1 flex items-center">
                  <select 
                    value={selectedModel} 
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full bg-transparent text-xs text-slate-705 outline-none font-sans h-8"
                  >
                    {MODELS[selectedProduct.brand]?.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Features listed details */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1">✔ Scratch Hardened</span>
                <span className="flex items-center gap-1">✔ Camera Safe Bezel</span>
                <span className="flex items-center gap-1">✔ 3M Impact Shielded</span>
                <span className="flex items-center gap-1">✔ Wireless Charging OK</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3 border-t border-slate-250 mt-1">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="neo-btn flex-1 py-3 text-xs font-mono uppercase font-bold text-slate-500"
                >
                  Exit Frame
                </button>
                <button
                  onClick={() => handleAddToCart(selectedProduct, selectedModel)}
                  className="neo-btn-orange flex-1 py-3 text-xs font-mono uppercase font-bold"
                >
                  Confirm Fit & Bag
                </button>
              </div>
            </div>
            
          </NeomorphicCard>
        </div>
      )}

      {/* Bottom Legal / Help footer details */}
      <footer className="mt-16 text-center border-t border-slate-200/40 pt-4 text-[10px] font-mono text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
        <span>© 2026 Neomorphic Labs Corporation, Private Beta.</span>
        <div className="flex gap-4">
          <span className="hover:text-sky-500 cursor-pointer flex items-center gap-0.5"><Award className="w-3 h-3" /> Secure Server Integrity verified</span>
          <span className="hover:text-orange-500 cursor-pointer flex items-center gap-0.5"><HelpCircle className="w-3 h-3" /> Support Hub</span>
        </div>
      </footer>
    </div>
  );
}

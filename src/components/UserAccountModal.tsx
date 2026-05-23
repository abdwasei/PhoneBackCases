/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';
import NeomorphicCard from './NeomorphicCard';
import { 
  X, User, Save, Gift, CheckCircle, Award, Mail, Phone, Lock, 
  ArrowRight, ArrowLeft, Check, Loader2, Smartphone, KeyRound, 
  Eye, EyeOff, LogOut, ShieldCheck, RefreshCw, ChevronDown 
} from 'lucide-react';

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
  // Auth navigation states
  const [activeTab, setActiveTab] = useState<'social' | 'email' | 'phone'>('social');
  
  // Email Auth details
  const [emailMode, setEmailMode] = useState<'login' | 'signup'>('login');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [fullNameInput, setFullNameInput] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Phone Auth details
  const [phoneNo, setPhoneNo] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [phoneStep, setPhoneStep] = useState<'input' | 'otp'>('input');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(59);

  // Loading and Success Simulation
  const [authLoading, setAuthLoading] = useState(false);
  const [authLoadingMessage, setAuthLoadingMessage] = useState('');
  const [authSuccessMessage, setAuthSuccessMessage] = useState('');

  // Logged-in profile edit details
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [address, setAddress] = useState(user.address);
  const [city, setCity] = useState(user.city);
  const [postalCode, setPostalCode] = useState(user.postalCode);
  const [phone, setPhone] = useState(user.phone);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Update profile fields when user state updates
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAddress(user.address);
      setCity(user.city);
      setPostalCode(user.postalCode);
      setPhone(user.phone);
    }
  }, [user]);

  // Phone step OTP countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (phoneStep === 'otp' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phoneStep, otpTimer]);

  if (!isOpen) return null;

  // Handles updating the profile fields (when logged in)
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

  // Sign out helper
  const handleSignOut = () => {
    setAuthLoading(true);
    setAuthLoadingMessage('Terminating secure credentials session...');
    setTimeout(() => {
      onUpdateUser({
        ...user,
        isLoggedIn: false
      });
      setAuthLoading(false);
      // Reset input fields
      setEmailInput('');
      setPasswordInput('');
      setPhoneNo('');
      setPhoneStep('input');
      setOtp(['', '', '', '']);
    }, 1500);
  };

  // Simulate authentication loading sequence and transition
  const triggerAuthSimulation = (
    loadingMessages: string[], 
    successMsg: string, 
    finalUserProfile: Partial<UserProfile>
  ) => {
    setAuthLoading(true);
    
    // Cycle through messages for realistic premium delay
    let currentMsgIdx = 0;
    setAuthLoadingMessage(loadingMessages[0]);
    
    const msgInterval = setInterval(() => {
      currentMsgIdx++;
      if (currentMsgIdx < loadingMessages.length) {
        setAuthLoadingMessage(loadingMessages[currentMsgIdx]);
      }
    }, 700);

    setTimeout(() => {
      clearInterval(msgInterval);
      setAuthLoading(false);
      setAuthSuccessMessage(successMsg);
      
      // Let the user admire the success screen for a bit
      setTimeout(() => {
        onUpdateUser({
          ...user,
          ...finalUserProfile,
          isLoggedIn: true
        });
        setAuthSuccessMessage('');
      }, 1800);
    }, loadingMessages.length * 800);
  };

  // 1. Social Logins
  const handleGoogleSignIn = () => {
    triggerAuthSimulation(
      [
        'Reaching Google Account Servers...',
        'Resolving OAuth Token parameters...',
        'Synchronizing secure user payload...'
      ],
      'Google authentication verified! Welcome.',
      {
        name: 'Alex Vance',
        email: 'alex.vance@gmail.com',
        address: '742 Evergreen Terrace',
        city: 'Springfield',
        postalCode: '49007',
        phone: '+1 (555) 019-9000',
        points: 380,
        avatarSeed: 'alex'
      }
    );
  };

  const handleAppleSignIn = () => {
    triggerAuthSimulation(
      [
        'Handshaking Apple ID Gateway...',
        'Processing biometric FaceID validation...',
        'Confirming iCloud secure profile...'
      ],
      'Apple ID signature verified! Welcome.',
      {
        name: 'Jordan Apple-User',
        email: 'jordan.dev@icloud.com',
        address: '1 Infinite Loop',
        city: 'Cupertino',
        postalCode: '95014',
        phone: '+1 (555) 432-1090',
        points: 650, // Platinum Creator
        avatarSeed: 'jordan'
      }
    );
  };

  // 2. Email Sign In / Sign Up
  const handleEmailAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;

    if (emailMode === 'login') {
      triggerAuthSimulation(
        [
          'Validating user credentials...',
          'Decrypting local session profile...',
          'Opening secure checkout tunnel...'
        ],
        `Successfully logged in as ${emailInput.split('@')[0]}`,
        {
          name: 'Sarah Jenkins',
          email: emailInput,
          address: '476 Neomorphic Blvd, Suite 3D',
          city: 'San Francisco',
          postalCode: '94107',
          phone: '+91 98765 43210',
          points: 480,
          avatarSeed: 'sarah'
        }
      );
    } else {
      triggerAuthSimulation(
        [
          'Registering client records...',
          'Crediting 100 new user loyalty points...',
          'Building custom design storage nodes...'
        ],
        `Account created successfully for ${fullNameInput || 'User'}!`,
        {
          name: fullNameInput || 'New Creator',
          email: emailInput,
          address: 'Add Shipping Address...',
          city: 'Add City...',
          postalCode: '000000',
          phone: '+91 99999 88888',
          points: 100, // Sign up reward points!
          avatarSeed: 'new_user'
        }
      );
    }
  };

  // 3. Phone Sign In OTP Request
  const handlePhoneRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNo) return;
    
    setAuthLoading(true);
    setAuthLoadingMessage('Transmitting OTP code via secure SMS array...');
    
    setTimeout(() => {
      setAuthLoading(false);
      setPhoneStep('otp');
      setOtpTimer(59);
      setOtp(['', '', '', '']);
    }, 1500);
  };

  // OTP Change Focus helper
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // OTP Verify submit
  const handleOtpVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const joinedOtp = otp.join('');
    if (joinedOtp.length < 4) return;

    triggerAuthSimulation(
      [
        'Decrypting OTP verification packet...',
        'Confirming mobile carrier confirmation...',
        'Synchronizing active sessions...'
      ],
      'Phone OTP successfully verified!',
      {
        name: 'Rohan Sharma',
        email: 'rohan.sharma@gmail.com',
        address: '12, MG Road, Indiranagar',
        city: 'Bengaluru',
        postalCode: '560038',
        phone: `${countryCode} ${phoneNo}`,
        points: 180,
        avatarSeed: 'rohan'
      }
    );
  };

  // Loyalty calculations (only when logged in)
  const loyaltyTier = user.points >= 500 ? 'Platinum Creator' : user.points >= 250 ? 'Gold Elite' : 'Silver Bronze';
  const progressToNextTier = Math.min((user.points / 500) * 100, 100);

  const countries = [
    { code: '+91', label: '🇮🇳 +91 (IN)' },
    { code: '+1', label: '🇺🇸 +1 (US)' },
    { code: '+44', label: '🇬🇧 +44 (UK)' },
    { code: '+971', label: '🇦🇪 +971 (UAE)' }
  ];

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
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
              {user.isLoggedIn ? 'Your Profile Account' : 'Account Gateway Portal'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {user.isLoggedIn && (
              <button 
                onClick={handleSignOut}
                className="neo-btn px-3 py-1.5 rounded-xl text-xs font-mono font-semibold text-slate-500 hover:text-red-500 gap-1.5"
                title="Disconnect Account Credentials"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            )}
            <button 
              onClick={onClose}
              className="neo-btn p-2 rounded-lg text-slate-500 hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* LOADING STATE VIEW */}
        {authLoading && (
          <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-sky-100 animate-pulse" />
              <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
            </div>
            <p className="text-sm font-semibold text-slate-700 animate-pulse mt-2">{authLoadingMessage}</p>
            <p className="text-[10px] text-slate-400 font-mono">SECURE SSL SHIELD ACTIVE</p>
          </div>
        )}

        {/* SUCCESS STATE VIEW */}
        {authSuccessMessage && (
          <div className="py-12 flex flex-col items-center justify-center gap-4 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <CheckCircle className="w-8 h-8 text-emerald-500 animate-bounce" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mt-2">Authentication Cleared</h3>
            <p className="text-sm text-slate-600 px-6">{authSuccessMessage}</p>
            <p className="text-[10px] text-emerald-600 font-mono bg-emerald-50 py-1 px-3 rounded-full mt-2 font-bold uppercase tracking-wider">
              Syncing Session Nodes
            </p>
          </div>
        )}

        {/* LOGGED IN VIEW (Original profile fields & settings, with sign out added) */}
        {!authLoading && !authSuccessMessage && user.isLoggedIn && (
          <>
            {/* Loyalty Reward Program status cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <NeomorphicCard className="p-4" depth="sm">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-1">
                  <span>VIP LOYALTY LEVEL</span>
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
                  <span className="text-xl font-bold text-slate-800">₹1,250</span>
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
                      className="w-full bg-transparent text-xs text-slate-700 outline-none py-1 h-7 font-sans"
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
          </>
        )}

        {/* LOGGED OUT SIGN IN / SIGN UP WORKFLOWS */}
        {!authLoading && !authSuccessMessage && !user.isLoggedIn && (
          <div className="flex flex-col gap-5">
            {/* Introductory Text */}
            <div className="text-center">
              <p className="text-xs font-semibold text-slate-500">
                Sign in to customize, save cover patterns, track bespoke orders, and unlock credits.
              </p>
            </div>

            {/* Custom Neomorphic Tab Selector */}
            <div className="neo-input-wrap p-1 flex justify-between gap-1.5 w-full h-12 rounded-full">
              <button
                onClick={() => setActiveTab('social')}
                className={`flex-1 text-[10px] font-mono font-bold uppercase tracking-wider rounded-full transition-all duration-300 ${activeTab === 'social' ? 'bg-sky-500 text-white shadow-[0_5px_10px_rgba(56,189,248,0.4),inset_0_2px_4px_rgba(255,255,255,0.45),inset_0_-2px_4px_rgba(0,0,0,0.15)] font-black' : 'text-slate-500 hover:text-slate-700 font-bold'}`}
              >
                Direct Social
              </button>
              <button
                onClick={() => setActiveTab('email')}
                className={`flex-1 text-[10px] font-mono font-bold uppercase tracking-wider rounded-full transition-all duration-300 ${activeTab === 'email' ? 'bg-sky-500 text-white shadow-[0_5px_10px_rgba(56,189,248,0.4),inset_0_2px_4px_rgba(255,255,255,0.45),inset_0_-2px_4px_rgba(0,0,0,0.15)] font-black' : 'text-slate-500 hover:text-slate-700 font-bold'}`}
              >
                Email Address
              </button>
              <button
                onClick={() => setActiveTab('phone')}
                className={`flex-1 text-[10px] font-mono font-bold uppercase tracking-wider rounded-full transition-all duration-300 ${activeTab === 'phone' ? 'bg-sky-500 text-white shadow-[0_5px_10px_rgba(56,189,248,0.4),inset_0_2px_4px_rgba(255,255,255,0.45),inset_0_-2px_4px_rgba(0,0,0,0.15)] font-black' : 'text-slate-500 hover:text-slate-700 font-bold'}`}
              >
                Mobile Phone
              </button>
            </div>

            {/* TABS CONTENT: 1. DIRECT SOCIAL */}
            {activeTab === 'social' && (
              <div className="flex flex-col gap-4 py-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest text-center">
                  Instant Authentication Array
                </span>
                
                {/* Google Login button */}
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full neo-btn py-3 px-5 rounded-2xl flex items-center justify-center font-bold text-xs text-slate-700 tracking-wide hover:scale-[1.01] transition-transform"
                >
                  <svg className="w-4.5 h-4.5 mr-3 shrink-0" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                  <span>Continue with Google Account</span>
                </button>

                {/* Apple Login button */}
                <button
                  onClick={handleAppleSignIn}
                  className="w-full neo-btn py-3 px-5 rounded-2xl flex items-center justify-center font-bold text-xs text-slate-700 tracking-wide hover:scale-[1.01] transition-transform"
                >
                  <svg className="w-4.5 h-4.5 mr-3 fill-current text-slate-800 shrink-0" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.57 2.95-1.39z"/>
                  </svg>
                  <span>Continue with Apple Account</span>
                </button>

                <div className="mt-4 p-3 bg-slate-100 rounded-xl flex items-center gap-3 border border-white/20">
                  <ShieldCheck className="w-8 h-8 text-sky-500 shrink-0" />
                  <p className="text-[10px] font-mono text-slate-400 leading-normal text-left">
                    Direct auth leverages secure single sign-on. Your passwords remain encrypted and are never dispatched to our system.
                  </p>
                </div>
              </div>
            )}

            {/* TABS CONTENT: 2. EMAIL ADDRESS */}
            {activeTab === 'email' && (
              <form onSubmit={handleEmailAuthSubmit} className="flex flex-col gap-4 py-1">
                 {/* Switch between Login and Signup */}
                <div className="neo-input-wrap flex p-1 justify-between gap-1.5 w-full h-11 rounded-full mb-1">
                  <button
                    type="button"
                    onClick={() => setEmailMode('login')}
                    className={`flex-1 text-[9px] font-mono font-bold uppercase rounded-full transition-all duration-300 ${emailMode === 'login' ? 'bg-orange-500 text-white shadow-[0_5px_10px_rgba(249,115,22,0.4),inset_0_2px_4px_rgba(255,255,255,0.45),inset_0_-2px_4px_rgba(0,0,0,0.15)] font-black' : 'text-slate-400 hover:text-slate-500 font-bold'}`}
                  >
                    Login Session
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmailMode('signup')}
                    className={`flex-1 text-[9px] font-mono font-bold uppercase rounded-full transition-all duration-300 ${emailMode === 'signup' ? 'bg-orange-500 text-white shadow-[0_5px_10px_rgba(249,115,22,0.4),inset_0_2px_4px_rgba(255,255,255,0.45),inset_0_-2px_4px_rgba(0,0,0,0.15)] font-black' : 'text-slate-400 hover:text-slate-500 font-bold'}`}
                  >
                    Create Account
                  </button>
                </div>

                {emailMode === 'signup' && (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-600 px-1">Full Name</label>
                    <div className="neo-input-wrap px-3 py-1 flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="e.g. Sarah Jenkins"
                        value={fullNameInput} 
                        onChange={(e) => setFullNameInput(e.target.value)}
                        className="w-full bg-transparent text-xs text-slate-700 outline-none py-1 h-7 font-sans"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-600 px-1">Email Address</label>
                  <div className="neo-input-wrap px-3 py-1 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <input 
                      type="email" 
                      placeholder="name@domain.com"
                      value={emailInput} 
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full bg-transparent text-xs text-slate-700 outline-none py-1 h-7 font-sans"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-600 px-1">Secure Password</label>
                  <div className="neo-input-wrap px-3 py-1 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <input 
                        type={passwordVisible ? "text" : "password"} 
                        placeholder="••••••••••••"
                        value={passwordInput} 
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full bg-transparent text-xs text-slate-700 outline-none py-1 h-7 font-sans"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="text-slate-400 hover:text-slate-600 p-1"
                    >
                      {passwordVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="neo-btn-blue w-full mt-4 py-3 px-5 text-xs font-mono font-bold uppercase tracking-wider h-11 flex items-center justify-center gap-1.5"
                >
                  <span>{emailMode === 'login' ? 'Establish Secure Session' : 'Register Creator Profile'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* TABS CONTENT: 3. MOBILE PHONE */}
            {activeTab === 'phone' && (
              <div className="flex flex-col gap-4 py-1">
                {phoneStep === 'input' ? (
                  <form onSubmit={handlePhoneRequestOtp} className="flex flex-col gap-4">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest text-center">
                      Cellular SMS Gateway Access
                    </span>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-600 px-1">Mobile Phone Number</label>
                      <div className="flex gap-2">
                        {/* Custom Dropdown for country code */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                            className="neo-input-wrap px-3 py-1 flex items-center gap-1 text-xs text-slate-700 h-10 font-bold whitespace-nowrap"
                          >
                            <span>{countryCode}</span>
                            <ChevronDown className="w-3 h-3 text-slate-400" />
                          </button>

                          {isCountryDropdownOpen && (
                            <div className="absolute top-11 left-0 w-36 bg-[#F0F2F5] neo-out p-1.5 flex flex-col gap-1 z-30 rounded-xl">
                              {countries.map((c) => (
                                <button
                                  key={c.code}
                                  type="button"
                                  onClick={() => {
                                    setCountryCode(c.code);
                                    setIsCountryDropdownOpen(false);
                                  }}
                                  className="w-full text-left py-1.5 px-2 text-[10px] text-slate-600 rounded-lg hover:bg-slate-200 transition-colors font-mono"
                                >
                                  {c.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Phone Number Input */}
                        <div className="neo-input-wrap px-3 py-1 flex items-center flex-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                          <input 
                            type="tel" 
                            placeholder="98765 43210"
                            value={phoneNo} 
                            onChange={(e) => setPhoneNo(e.target.value.replace(/\D/g, ''))}
                            className="w-full bg-transparent text-xs text-slate-700 outline-none py-1 h-7 font-mono tracking-wider"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="neo-btn-orange w-full py-3 px-5 text-xs font-mono font-bold uppercase tracking-wider h-11 flex items-center justify-center gap-1.5"
                    >
                      <span>Send One-Time Passcode</span>
                      <Smartphone className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleOtpVerifySubmit} className="flex flex-col gap-4">
                    <button
                      type="button"
                      onClick={() => setPhoneStep('input')}
                      className="neo-btn px-2.5 py-1 text-[10px] text-slate-500 font-mono flex items-center gap-1 self-start rounded-lg hover:text-sky-500"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>Edit Phone Number</span>
                    </button>

                    <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100 flex flex-col gap-1 text-left">
                      <span className="text-[10px] font-bold font-mono text-emerald-600 uppercase tracking-wide flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        One-Time Passcode Dispatched
                      </span>
                      <p className="text-[10px] text-slate-500 leading-normal mt-0.5">
                        A unique 4-digit code has been dispatched to <span className="font-bold text-slate-700">{countryCode} {phoneNo.slice(0, 3)}••• ••{phoneNo.slice(-2)}</span>. Enter it below to authorize.
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-slate-600 px-1 text-center">Enter 4-Digit Verification Code</label>
                      <div className="flex justify-center gap-3 py-2">
                        {otp.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={el => { otpInputsRef.current[idx] = el; }}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                            className="w-12 h-14 bg-transparent text-center text-lg font-bold text-slate-700 neo-input-wrap focus:border-sky-500 outline-none transition-all font-mono"
                            required
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-1 text-[10px] text-slate-400 font-mono">
                      <span>Gateway ID: #98221</span>
                      {otpTimer > 0 ? (
                        <span>Resend active in <span className="font-bold text-slate-500">{otpTimer}s</span></span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setOtpTimer(59);
                            setOtp(['', '', '', '']);
                          }}
                          className="text-sky-500 hover:text-sky-600 hover:underline font-bold flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Resend OTP Code</span>
                        </button>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={otp.join('').length < 4}
                      className="neo-btn-blue w-full py-3 px-5 text-xs font-mono font-bold uppercase tracking-wider h-11 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <span>Verify & Access Account</span>
                      <KeyRound className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        )}
      </NeomorphicCard>
    </div>
  );
}

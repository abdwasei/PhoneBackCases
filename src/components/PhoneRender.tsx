/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CustomCoverConfig } from '../types';

interface PhoneRenderProps {
  imageType: 'silicone-blue' | 'clear' | 'abstract' | 'leather-orange' | 'leather-brown' | 'paisley' | 'navy' | 'custom';
  customConfig?: CustomCoverConfig;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function PhoneRender({ imageType, customConfig, className = '', size = 'md' }: PhoneRenderProps) {
  // Determine scale
  const sizeClasses = {
    sm: 'w-24 h-40',
    md: 'w-44 h-72',
    lg: 'w-56 h-96'
  };

  // Setup styles based on case types
  let caseColor = '#38bdf8'; // sky blue initial
  let hasStitching = false;
  let hasTexture = false;
  let caseBackground: React.ReactNode = null;

  const currentType = imageType === 'custom' && customConfig ? customConfig.pattern : imageType;
  const currentColor = imageType === 'custom' && customConfig ? customConfig.color : '';

  // 1. Resolve colors and backdrops
  switch (imageType) {
    case 'silicone-blue':
      caseColor = '#38bdf8';
      break;
    case 'clear':
      caseColor = 'rgba(241, 245, 249, 0.35)'; // semi-transparent
      break;
    case 'abstract':
      caseColor = '#f97316';
      break;
    case 'leather-orange':
      caseColor = '#ea580c';
      hasStitching = true;
      break;
    case 'leather-brown':
      caseColor = '#854d0e';
      hasStitching = true;
      break;
    case 'paisley':
      caseColor = '#1e3a8a';
      break;
    case 'navy':
      caseColor = '#1e293b';
      break;
    case 'custom':
      if (customConfig) {
        caseColor = customConfig.color;
        if (customConfig.pattern === 'leather') {
          hasStitching = true;
        }
      }
      break;
  }

  // 2. Resolve pattern designs
  if (imageType === 'abstract') {
    caseBackground = (
      <g>
        <defs>
          <linearGradient id="abstractGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="60%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#abstractGrad)" />
        {/* Dynamic Wave Splashes */}
        <path d="M-20,40 Q30,120 120,50 T240,160 L240,280 L-20,280 Z" fill="#0891b2" opacity="0.35" />
        <path d="M-20,100 Q80,180 180,110 T300,220 L300,320 L-20,320 Z" fill="#e11d48" opacity="0.2" />
        <path d="M-10,180 C60,200 80,120 180,170 C240,200 260,230 310,240 L310,320 L-10,320 Z" fill="#1e1b4b" opacity="0.4" />
      </g>
    );
  } else if (imageType === 'paisley') {
    caseBackground = (
      <g>
        <rect width="100%" height="100%" fill="#101b37" />
        {/* Intricate Paisley SVGs or procedural aesthetic vectors */}
        <g stroke="rgba(56, 189, 248, 0.15)" strokeWidth="1.5" fill="none">
          <circle cx="40" cy="80" r="30" />
          <path d="M40,50 Q60,60 50,80 T30,110 Z" fill="rgba(56, 189, 248, 0.1)" />
          <circle cx="120" cy="180" r="45" />
          <path d="M120,135 Q145,150 135,180 T105,225 Z" fill="rgba(56, 189, 248, 0.12)" />
          <circle cx="60" cy="260" r="25" />
          <path d="M60,235 Q75,245 70,260 T50,285 Z" fill="rgba(56, 189, 248, 0.08)" />
          <path d="M10,-10 C40,40 20,80 80,100" />
          <path d="M120,80 C150,120 130,160 190,180" />
        </g>
        {/* Gold accents to reflect luxury styling */}
        <g stroke="#eab308" strokeWidth="0.75" fill="none" opacity="0.3">
          <path d="M40,50 L40,45" />
          <circle cx="40" cy="80" r="8" />
          <circle cx="120" cy="180" r="12" />
          <path d="M110,180 A10,10 0 0,1 130,180" />
        </g>
      </g>
    );
  } else if (imageType === 'clear') {
    caseBackground = (
      <g>
        {/* Inside details representing the back of a silver iPhone */}
        <rect width="100%" height="100%" fill="#f1f5f9" />
        {/* Battery charging coil indicator */}
        <circle cx="100" cy="155" r="34" fill="none" stroke="#cbd5e1" strokeWidth="3" opacity="0.6" strokeDasharray="6 3" />
        <rect x="96" y="196" width="8" height="24" rx="2" fill="#cbd5e1" opacity="0.6" />
        {/* Subtle Apple logo */}
        <path d="M100,102 C101.5,102 105,99 108,102 C111,105 110,111 106,115 C102.5,118.5 97.5,118.5 94,115 C90,111 89,105 92,102 C95,99 98.5,102 100,102 Z" fill="#94a3b8" opacity="0.18" />
        <path d="M100,98 C102,94 105,94 105,94 C105,94 104,97 101,99 C99,101 98,100 98,100 Z" fill="#94a3b8" opacity="0.18" />
        
        {/* Clear gel case border outline */}
        <rect x="2" y="2" width="196" height="316" rx="34" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="4" />
        <rect x="4" y="4" width="192" height="312" rx="32" fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="1" />
      </g>
    );
  } else if (imageType === 'custom' && customConfig) {
    if (customConfig.pattern === 'marble') {
      caseBackground = (
        <g>
          <rect width="100%" height="100%" fill={caseColor} />
          {/* Liquid Swirls */}
          <path d="M-20,0 Q60,100 120,40 T240,120 L240,320 L-20,320 Z" fill="rgba(255,255,255,0.18)" />
          <path d="M220,-20 Q140,120 80,180 T-20,220 L-20,0 L220,0 Z" fill="rgba(0,0,0,0.12)" />
          <path d="M10,80 C110,140 30,220 180,240" stroke="rgba(255,255,255,0.25)" strokeWidth="4" fill="none"/>
          <path d="M-10,150 C80,180 120,100 210,180" stroke="rgba(0,0,0,0.08)" strokeWidth="3" fill="none"/>
        </g>
      );
    } else if (customConfig.pattern === 'paisley') {
      caseBackground = (
        <g>
          <rect width="100%" height="100%" fill={caseColor} />
          <g stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none">
            <circle cx="50" cy="100" r="35" strokeDasharray="2 3" />
            <path d="M50,65 Q75,75 65,100 T35,135 Z" fill="rgba(255,255,255,0.08)" />
            <circle cx="130" cy="220" r="40" strokeDasharray="3 3"/>
            <path d="M130,180 Q150,195 140,220 T110,255 Z" fill="rgba(255,255,255,0.08)" />
          </g>
        </g>
      );
    } else if (customConfig.pattern === 'wave') {
      caseBackground = (
        <g>
          <rect width="100%" height="100%" fill={caseColor} />
          <path d="M0,120 Q50,60 100,120 T200,120 L200,320 L0,320 Z" fill="rgba(255,255,255,0.15)" />
          <path d="M0,160 Q50,110 100,160 T200,160 L200,320 L0,320 Z" fill="rgba(0,0,0,0.1)" />
          <path d="M0,80 Q50,140 100,80 T200,80 L200,320 L0,320 Z" fill="rgba(255,255,255,0.08)" />
        </g>
      );
    } else {
      // Solid/Leather
      caseBackground = <rect width="100%" height="100%" fill={caseColor} />;
    }
  } else {
    // Solid Silicone/Navy
    caseBackground = <rect width="100%" height="100%" fill={caseColor} />;
  }

  return (
    <div className={`relative ${sizeClasses[size]} ${className} shrink-0`} style={{ perspective: '800px' }}>
      {/* 3D Angled Container */}
      <div 
        className="w-full h-full transition-transform duration-500 ease-out hover:rotate-y-6 hover:rotate-x-2"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Full Case Blueprint */}
        <svg 
          viewBox="0 0 200 320" 
          className="w-full h-full drop-shadow-[5px_10px_15px_rgba(0,0,0,0.18)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base Case Outer Curve */}
          <clipPath id="caseClip">
            <rect x="0" y="0" width="200" height="320" rx="35" />
          </clipPath>

          <g clipPath="url(#caseClip)">
            {/* Color/Pattern Background */}
            {caseBackground}

            {/* Micro Leather Texture Overlay if leather */}
            {(hasStitching || imageType === 'leather-orange' || imageType === 'leather-brown') && (
              <rect 
                width="100%" 
                height="100%" 
                fill="#000000" 
                opacity="0.04" 
                style={{ mixBlendMode: 'overlay' }}
                filter="url(#leatherNoise)"
              />
            )}

            {/* Realistic Leather Stitching border */}
            {(hasStitching || imageType === 'leather-orange' || imageType === 'leather-brown') && (
              <rect 
                x="8" 
                y="8" 
                width="184" 
                height="304" 
                rx="27" 
                fill="none" 
                stroke="rgba(0,0,0,0.22)" 
                strokeDasharray="6 4" 
                strokeWidth="1.5"
              />
            )}

            {/* Apple / Brand Logo in center if Apple-compatible */}
            {imageType !== 'clear' && imageType !== 'custom' && (
              <path 
                d="M100,152 C101.5,152 105,149 108,152 C111,155 110,161 106,165 C102.5,168.5 97.5,168.5 94,165 C90,161 89,155 92,152 C95,149 98.5,152 100,152 Z" 
                fill="currentColor" 
                className="text-black/15" 
              />
            )}
            {imageType !== 'clear' && imageType !== 'custom' && (
              <path 
                d="M100,148 C102,144 105,144 105,144 C105,144 104,147 101,149 C99,151 98,150 98,150 Z" 
                fill="currentColor" 
                className="text-black/15" 
              />
            )}

            {/* Customizer Overlay Text */}
            {imageType === 'custom' && customConfig && customConfig.customText && (
              <g>
                <text
                  x="100"
                  y="180"
                  textAnchor="middle"
                  fill={customConfig.textColor || '#ffffff'}
                  fontFamily="system-ui"
                  fontWeight="bold"
                  fontSize="20"
                  letterSpacing="1"
                  opacity="0.9"
                  style={{ textShadow: '1px 2px 4px rgba(0,0,0,0.3)' }}
                >
                  {customConfig.customText}
                </text>
              </g>
            )}

            {/* Shadow overlay to give depth / cushion around the screen */}
            <rect 
              x="0" 
              y="0" 
              width="200" 
              height="320" 
              rx="35" 
              fill="none" 
              stroke="rgba(0,0,0,0.12)" 
              strokeWidth="3.5" 
            />

            {/* Extreme Neomorphic glossy light projection across the whole phone */}
            <path 
              d="M-50,0 L200,-50 L100,320 L-200,320 Z" 
              fill="url(#glareGrad)" 
              opacity="0.22" 
              style={{ mixBlendMode: 'overlay', pointerEvents: 'none' }} 
            />
          </g>

          {/* Premium Camera Module Ring (matching the exact 3D triple ring structure!) */}
          {/* Module Base Plate */}
          <g>
            {/* The base camera plate card has a soft neomorphic push/indent behavior */}
            <rect 
              x="18" 
              y="18" 
              width="60" 
              height="60" 
              rx="16" 
              fill={imageType === 'clear' ? 'rgba(255,255,255,0.7)' : caseColor} 
              stroke="rgba(0,0,0,0.06)" 
              strokeWidth="0.5" 
              className="drop-shadow-[1px_2px_4px_rgba(0,0,0,0.14)]"
            />
            {/* Glossy bezel ring around camera platform */}
            <rect 
              x="19" 
              y="19" 
              width="58" 
              height="58" 
              rx="15" 
              fill="none" 
              stroke="rgba(255,255,255,0.45)" 
              strokeWidth="1" 
            />

            {/* Lens 1 (Top Left) */}
            <circle cx="35" cy="35" r="11" fill="#1e293b" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <circle cx="35" cy="35" r="9" fill="#090d16" />
            <circle cx="35" cy="35" r="4" fill="#030712" />
            {/* Reflection on Lens */}
            <circle cx="32" cy="32" r="2.5" fill="#ffffff" opacity="0.6" />

            {/* Lens 2 (Bottom Left) */}
            <circle cx="35" cy="61" r="11" fill="#1e293b" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <circle cx="35" cy="61" r="9" fill="#090d16" />
            <circle cx="35" cy="61" r="4" fill="#030712" />
            <circle cx="32" cy="58" r="2.5" fill="#ffffff" opacity="0.6" />

            {/* Lens 3 (Right Center) */}
            <circle cx="61" cy="48" r="11" fill="#1e293b" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <circle cx="61" cy="48" r="9" fill="#090d16" />
            <circle cx="61" cy="48" r="4" fill="#030712" />
            <circle cx="58" cy="45" r="2.5" fill="#ffffff" opacity="0.6" />

            {/* Flash & Lidar cutout */}
            <circle cx="61" cy="31" r="3.5" fill="#fef08a" opacity="0.9" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
            <circle cx="59" cy="29" r="1" fill="#ffffff" />
            <circle cx="61" cy="63" r="2" fill="#111827" />
          </g>

          {/* Definitions */}
          <defs>
            <linearGradient id="glareGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="30%" stopColor="#ffffff" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.0" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.3" />
            </linearGradient>

            <filter id="leatherNoise">
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" result="noise" />
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.12 0" />
              <feComposite operator="in" in2="SourceGraphic" />
            </filter>
          </defs>
        </svg>

        {/* 3D Side Depth Edges */}
        <div 
          className="absolute inset-[2px] rounded-[34px] -z-10 pointer-events-none"
          style={{
            transform: 'translateZ(-4px)',
            background: 'rgba(0,0,0,0.15)',
            filter: 'blur(2px)'
          }}
        />
      </div>
    </div>
  );
}

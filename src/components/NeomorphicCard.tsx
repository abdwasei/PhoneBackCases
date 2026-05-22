/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

interface NeomorphicCardProps {
  children: React.ReactNode;
  className?: string;
  depth?: 'sm' | 'md' | 'lg';
  inset?: boolean;
  onClick?: () => void;
  whileHover?: any;
  whileTap?: any;
  id?: string;
  key?: any;
}

export default function NeomorphicCard({
  children,
  className = '',
  depth = 'md',
  inset = false,
  onClick,
  whileHover,
  whileTap,
  id
}: NeomorphicCardProps) {
  
  const getShadowClass = () => {
    if (inset) {
      return depth === 'sm' ? 'neo-in' : 'neo-in-deep';
    }
    
    switch (depth) {
      case 'sm':
        return 'neo-out-sm';
      case 'lg':
        return 'neo-out-lg';
      case 'md':
      default:
        return 'neo-out';
    }
  };

  const Component = onClick ? motion.div : 'div';

  const motionProps = onClick ? {
    whileHover: whileHover || { y: -3, transition: { duration: 0.2 } },
    whileTap: whileTap || { y: 1, transition: { duration: 0.1 } },
    onClick
  } : {};

  return (
    <Component
      id={id}
      className={`${getShadowClass()} ${className}`}
      {...motionProps}
    >
      {children}
    </Component>
  );
}

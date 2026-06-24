/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Icons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export default function DynamicIcon({ name, className = '', size = 20 }: DynamicIconProps) {
  // Map standard string keys to Lucide icon components
  const LucideIcon = (Icons as any)[name];
  
  if (!LucideIcon) {
    // Fallback icon if the requested one doesn't exist
    const Fallback = Icons.CircleHelp || Icons.HelpCircle;
    return <Fallback className={className} size={size} />;
  }

  return <LucideIcon className={className} size={size} />;
}

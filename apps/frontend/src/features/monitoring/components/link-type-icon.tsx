'use client';

import { LinkType } from '@/features/monitoring/types';
import { Wifi, Cable, Radio, Satellite } from 'lucide-react';
import { cn } from '@/lib/utils';

type LinkTypeIconProps = {
  linkType: LinkType;
  className?: string;
  size?: number;
};

const iconMap: Record<LinkType, typeof Wifi> = {
  ethernet: Cable,
  wifi: Wifi,
  cellular: Radio,
  satellite: Satellite,
};

export function LinkTypeIcon({ linkType, className, size = 16 }: LinkTypeIconProps) {
  const Icon = iconMap[linkType] || Cable;
  return <Icon className={cn('flex-shrink-0', className)} size={size} aria-hidden="true" />;
}


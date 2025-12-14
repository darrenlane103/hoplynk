export type LinkType = 'ethernet' | 'wifi' | 'cellular' | 'satellite';

export interface NetworkInterface {
  id: string;
  device_id: string;
  name: string;
  link_type: LinkType;
  provider: string;
  priority: number;
}

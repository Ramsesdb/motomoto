export type ChannelType = 'whatsapp' | 'instagram' | 'facebook' | 'sms' | 'email';

export interface Channel {
  id: string;
  type: ChannelType;
  name: string;
  /** External identifier (phone number, page ID, email address, etc.) */
  identifier: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

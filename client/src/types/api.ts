// Client-side API types (without server dependencies)
export interface User {
  id: number;
  email: string;
  name?: string;
  firstName?: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Sermon {
  id: number;
  title: string;
  speaker: string;
  date: string;
  videoUrl?: string;
  audioUrl?: string;
  series?: string;
  description?: string;
  thumbnailUrl?: string;
  createdAt: string;
}

export interface PrayerRequest {
  id: number;
  userId?: string;
  authorName?: string;
  content: string;
  isAnonymous?: boolean;
  createdAt: string;
  prayCount?: number;
}

export interface Donation {
  id: number;
  amount: number;
  currency: string;
  donorName?: string;
  donorEmail?: string;
  isAnonymous?: boolean;
  message?: string;
  createdAt: string;
}

// Insert types (for creating new records)
export type InsertEvent = Omit<Event, 'id' | 'createdAt'>;
export type InsertSermon = Omit<Sermon, 'id' | 'createdAt'>;
export type InsertPrayerRequest = Omit<PrayerRequest, 'id' | 'createdAt' | 'prayCount'>;
export type InsertDonation = Omit<Donation, 'id' | 'createdAt'>;
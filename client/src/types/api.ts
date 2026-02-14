// Client-side API types (without server dependencies)
export type UserRole = 
  | 'MEMBER'
  | 'USER' 
  | 'ADMIN' 
  | 'PASTOR' 
  | 'PASTORS_WIFE' 
  | 'CHILDREN_LEADER' 
  | 'CHOIRMASTER' 
  | 'CHORISTER' 
  | 'SOUND_EQUIPMENT' 
  | 'SECURITY' 
  | 'USHERS_LEADER' 
  | 'USHER' 
  | 'SUNDAY_SCHOOL_TEACHER' 
  | 'CELL_LEADER' 
  | 'PRAYER_TEAM' 
  | 'FINANCE_TEAM' 
  | 'TECH_TEAM' 
  | 'DECOR_TEAM' 
  | 'EVANGELISM_TEAM';

export const USER_ROLES: { value: UserRole; label: string }[] = [
  { value: 'MEMBER', label: 'Member' },
  { value: 'USER', label: 'User' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'PASTOR', label: 'Pastor' },
  { value: 'PASTORS_WIFE', label: "Pastor's Wife" },
  { value: 'CHILDREN_LEADER', label: 'Children Leader' },
  { value: 'CHOIRMASTER', label: 'Choirmaster' },
  { value: 'CHORISTER', label: 'Chorister' },
  { value: 'SOUND_EQUIPMENT', label: 'Sound Equipment' },
  { value: 'SECURITY', label: 'Security' },
  { value: 'USHERS_LEADER', label: 'Ushers Leader' },
  { value: 'USHER', label: 'Usher' },
  { value: 'SUNDAY_SCHOOL_TEACHER', label: 'Sunday School Teacher' },
  { value: 'CELL_LEADER', label: 'Cell Leader' },
  { value: 'PRAYER_TEAM', label: 'Prayer Team' },
  { value: 'FINANCE_TEAM', label: 'Finance Team' },
  { value: 'TECH_TEAM', label: 'Tech Team' },
  { value: 'DECOR_TEAM', label: 'Decor Team' },
  { value: 'EVANGELISM_TEAM', label: 'Evangelism Team' },
];

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  houseFellowship?: string;
  parish?: string;
  role?: UserRole;
  isAdmin?: boolean;
  isVerified?: boolean;
  createdAt?: string;
}

export interface UpdateUserProfile {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  houseFellowship?: string;
  parish?: string;
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
  topic?: string;
  videoUrl?: string;
  videoFilePath?: string;
  audioUrl?: string;
  audioFilePath?: string;
  series?: string;
  description?: string;
  thumbnailUrl?: string;
  isUpcoming?: boolean;
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

// Extended types for filters
export interface SermonFilters {
  speaker?: string;
  series?: string;
  status?: "upcoming" | "past";
}

export interface ShareLinks {
  x: string;
  whatsapp: string;
  email: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  copyLink: string;
}

export interface DownloadInfo {
  url: string;
  filename: string;
  title: string;
}
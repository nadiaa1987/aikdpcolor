
import { ColoringPage, UserProfile } from '../types';

const STORAGE_KEY = 'kdp_colormaster_history';
const PROFILE_KEY = 'kdp_colormaster_user';

export const saveGeneration = (page: ColoringPage) => {
  const history = getHistory();
  const updated = [page, ...history];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  updateStats(1);
};

export const getHistory = (): ColoringPage[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const deleteGeneration = (id: string) => {
  const history = getHistory();
  const updated = history.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getUserProfile = (): UserProfile => {
  const stored = localStorage.getItem(PROFILE_KEY);
  if (stored) return JSON.parse(stored);
  
  // Set default plan to Pro with unlimited-like credits for immediate "Unlimited" experience
  const defaultProfile: UserProfile = {
    id: 'user-admin',
    email: 'unlimited_creator@kdpmaster.ai',
    plan: 'Pro',
    generationsRemaining: 999999,
    totalGenerated: 0
  };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(defaultProfile));
  return defaultProfile;
};

const updateStats = (count: number) => {
  const profile = getUserProfile();
  profile.totalGenerated += count;
  // If Pro, we don't really need to decrement, but for tracking we can keep it high
  if (profile.plan !== 'Pro') {
    profile.generationsRemaining = Math.max(0, profile.generationsRemaining - count);
  }
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

export const resetDailyLimit = () => {
  const profile = getUserProfile();
  profile.generationsRemaining = profile.plan === 'Free' ? 5 : 999999;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

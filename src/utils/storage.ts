import { LearnerProfile } from '../types/workshop';

const STORAGE_KEY = 'fde_workshop_learner_profile';

export const DEFAULT_LEARNER_PROFILE: LearnerProfile = {
  name: '',
  targetRole: 'Palantir Forward Deployment Engineer (FDE)',
  experienceLevel: 'Mid-Level Software Engineer',
  startedAt: new Date().toISOString(),
  completedDays: [],
  currentDay: 1,
  earnedBadges: [],
  xp: 0,
  codeDrafts: {},
  certificateIssued: false,
  certificateId: `FDE-KN-${Math.floor(10000 + Math.random() * 90000)}`,
  hasAgreedToFounderNote: false,
  isAuthenticated: false,
};

export function loadLearnerProfile(): LearnerProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_LEARNER_PROFILE;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load profile from localStorage', err);
    return DEFAULT_LEARNER_PROFILE;
  }
}

export function saveLearnerProfile(profile: LearnerProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile to localStorage', err);
  }
}

export function resetProgress(profile: LearnerProfile): LearnerProfile {
  const reset: LearnerProfile = {
    ...profile,
    completedDays: [],
    currentDay: 1,
    earnedBadges: [],
    xp: 0,
    codeDrafts: {},
    certificateIssued: false,
  };
  saveLearnerProfile(reset);
  return reset;
}

export function signOutLearner(profile: LearnerProfile): LearnerProfile {
  const signedOut: LearnerProfile = {
    ...profile,
    isAuthenticated: false,
  };
  saveLearnerProfile(signedOut);
  return signedOut;
}

export function fullSystemReset(): LearnerProfile {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_LEARNER_PROFILE;
}

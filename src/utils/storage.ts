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
  dailyAssessmentAttempts: {},
  dailyAssessmentScores: {},
  unlockedDailyBadges: [],
  finalAssessmentAttempts: 0,
  finalAssessmentScore: 0,
  finalAssessmentPassed: false,
  finalAssessmentAnswers: {},
};

export function loadLearnerProfile(): LearnerProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_LEARNER_PROFILE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_LEARNER_PROFILE,
      ...parsed,
      dailyAssessmentAttempts: parsed.dailyAssessmentAttempts || {},
      dailyAssessmentScores: parsed.dailyAssessmentScores || {},
      unlockedDailyBadges: parsed.unlockedDailyBadges || [],
      finalAssessmentAttempts: parsed.finalAssessmentAttempts || 0,
      finalAssessmentScore: parsed.finalAssessmentScore || 0,
      finalAssessmentPassed: !!parsed.finalAssessmentPassed,
      finalAssessmentAnswers: parsed.finalAssessmentAnswers || {},
    };
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
    dailyAssessmentAttempts: {},
    dailyAssessmentScores: {},
    unlockedDailyBadges: [],
    finalAssessmentAttempts: 0,
    finalAssessmentScore: 0,
    finalAssessmentPassed: false,
    finalAssessmentAnswers: {},
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

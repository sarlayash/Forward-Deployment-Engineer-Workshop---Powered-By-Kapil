/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CURRICULUM_DATA } from './data/curriculumData';
import { BADGES_DATA } from './data/badgesData';
import { LearnerProfile } from './types/workshop';
import {
  loadLearnerProfile,
  saveLearnerProfile,
  resetProgress,
  signOutLearner,
  fullSystemReset,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { IDEWorkspace } from './components/IDEWorkspace';
import { CurriculumOverview } from './components/CurriculumOverview';
import { BadgesView } from './components/BadgesView';
import { CertificateView } from './components/CertificateView';
import { InterviewPlaybookView } from './components/InterviewPlaybookView';
import { MentorKapilView } from './components/MentorKapilView';
import { OnboardingModal } from './components/OnboardingModal';
import { FounderWelcomeView } from './components/FounderWelcomeView';
import { LoginPage } from './components/LoginPage';

export default function App() {
  const [learner, setLearner] = useState<LearnerProfile>(loadLearnerProfile);
  const [currentTab, setCurrentTab] = useState<string>('curriculum');
  const [selectedDayId, setSelectedDayId] = useState<number>(learner.currentDay || 1);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [reviewingFounderNote, setReviewingFounderNote] = useState<boolean>(false);

  // Sync profile changes to state and localStorage
  const updateLearner = (newProfile: LearnerProfile) => {
    setLearner(newProfile);
    saveLearnerProfile(newProfile);
  };

  // Sign Off handler
  const handleSignOff = () => {
    const signedOut = signOutLearner(learner);
    setLearner(signedOut);
  };

  // Reset Progress handler
  const handleResetProgress = () => {
    if (
      window.confirm(
        'Are you sure you want to reset your bootcamp progress? All completed days, test records, earned badges, and code drafts will be reset to Day 1.'
      )
    ) {
      const reset = resetProgress(learner);
      setLearner(reset);
      setSelectedDayId(1);
      setCurrentTab('curriculum');
      alert('Your bootcamp progress has been reset to Day 1.');
    }
  };

  // Handle completion of a day in the IDE
  const handleCompleteDay = (dayId: number, xpReward: number, codeDraft: string) => {
    const isAlreadyCompleted = learner.completedDays.includes(dayId);
    const updatedCompleted = isAlreadyCompleted
      ? learner.completedDays
      : [...learner.completedDays, dayId].sort((a, b) => a - b);

    const updatedXp = isAlreadyCompleted ? learner.xp : learner.xp + xpReward;

    // Check newly earned badges
    const newlyEarnedBadges = [...learner.earnedBadges];
    BADGES_DATA.forEach((badge) => {
      const hasAllMilestones = badge.milestoneDays.every((d) =>
        updatedCompleted.includes(d)
      );
      if (hasAllMilestones && !newlyEarnedBadges.includes(badge.id)) {
        newlyEarnedBadges.push(badge.id);
      }
    });

    const isAllComplete = updatedCompleted.length >= CURRICULUM_DATA.length;

    const updatedProfile: LearnerProfile = {
      ...learner,
      completedDays: updatedCompleted,
      currentDay: Math.min(15, Math.max(learner.currentDay, dayId + 1)),
      xp: updatedXp,
      earnedBadges: newlyEarnedBadges,
      codeDrafts: {
        ...learner.codeDrafts,
        [dayId]: codeDraft,
      },
      certificateIssued: isAllComplete,
    };

    updateLearner(updatedProfile);
  };

  // 1. Initial State: Founder's Note screen if not yet agreed or when explicitly reviewed
  if (!learner.hasAgreedToFounderNote || reviewingFounderNote) {
    return (
      <FounderWelcomeView
        onAgreeAndProceed={() => {
          updateLearner({
            ...learner,
            hasAgreedToFounderNote: true,
          });
          setReviewingFounderNote(false);
        }}
        onReset={() => {
          if (window.confirm('Reset all saved learner credentials and progress?')) {
            const fresh = fullSystemReset();
            setLearner(fresh);
            setReviewingFounderNote(false);
          }
        }}
        onSignOff={handleSignOff}
      />
    );
  }

  // 2. Second State: Login / Identity Setup page if not authenticated
  if (!learner.isAuthenticated) {
    return (
      <LoginPage
        currentProfile={learner}
        onLogin={(authedProfile) => {
          updateLearner(authedProfile);
        }}
        onBackToFounderNote={() => {
          setReviewingFounderNote(true);
        }}
        onReset={() => {
          if (window.confirm('Reset all saved learner credentials and progress?')) {
            const fresh = fullSystemReset();
            setLearner(fresh);
          }
        }}
      />
    );
  }

  // 3. Authenticated State: Full Forward Deployment Workshop
  const selectedDay =
    CURRICULUM_DATA.find((d) => d.id === selectedDayId) || CURRICULUM_DATA[0];

  const handleOpenDayInIDE = (dayId: number) => {
    setSelectedDayId(dayId);
    setCurrentTab('ide');
  };

  return (
    <div className="min-h-screen bg-[#FBF8F3] text-[#24150D] flex flex-col font-sans selection:bg-[#7C3E1D] selection:text-[#FAF6EE]">
      {/* Top Bar adhering to Top Bar Contract */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        learner={learner}
        onOpenProfile={() => setShowProfileModal(true)}
        onSignOff={handleSignOff}
        onResetProgress={handleResetProgress}
        onViewFounderNote={() => setReviewingFounderNote(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {currentTab === 'curriculum' && (
          <CurriculumOverview
            curriculum={CURRICULUM_DATA}
            learner={learner}
            onSelectDay={setSelectedDayId}
            onOpenIDE={() => setCurrentTab('ide')}
          />
        )}

        {currentTab === 'ide' && (
          <IDEWorkspace
            day={selectedDay}
            allDays={CURRICULUM_DATA}
            learner={learner}
            onSelectDay={setSelectedDayId}
            onCompleteDay={handleCompleteDay}
          />
        )}

        {currentTab === 'badges' && (
          <BadgesView
            learner={learner}
            onOpenIDEForDay={handleOpenDayInIDE}
          />
        )}

        {currentTab === 'certificate' && (
          <CertificateView
            learner={learner}
            totalDays={CURRICULUM_DATA.length}
          />
        )}

        {currentTab === 'interview' && <InterviewPlaybookView />}

        {currentTab === 'mentor' && <MentorKapilView />}
      </main>

      {/* Learner Profile Customization Modal */}
      <OnboardingModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        currentProfile={learner}
        onSaveProfile={(updated) => {
          updateLearner(updated);
          setShowProfileModal(false);
        }}
        isFirstTime={false}
      />
    </div>
  );
}

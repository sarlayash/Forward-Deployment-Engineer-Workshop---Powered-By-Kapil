export type WorkshopCategory = 
  | 'Ingestion & Connectors'
  | 'Ontology & Graph'
  | 'Production AI & RAG'
  | 'Incident & Operations'
  | 'Architecture & Defense';

export interface TestCase {
  id: string;
  name: string;
  description: string;
  inputSample: string;
  expectedBehavior: string;
  validator: (code: string) => { passed: boolean; message: string; details?: string };
}

export interface DayCurriculum {
  id: number; // 1 to 15
  title: string;
  subtitle: string;
  category: WorkshopCategory;
  clientContext: {
    clientName: string;
    industry: string;
    stakes: string;
    problemSummary: string;
  };
  theory10: {
    conceptTitle: string;
    coreMechanism: string;
    architecturalTradeoffs: string[];
    enterprisePitfalls: string[];
    kapilRule: string;
  };
  handsOn90: {
    missionBrief: string;
    taskObjectives: string[];
    acceptanceCriteria: string[];
  };
  starterCode: string;
  solutionCode: string;
  fileName: string;
  language: 'typescript' | 'python' | 'sql';
  testCases: TestCase[];
  kapilFieldNotes: string;
  xpReward: number;
  badgeMilestoneId?: string;
}

export interface Badge {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  milestoneDays: number[];
  category: string;
  iconName: string;
  requiredXp: number;
}

export interface DailyBadge {
  dayId: number;
  title: string;
  subtitle: string;
  category: WorkshopCategory;
  iconName: string;
  clientMission: string;
  coreCompetency: string;
}

export interface DailyAssessmentQuestion {
  id: string;
  dayId: number;
  question: string;
  scenario?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'Core' | 'Hard';
}

export interface FinalAssessmentQuestion {
  id: number; // 1 to 300
  dayRef: number;
  category: string;
  difficulty: 'Hard' | 'Core';
  scenario: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LearnerProfile {
  name: string;
  targetRole: string;
  experienceLevel: 'Student / Junior Dev' | 'Mid-Level Software Engineer' | 'Senior / Staff Engineer' | 'Data / Solutions Architect';
  startedAt: string;
  completedDays: number[];
  currentDay: number;
  earnedBadges: string[];
  xp: number;
  codeDrafts: Record<number, string>;
  certificateIssued: boolean;
  certificateId: string;
  hasAgreedToFounderNote?: boolean;
  isAuthenticated?: boolean;
  // Assessment tracking with 90% threshold and max 1 re-attempt (2 attempts total)
  dailyAssessmentAttempts: Record<number, number>; // dayId -> attempts count (0, 1, 2)
  dailyAssessmentScores: Record<number, number>; // dayId -> best score %
  unlockedDailyBadges: number[]; // dayIds whose assessment passed >= 90%
  finalAssessmentAttempts: number; // 0, 1, 2 (max 1 re-attempt)
  finalAssessmentScore: number; // score % (0 to 100)
  finalAssessmentPassed: boolean; // true if >= 90%
  finalAssessmentAnswers?: Record<number, number>; // saved question index -> chosen option
}

export interface InterviewQuestion {
  id: string;
  company: 'Palantir' | 'Scale AI' | 'Databricks' | 'OpenAI Enterprise' | 'Snowflake';
  round: 'System Architecture' | 'Live Technical Triage' | 'Client Scoping & Pitch' | 'Production Coding';
  question: string;
  difficulty: 'Hard' | 'Senior' | 'Staff FDE';
  context: string;
  rubric: string[];
  kapilModelAnswer: string;
}

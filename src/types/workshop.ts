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

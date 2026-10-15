import { InterviewQuestion } from '../types/workshop';

export interface InterviewStageGuide {
  stageNumber: number;
  stageName: string;
  interviewerRole: string;
  whatTheyEvaluate: string;
  insiderSecrets: string[];
  kapilStrategy: string;
}

export const INTERVIEW_STAGES: InterviewStageGuide[] = [
  {
    stageNumber: 1,
    stageName: 'Recruiter & Hiring Manager Alignment',
    interviewerRole: 'FDE Lead / Technical Recruiter (30 min)',
    whatTheyEvaluate: 'Customer orientation, technical breadth vs depth, willingness to travel to client sites, and resilience under pressure.',
    insiderSecrets: [
      'They filter out pure theorists: Candidates who want to write isolated algorithms in a vacuum will be disqualified immediately.',
      'Highlight real instances where you debugged production issues directly with stakeholders or customers.',
      'Show genuine passion for client mission (defense, healthcare, finance, logistics).',
    ],
    kapilStrategy: 'Frame your story around the "Triple Threat": You write clean production code, understand distributed data pipelines, and can comfortably explain trade-offs to a non-technical VP.',
  },
  {
    stageNumber: 2,
    stageName: 'Practical Enterprise Coding & Systems Internals',
    interviewerRole: 'Senior Forward Deployment Engineer (60 min)',
    whatTheyEvaluate: 'Writing clean, idiomatic code that handles dirty edge cases: streams, concurrency, graph traversals, and schema migrations.',
    insiderSecrets: [
      'Unlike pure LeetCode interviews, FDE coding tests assess parsing malformed real-world data, rate-limiting, and error resilience.',
      'Always ask about data scale: "Is this in-memory (10,000 records) or streaming (10,000,000 records)?" before picking your data structure.',
      'Never write code without testing edge cases (empty strings, nulls, negative numbers, network timeouts).',
    ],
    kapilStrategy: 'Speak out loud while typing. Write modular helper functions, and write quick unit test assertions at the bottom of your file without being prompted.',
  },
  {
    stageNumber: 3,
    stageName: 'The Infamous Live Debugging & P0 Decompilation Round',
    interviewerRole: 'Staff FDE / Incident Commander (60 min)',
    whatTheyEvaluate: 'Debugging an unfamiliar 10,000-line codebase with an active production memory leak, deadlock, or silent data corruption.',
    insiderSecrets: [
      'The interviewer expects you to be overwhelmed by the codebase size. Do NOT try to read every file.',
      'Formulate hypotheses: "The symptom is memory leak during batch ingest. Let me look for unclosed streams or growing in-memory maps."',
      'Use logging, binary search in git history, and reproduce the bug with a minimal script before attempting a fix.',
    ],
    kapilStrategy: 'Mitigate before optimizing. Show you can triage: "In a real incident, I would first restart the worker pod to buy time, then patch the connection leak."',
  },
  {
    stageNumber: 4,
    stageName: 'Enterprise System Design Under Ambiguous Constraints',
    interviewerRole: 'Principal Solutions Architect (60 min)',
    whatTheyEvaluate: 'Architecting end-to-end solutions inside restrictive client VPCs, handling air-gapped environments, GDPR/HIPAA compliance, and legacy ERP integration.',
    insiderSecrets: [
      'Enterprise clients rarely give you greenfield AWS. You must design around legacy Oracle 11g, strict corporate firewalls, and slow batch exports.',
      'Always address security early: Tenant isolation, RBAC/ABAC, encryption at rest and in transit.',
      'Calculate back-of-the-envelope numbers: Storage growth per month, network bandwidth across VPN tunnels, and API rate limit constraints.',
    ],
    kapilStrategy: 'Draw an explicit "Client Network Boundary" box on the diagram. Label what runs in the client VPC vs what runs on your managed SaaS control plane.',
  },
  {
    stageNumber: 5,
    stageName: 'Executive Pitch & Client De-escalation',
    interviewerRole: 'VP of Forward Deployment / Managing Director (45 min)',
    whatTheyEvaluate: 'Executive presence, consultative problem-solving, turning around dissatisfied clients, and driving 8-figure renewals.',
    insiderSecrets: [
      'The interviewer will roleplay an angry client CTO claiming "Your product broke our billing and we want to cancel our contract."',
      'Never get defensive. Acknowledge the business impact first, outline a clear 3-step action plan, and commit to hourly status updates.',
      'Connect every technical deliverable to business ROI (dollars saved, downtime avoided, man-hours recovered).',
    ],
    kapilStrategy: 'Use the "Acknowledge, Contain, Resolve, Prevent" framework. Never blame the client\'s dirty data in front of their C-suite.',
  },
];

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'q1',
    company: 'Palantir',
    round: 'Live Technical Triage',
    difficulty: 'Senior',
    question: 'A Fortune 10 client reports that our deployed Ontology service is reporting 2-minute query latencies during morning peak hours. You have SSH access to the client VPC bastion host. Walk through your first 15 minutes of investigation.',
    context: 'High-pressure enterprise incident triage with customer visibility.',
    rubric: [
      'Immediate check of system health metrics: CPU, Memory, Disk I/O, Network I/O.',
      'Inspection of database connection pool saturation and slow query logs.',
      'Checking thread dumps for lock contention or GC pauses.',
      'Clear communication cadences to client stakeholders.',
    ],
    kapilModelAnswer: `1. First 3 Minutes (Contain & Assess):
Check top-level health telemetry: 'top', 'vmstat 1', 'iostat -xz 1'. Determine if the bottleneck is CPU bound (bad query/unindexed join), Memory bound (swapping/OOM loop), or Disk I/O bound.
2. Minutes 4-7 (Database & Connection Tier):
Inspect active connections on PostgreSQL / Graph store: 'SELECT state, query, age(clock_timestamp(), query_start) FROM pg_stat_activity WHERE state != 'idle' ORDER BY age DESC;'. Check if connection pool is starved or if an unindexed table scan is holding locks.
3. Minutes 8-11 (Application Profile):
Generate a thread dump ('jstack' or language profiler) to see if threads are blocked on external HTTP microservices or deadlocked on synchronized locks.
4. Minutes 12-15 (Mitigation & Communication):
If a runaway query is identified, safely terminate the rogue PID. Increase pool limits temporarily if resources allow. Post an update to the incident Slack/Teams channel: "Root cause identified as unindexed aggregation on table X during 9 AM payroll sync; mitigated by terminating rogue lock; permanent indexing patch in progress."`,
  },
  {
    id: 'q2',
    company: 'Databricks',
    round: 'System Architecture',
    difficulty: 'Staff FDE',
    question: 'Design a real-time CDC ingestion pipeline that connects an on-premise Oracle ERP database to Delta Lake across a bandwidth-constrained 100Mbps DirectConnect link, processing 15,000 mutations per second with a maximum latency of 30 seconds.',
    context: 'Enterprise data mesh and reverse ETL architecture under strict physical network bottlenecks.',
    rubric: [
      'Calculates bandwidth requirements: 15,000 events/sec * 1KB = 15MB/sec = 120Mbps (exceeds raw 100Mbps link).',
      'Identifies need for on-premise compression (Snappy/Zstandard) or micro-batching to fit within 100Mbps.',
      'Proposes Debezium / Kafka Connect with checkpoint offsets for zero-data-loss restart.',
      'Addresses schema evolution and out-of-order writes in Delta Lake MERGE operations.',
    ],
    kapilModelAnswer: `Bandwidth Math First:
15k events/sec * 1KB avg payload = 15 MB/s = 120 Mbps. This exceeds our 100Mbps pipe! We must apply client-side compression. Using Zstandard or Snappy compresses JSON/Avro payloads by ~70%, reducing network throughput to ~36 Mbps, well within the 100Mbps ceiling.

Architecture:
1. On-Premises Tier: Deploy Debezium CDC agent reading Oracle Redo Logs without touching production tables. Stream events into a lightweight on-prem Kafka cluster.
2. In-Transit Tier: A Kafka MirrorMaker 2 / Flume bridge with TLS + Snappy compression pushing micro-batches over the DirectConnect tunnel.
3. Cloud Ingestion Tier: Spark Structured Streaming job with a 10-second trigger interval writing raw append-only Bronze Delta tables.
4. Silver Layer MERGE: Utilize Delta Lake liquid clustering on (entity_id, event_timestamp) with idempotent MERGE INTO to resolve updates and deletes without table-wide lock contention.`,
  },
  {
    id: 'q3',
    company: 'Scale AI',
    round: 'Client Scoping & Pitch',
    difficulty: 'Hard',
    question: 'A defense client wants to deploy an LLM evaluation and data-annotation pipeline on their air-gapped classified network. They have zero GPUs on-site and cannot connect to any external cloud API. How do you advise them and design the MVP?',
    context: 'Navigating hardware constraints, security clearances, and realistic AI deployment.',
    rubric: [
      'Realistic assessment of hardware: Running LLM evaluation without GPUs requires quantized CPU models (e.g., GGUF via llama.cpp/Ollama) or procuring on-premise GPU nodes.',
      'Air-gapped packaging: Offline container registries, static dependency bundling.',
      'Security compliance: Data never leaves the enclave; local logging without external telemetry.',
      'Setting realistic expectation on model latency on CPU vs GPU.',
    ],
    kapilModelAnswer: `Client Advisory & Honesty:
I would clearly explain the latency realities to the client colonel/director: "Running 70B parameter models purely on CPU will result in 1.5 tokens/second—unacceptable for interactive annotation. We have two viable paths:
Option A (Fastest MVP): Quantize smaller 8B parameter models (e.g. Llama 3 8B at Q4_K_M) optimized with AVX-512 CPU instructions to achieve ~15 tokens/second for evaluation rubrics.
Option B (Production Standard): Advise the client procurement team on expedited hardware requisition for an on-premises 4x NVIDIA A100/H100 PCIe workstation, while we deliver the air-gapped software package."

Air-Gap Architecture:
Package all Docker containers, offline Ollama runtimes, model weights, and PostgreSQL databases into self-contained tar archives signed with SHA-256 hashes. Test the entire installation end-to-end on a disconnected laptop before physical deployment on-site.`,
  },
  {
    id: 'q4',
    company: 'OpenAI Enterprise',
    round: 'Client Scoping & Pitch',
    difficulty: 'Senior',
    question: 'During a live POV with a tier-1 health insurer, their Chief Information Security Officer (CISO) interrupts your demo and asserts: "Your system is sending our protected health information (PHI) to train your public models. We are stopping this meeting." How do you handle this?',
    context: 'High-stakes executive de-escalation with trust and compliance concerns.',
    rubric: [
      'Never argue or show frustration.',
      'Directly address the specific compliance agreement (Zero Data Retention, HIPAA BAA).',
      'Demonstrate technical verification in the audit dashboard.',
      'Turn the skeptic into a champion with proactive governance tools.',
    ],
    kapilModelAnswer: `Response:
"I completely understand your concern, Dr. [Name]. Protecting your patient PHI is the absolute non-negotiable foundation of this entire partnership.

Let me state unequivocally: Under our signed Business Associate Agreement (BAA) and Enterprise Data Privacy policy, zero customer data or prompt inputs are ever used to train, fine-tune, or improve any models.

Furthermore, let me show you our live network audit console right here on screen. Every prompt undergoes local client-side PII masking before transmission via a dedicated Zero Data Retention (ZDR) endpoint where data is processed in ephemeral memory and discarded immediately upon response generation.

Would you like me to pause the feature demo right now and walk you through the cryptographic audit logs and our SOC2 Type II compliance reports with your security team?"`,
  },
];

export const SALARY_BENCHMARKS = [
  {
    level: 'L4 / Associate FDE (0-2 Yrs)',
    baseSalary: '$145,000 - $175,000',
    equityAnnual: '$40,000 - $65,000',
    totalComp: '$190,000 - $245,000',
    travelExpectation: '20% - 30% on-site at client offices',
    focus: 'Data pipeline construction, connector debugging, automated testing.',
  },
  {
    level: 'L5 / Forward Deployment Engineer (3-5 Yrs)',
    baseSalary: '$180,000 - $225,000',
    equityAnnual: '$80,000 - $140,000',
    totalComp: '$270,000 - $370,000',
    travelExpectation: '30% - 50% on-site',
    focus: 'Leading 48-hour POVs, architecting enterprise ontologies, production agent deployment, P0 incident ownership.',
  },
  {
    level: 'L6 / Staff / Lead FDE (6+ Yrs)',
    baseSalary: '$230,000 - $285,000',
    equityAnnual: '$160,000 - $300,000+',
    totalComp: '$400,000 - $600,000+',
    travelExpectation: 'Strategic high-stakes client visits / C-suite steering committees',
    focus: 'Enterprise account expansion, multi-region architecture, executive buy-in, mentoring team.',
  },
];

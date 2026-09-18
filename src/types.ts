export interface ProjectItem {
  id: string;
  number: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  technologies: string[];
  role: string;
  systemFlow: string[];
  dataset?: string;
  models?: string[];
  evaluationMetrics?: string[];
  repository: string;
  notebookUrl?: string;
  documentationUrl?: string;
  liveAppView?: string;
  status: string;
  sections: {
    problem: string;
    whyApproach: string;
    dataInput: string;
    architecture: string;
    implementation: string;
    evaluation: string;
    engineeringDecisions: string[];
    limitations: string[];
    futureImprovements: string[];
  };
  relatedProjectIds: string[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  type: string;
  narrative: string;
  highlights: string[];
  technologies: string[];
}

export interface CertificationItem {
  title: string;
  issuer: string;
  period: string;
  code: string;
}

export interface AILabNode {
  id: string;
  label: string;
  type: 'FOUNDATION' | 'MODEL_ENGINEERING' | 'GENERATIVE_AI' | 'SYSTEMS_APPLICATION';
  description: string;
  connections: string[];
  relatedProjectIds: string[];
  coordinates: [number, number, number]; // 3D coordinates for Three.js
}

export interface StackCategory {
  title: string;
  iconName: string;
  skills: string[];
  summary: string;
}

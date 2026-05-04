import { IssueTestData } from "./issuesTestData";

export interface FeatureTestData {
  id: string;
  name?: string;
  description?: string;
  priority: string;
  areaModule: string;
  acceptanceCriteria: string;
}

export const features: FeatureTestData[] = [
  {
    id: "feat-001",
    name: "Dark mode toggle",
    description: "User can switch between dark and light mode",
    priority: "high",
    areaModule: "settings",
    acceptanceCriteria: "- Given user is on settings\n- When they toggle theme\n- Then UI updates",
  },
  {
    id: "feat-002",
    name: "Export to CSV",
    description: "User can export all issues to a CSV file",
    priority: "medium",
    areaModule: "dashboard",
    acceptanceCriteria: "- User can click Export\n- File downloads as .csv",
  },
  {
    id: "feat-003",
    name: "Nice to have note",
    description: "Low priority cosmetic improvement",
    priority: "info",
    areaModule: "ui",
    acceptanceCriteria: "- Given... When... Then...",
  },
];

export const featuresMissingDescription: FeatureTestData[] = [
  {
    id: "feat-001",
    name: "Dark mode toggle",
    priority: "high",
    areaModule: "settings",
    acceptanceCriteria: "- Given user is on settings\n- When they toggle theme\n- Then UI updates",
  },
  {
    id: "feat-002",
    name: "Export to CSV",
    priority: "medium",
    areaModule: "dashboard",
    acceptanceCriteria: "- User can click Export\n- File downloads as .csv",
  },
  {
    id: "feat-003",
    name: "Nice to have note",
    priority: "info",
    areaModule: "ui",
    acceptanceCriteria: "- Given... When... Then...",
  },
];

export const featuresMissingTitle: FeatureTestData[] = [
  {
    id: "feat-001",
    description: "User can switch between dark and light mode",
    priority: "high",
    areaModule: "settings",
    acceptanceCriteria: "- Given user is on settings\n- When they toggle theme\n- Then UI updates",
  },
  {
    id: "feat-002",
    description: "User can export all issues to a CSV file",
    priority: "medium",
    areaModule: "dashboard",
    acceptanceCriteria: "- User can click Export\n- File downloads as .csv",
  },
  {
    id: "feat-003",
    description: "Low priority cosmetic improvement",
    priority: "info",
    areaModule: "ui",
    acceptanceCriteria: "- Given... When... Then...",
  },
];

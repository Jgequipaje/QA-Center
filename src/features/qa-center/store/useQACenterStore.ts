import { create } from "zustand";
import type { Issue, IssueStatus, IssueFilters } from "../types";
import * as api from "../services/issueApiService";

type QACenterState = {
  isDrawerOpen: boolean;
  selectedIssueId: string | null;
  isCreating: boolean;
  isLoading: boolean;
  loadError: string | null;
  issues: Issue[];
  filters: IssueFilters;

  openDrawer: () => void;
  closeDrawer: () => void;
  selectIssue: (id: string | null) => void;
  openCreateForm: () => void;
  closeCreateForm: () => void;
  setFilters: (patch: Partial<IssueFilters>) => void;
  switchTab: (origin: IssueFilters["origin"]) => void;
  clearFilters: () => void;

  loadIssues: (baseUrl: string) => Promise<void>;
  addIssue: (baseUrl: string, issue: Issue) => void;
  updateIssueStatus: (baseUrl: string, id: string, status: IssueStatus) => void;
  updateIssue: (id: string, patch: Partial<Omit<Issue, "id" | "createdAt">>) => void;
  saveIssue: (baseUrl: string, id: string, patch: Partial<Omit<Issue, "id" | "createdAt">>) => Promise<void>;
  deleteIssue: (baseUrl: string, id: string) => void;
};

export const useQACenterStore = create<QACenterState>((set, get) => ({
  isDrawerOpen: false,
  selectedIssueId: null,
  isCreating: false,
  isLoading: false,
  loadError: null,
  issues: [],
  filters: { origin: "manual", status: "open" },

  openDrawer:      () => set({ isDrawerOpen: true }),
  closeDrawer:     () => set({ isDrawerOpen: false, selectedIssueId: null, isCreating: false }),
  selectIssue:     (id) => set({ selectedIssueId: id, isCreating: false }),
  openCreateForm:  () => set({ isCreating: true, selectedIssueId: null }),
  closeCreateForm: () => set({ isCreating: false }),
  setFilters:      (patch) => set((s) => ({ filters: { ...s.filters, ...patch } })),
  switchTab:       (origin) => set({ filters: { origin, status: "open", page: 1 } }),
  clearFilters:    () => set({ filters: { origin: "manual", status: "open", page: 1 } }),

  loadIssues: async (baseUrl) => {
    set({ isLoading: true, loadError: null });
    try {
      const issues = await api.fetchIssues(baseUrl);
      set({ issues, isLoading: false });
    } catch (e) {
      set({ isLoading: false, loadError: e instanceof Error ? e.message : "Failed to load issues." });
    }
  },

  addIssue: (baseUrl, issue) => {
    set((s) => ({ issues: [issue, ...s.issues], isCreating: false, selectedIssueId: issue.id }));
    api.createIssue(baseUrl, issue).then((saved) => {
      set((s) => ({
        issues: s.issues.map((i) => (i.id === issue.id ? saved : i)),
        selectedIssueId: s.selectedIssueId === issue.id ? saved.id : s.selectedIssueId,
      }));
    }).catch(() => {
      set((s) => ({ issues: s.issues.filter((i) => i.id !== issue.id) }));
    });
  },

  updateIssueStatus: (baseUrl, id, status) => {
    set((s) => ({
      issues: s.issues.map((i) => i.id === id ? { ...i, status, updatedAt: Date.now() } : i),
    }));
    api.updateIssueStatus(baseUrl, id, status).catch(() => { get().loadIssues(baseUrl); });
  },

  updateIssue: (id, patch) => {
    set((s) => ({
      issues: s.issues.map((i) => i.id === id ? { ...i, ...patch, updatedAt: Date.now() } : i),
    }));
  },

  saveIssue: async (baseUrl, id, patch) => {
    const prev = get().issues;
    set((s) => ({
      issues: s.issues.map((i) => i.id === id ? { ...i, ...patch, updatedAt: Date.now() } : i),
    }));
    try {
      const saved = await api.patchIssue(baseUrl, id, patch);
      set((s) => ({ issues: s.issues.map((i) => i.id === id ? saved : i) }));
    } catch {
      set({ issues: prev });
    }
  },

  deleteIssue: (baseUrl, id) => {
    const prev = get().issues;
    set((s) => ({
      issues: s.issues.filter((i) => i.id !== id),
      selectedIssueId: s.selectedIssueId === id ? null : s.selectedIssueId,
    }));
    api.deleteIssue(baseUrl, id).catch(() => { set({ issues: prev }); });
  },
}));

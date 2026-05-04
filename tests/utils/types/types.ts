export interface AddIssueOptionsType {
  linkedPlaywrightTest?: string;
  title?: string;
  description?: string;
  severity?: string;
  areaModule?: string;
  reproSteps?: string;
  expected?: string;
  actual?: string;
}

export interface AddFeatureOptionsType {
  name?: string;
  description?: string;
  priority?: string;
  areaModule?: string;
  acceptanceCriteria?: string;
}

export interface AddNoteOptionsType {
  title?: string;
  content?: string;
  tagArea?: string;
}

export interface MemoryContext {
  projectSummary: string;
  userPreferences: string[];
}

export interface MemoryBackend {
  fetchContext(): Promise<MemoryContext>;
}

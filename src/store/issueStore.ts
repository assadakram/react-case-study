import { create } from 'zustand';
import { Issue } from '../types';
import { mockFetchIssues, mockUpdateIssue } from '../utils/api';

interface UndoOperation {
  id: string;
  issueId: string;
  previousState: Partial<Issue>;
  timestamp: number;
}

interface IssueStore {
  issues: Issue[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  filterAssignee: string;
  filterSeverity: number | null;
  recentlyAccessed: string[];
  undoStack: UndoOperation[];
  lastSyncTime: Date | null;
  
  // Actions
  fetchIssues: () => Promise<void>;
  updateIssue: (issueId: string, updates: Partial<Issue>, isUndo?: boolean) => Promise<void>;
  setSearchTerm: (term: string) => void;
  setFilterAssignee: (assignee: string) => void;
  setFilterSeverity: (severity: number | null) => void;
  addToRecentlyAccessed: (issueId: string) => void;
  undoLastUpdate: () => Promise<void>;
  clearExpiredUndos: () => void;
  clearError: () => void;
}

export const useIssueStore = create<IssueStore>((set, get) => ({
  issues: [],
  loading: false,
  error: null,
  searchTerm: '',
  filterAssignee: '',
  filterSeverity: null,
  recentlyAccessed: JSON.parse(localStorage.getItem('recentlyAccessed') || '[]'),
  undoStack: [],
  lastSyncTime: null,

  fetchIssues: async () => {
    const currentIssues = get().issues;
    set({ loading: true, error: null });
    try {
      const newIssues = await mockFetchIssues() as Issue[];
      
      set({ issues: newIssues, loading: false, lastSyncTime: new Date() });
    } catch (error) {
      set({ error: 'Failed to fetch issues', loading: false });
    }
  },

  updateIssue: async (issueId: string, updates: Partial<Issue>, isUndo = false) => {
    get().clearExpiredUndos();
    const issues = get().issues;
    const issueIndex = issues.findIndex(issue => issue.id === issueId);
    
    if (issueIndex === -1) return;

    const previousState = { ...issues[issueIndex] };
    
    // Only create undo entry if this is not an undo operation
    let undoId: string | null = null;
    if (!isUndo) {
      undoId = `${issueId}-${Date.now()}-${Math.random()}`;
      const undoEntry: UndoOperation = {
        id: undoId,
        issueId,
        previousState,
        timestamp: Date.now()
      };

      // Add to undo stack
      set({ 
        undoStack: [...get().undoStack, undoEntry]
      });
    }

    // Optimistically update the state
    const updatedIssues = [...issues];
    updatedIssues[issueIndex] = { ...updatedIssues[issueIndex], ...updates };
    set({ issues: updatedIssues });

    try {
      const updatedIssue = await mockUpdateIssue(issueId, updates);
      console.log('API update successful:', updatedIssue);
      set({ lastSyncTime: new Date() });
      
      // Ensure the state is correct after API response
      const currentIssues = get().issues;
      const currentIndex = currentIssues.findIndex(issue => issue.id === issueId);
      if (currentIndex !== -1) {
        const finalIssues = [...currentIssues];
        finalIssues[currentIndex] = { ...finalIssues[currentIndex], ...updatedIssue };
        set({ issues: finalIssues });
        console.log('Final state update completed');
      }
    } catch (error) {
      console.error('API update failed, reverting:', error);
      // Revert on error
      const revertedIssues = [...get().issues];
      revertedIssues[issueIndex] = previousState;
      set({ 
        issues: revertedIssues, 
        error: 'Failed to update issue',
        undoStack: undoId ? get().undoStack.filter(undo => undo.id !== undoId) : get().undoStack
      });
      throw error; // Re-throw so the component can handle it
    }
  },

  setSearchTerm: (term: string) => set({ searchTerm: term }),
  setFilterAssignee: (assignee: string) => set({ filterAssignee: assignee }),
  setFilterSeverity: (severity: number | null) => set({ filterSeverity: severity }),

  addToRecentlyAccessed: (issueId: string) => {
    const { recentlyAccessed } = get();
    const updated = [issueId, ...recentlyAccessed.filter(id => id !== issueId)].slice(0, 5);
    localStorage.setItem('recentlyAccessed', JSON.stringify(updated));
    set({ recentlyAccessed: updated });
  },

  undoLastUpdate: async () => {
    get().clearExpiredUndos();
    const { undoStack } = get();
    const lastUpdate = undoStack[undoStack.length - 1];
    
    if (!lastUpdate || Date.now() - lastUpdate.timestamp > 5000) return;

    // Remove the undo from stack before performing the undo
    set({ undoStack: undoStack.slice(0, -1) });
    
    try {
      // Pass isUndo=true to prevent creating another undo entry
      await get().updateIssue(lastUpdate.issueId, lastUpdate.previousState, true);
    } catch (error) {
      console.error('Failed to undo:', error);
      // If undo fails, add it back to the stack
      set({ undoStack: [...get().undoStack, lastUpdate] });
    }
  },

  clearExpiredUndos: () => {
    const { undoStack } = get();
    const validUndos = undoStack.filter(undo => Date.now() - undo.timestamp < 5000);
    if (validUndos.length !== undoStack.length) {
      set({ undoStack: validUndos });
    }
  },

  clearError: () => set({ error: null })
}));
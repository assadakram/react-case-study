import { toast } from 'react-toastify';
import { Issue } from '../types';

export const detectLiveUpdates = (oldIssues: Issue[], newIssues: Issue[]) => {
  const changes: string[] = [];

  // Create maps for easier comparison
  const oldIssueMap = new Map(oldIssues.map(issue => [issue.id, issue]));
  const newIssueMap = new Map(newIssues.map(issue => [issue.id, issue]));

  // Check for status changes
  newIssues.forEach(newIssue => {
    const oldIssue = oldIssueMap.get(newIssue.id);
    if (oldIssue) {
      // Status change
      if (oldIssue.status !== newIssue.status) {
        changes.push(`📋 "${newIssue.title}" moved to ${newIssue.status}`);
      }
      
      // Priority change
      if (oldIssue.priority !== newIssue.priority) {
        changes.push(`🔺 "${newIssue.title}" priority changed to ${newIssue.priority}`);
      }
      
      // Assignee change
      if (oldIssue.assignee !== newIssue.assignee) {
        changes.push(`👤 "${newIssue.title}" assigned to ${newIssue.assignee}`);
      }

      // Severity change
      if (oldIssue.severity !== newIssue.severity) {
        changes.push(`⚠️ "${newIssue.title}" severity changed to ${newIssue.severity}`);
      }
    }
  });

  // Check for new issues
  newIssues.forEach(newIssue => {
    if (!oldIssueMap.has(newIssue.id)) {
      changes.push(`➕ New issue created: "${newIssue.title}"`);
    }
  });

  // Check for removed issues
  oldIssues.forEach(oldIssue => {
    if (!newIssueMap.has(oldIssue.id)) {
      changes.push(`➖ Issue removed: "${oldIssue.title}"`);
    }
  });

  // Show notifications for changes
  if (changes.length > 0) {
    if (changes.length === 1) {
      toast.info(`🔄 Live update: ${changes[0]}`, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      toast.info(`🔄 ${changes.length} live updates detected`, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Log all changes to console for development
      console.log('Live updates detected:', changes);
    }
  }
};
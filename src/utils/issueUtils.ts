import { Issue } from '../types';

export const calculatePriorityScore = (issue: Issue): number => {
  const daysSinceCreated = Math.floor(
    (Date.now() - new Date(issue.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const userDefinedRank = issue.userDefinedRank || 0;
  
  return issue.severity * 10 + (daysSinceCreated * -1) + userDefinedRank;
};

export const sortIssuesByPriority = (issues: Issue[]): Issue[] => {
  return [...issues].sort((a, b) => {
    const scoreA = calculatePriorityScore(a);
    const scoreB = calculatePriorityScore(b);
    
    if (scoreA === scoreB) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    
    return scoreB - scoreA; 
  });
};

export const filterIssues = (
  issues: Issue[], 
  searchTerm: string, 
  filterAssignee: string, 
  filterSeverity: number | null
): Issue[] => {
  return issues.filter(issue => {
    const matchesSearch = !searchTerm || 
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesAssignee = !filterAssignee || issue.assignee === filterAssignee;
    const matchesSeverity = filterSeverity === null || issue.severity === filterSeverity;
    
    return matchesSearch && matchesAssignee && matchesSeverity;
  });
};
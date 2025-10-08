import React from 'react';
import { useIssueStore } from '../../store/issueStore';
import './SearchAndFilters.css';

export const SearchAndFilters: React.FC = () => {
  const {
    searchTerm,
    filterAssignee,
    filterSeverity,
    issues,
    setSearchTerm,
    setFilterAssignee,
    setFilterSeverity
  } = useIssueStore();

  const uniqueAssignees = Array.from(new Set(issues.map(issue => issue.assignee)));
  const uniqueSeverities = Array.from(new Set(issues.map(issue => issue.severity))).sort();

  return (
    <div className="search-filters">
      <div className="search-input">
        <input
          type="text"
          placeholder="Search by title or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="filters">
        <select
          value={filterAssignee}
          onChange={(e) => setFilterAssignee(e.target.value)}
        >
          <option value="">All Assignees</option>
          {uniqueAssignees.map(assignee => (
            <option key={assignee} value={assignee}>
              {assignee}
            </option>
          ))}
        </select>
        
        <select
          value={filterSeverity || ''}
          onChange={(e) => setFilterSeverity(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">All Severities</option>
          {uniqueSeverities.map(severity => (
            <option key={severity} value={severity}>
              Severity {severity}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Link } from 'react-router-dom';
import { Issue } from '../../types';
import { useIssueStore } from '../../store/issueStore';
import { calculatePriorityScore } from '../../utils/issueUtils';
import './IssueCard.css';

interface DraggableIssueCardProps {
  issue: Issue;
  canEdit: boolean;
}

export const DraggableIssueCard: React.FC<DraggableIssueCardProps> = ({ issue, canEdit }) => {
  const { addToRecentlyAccessed } = useIssueStore();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: issue.id,
    disabled: !canEdit,
  });

  const priorityScore = calculatePriorityScore(issue);
  
  const handleClick = () => {
    addToRecentlyAccessed(issue.id);
  };

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  } : undefined;

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`issue-card ${isDragging ? 'dragging' : ''} ${canEdit ? 'draggable' : 'read-only'}`}
      {...listeners}
      {...attributes}
    >
      <div className="issue-header">
        <Link 
          to={`/issue/${issue.id}`} 
          className="issue-title"
          onClick={(e) => {
            e.stopPropagation(); // Prevent drag when clicking link
            handleClick();
          }}
        >
          {issue.title}
        </Link>
        <span className={`priority-badge priority-${issue.priority.toLowerCase()}`}>
          {issue.priority}
        </span>
      </div>
      
      <div className="issue-meta">
       <div className='meta-left'>
        <span className="assignee">@{issue.assignee}</span>
        <span className="severity">Severity: {issue.severity}</span>
       </div>
        <span className="priority-score-inline">{priorityScore}</span>
      </div>
      
      <div className="issue-tags">
        {issue.tags.map(tag => (
          <span key={tag} className="tag">#{tag}</span>
        ))}
      </div>
      
      <div className="issue-created">
        Created: {new Date(issue.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { IssueStatus, Issue } from '../../types';
import { DraggableIssueCard } from '../DraggableIssueCard';
import './DroppableColumn.css';

interface DroppableColumnProps {
  status: IssueStatus;
  title: string;
  issues: Issue[];
  canEdit: boolean;
}

export const DroppableColumn: React.FC<DroppableColumnProps> = ({
  status,
  title,
  issues,
  canEdit
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div 
      ref={setNodeRef}
      className={`board-column ${isOver ? 'column-over' : ''}`}
    >
      <h2 className="column-title">
        {title} ({issues.length})
      </h2>
      <div className="issue-list">
        {issues.map(issue => (
          <DraggableIssueCard
            key={issue.id}
            issue={issue}
            canEdit={canEdit}
          />
        ))}
        {issues.length === 0 && (
          <div className="empty-column">
            No issues
          </div>
        )}
      </div>
    </div>
  );
};
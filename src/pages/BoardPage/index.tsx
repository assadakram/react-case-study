import React, { useEffect, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useIssueStore } from '../../store/issueStore';
import { useUserStore } from '../../store/userStore';
import { Issue, IssueStatus } from '../../types';
import { sortIssuesByPriority, filterIssues } from '../../utils/issueUtils';
import { DroppableColumn } from '../../components/DroppableColumn';
import { SearchAndFilters } from '../../components/SearchAndFilters';
import { RecentlyAccessedSidebar } from '../../components/RecentlyAccessedSidebar';
import { UndoToast } from '../../components/UndoToast';
import './BoardPage.css';

export const BoardPage = () => {
  const {
    issues,
    loading,
    error,
    searchTerm,
    filterAssignee,
    filterSeverity,
    undoStack,
    lastSyncTime,
    fetchIssues,
    updateIssue,
    clearError,
    undoLastUpdate
  } = useIssueStore();

  const { role } = useUserStore();
  const [showSidebar, setShowSidebar] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 2,
      },
    })
  );

  const columns: { status: IssueStatus; title: string }[] = [
    { status: 'Backlog', title: 'Backlog' },
    { status: 'In Progress', title: 'In Progress' },
    { status: 'Done', title: 'Done' }
  ];

  useEffect(() => {
    fetchIssues();
    
    const interval = setInterval(fetchIssues, 10000);
    return () => clearInterval(interval);
  }, [fetchIssues]);

  const filteredAndSortedIssues = sortIssuesByPriority(
    filterIssues(issues, searchTerm, filterAssignee, filterSeverity)
  );

  const getIssuesByStatus = (status: IssueStatus): Issue[] => {
    return filteredAndSortedIssues.filter(issue => issue.status === status);
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (role !== 'admin') return;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || role !== 'admin') return;

    const issueId = active.id as string;
    const newStatus = over.id as IssueStatus;
    
    const issue = issues.find(issue => issue.id === issueId);
    if (!issue || issue.status === newStatus) return;

    updateIssue(issueId, { status: newStatus });
  };

  const canEdit = role === 'admin';

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="board-page">
        <div className="board-header-container">
          <div className="board-header">
            <h1>Issue Board</h1>
            <div className="board-controls">
              <div className="sync-indicator">
                {loading && <span className="sync-status">🔄 Syncing...</span>}
                {lastSyncTime && !loading && (
                  <span className="sync-time">
                    🟢 Last synced: {lastSyncTime.toLocaleTimeString()}
                  </span>
                )}
                <small className="polling-info">Auto-sync every 10s</small>
              </div>
              <button onClick={() => setShowSidebar(!showSidebar)}>
                Recently Accessed
              </button>
            </div>
          </div>

          <SearchAndFilters />
        </div>

        {error && (
          <div className="error-banner">
            {error}
            <button onClick={clearError}>×</button>
          </div>
        )}

        {loading && <div className="loading">Loading issues...</div>}

        <div className="board-content">
          <div className="board-columns">
            {columns.map(column => (
              <DroppableColumn
                key={column.status}
                status={column.status}
                title={column.title}
                issues={getIssuesByStatus(column.status)}
                canEdit={canEdit}
              />
            ))}
          </div>

          {showSidebar && (
            <RecentlyAccessedSidebar onClose={() => setShowSidebar(false)} />
          )}
        </div>

        {undoStack.length > 0 && undoStack[undoStack.length - 1].timestamp > Date.now() - 5000 && (
          <UndoToast 
            onUndo={undoLastUpdate} 
            lastUndoTimestamp={undoStack[undoStack.length - 1].timestamp}
          />
        )}
      </div>
    </DndContext>
  );
};

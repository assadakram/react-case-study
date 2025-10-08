import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useIssueStore } from '../../store/issueStore';
import { useUserStore } from '../../store/userStore';
import { calculatePriorityScore } from '../../utils/issueUtils';
import './IssueDetailPage.css';

export const IssueDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { issues, updateIssue, addToRecentlyAccessed, fetchIssues } = useIssueStore();
  const { role } = useUserStore();
  
  const issue = issues.find((issue) => issue.id === id);

  useEffect(() => {
    if (id) {
      addToRecentlyAccessed(id);
    }
    
    if (issues.length === 0) {
      fetchIssues();
    }
  }, [id, addToRecentlyAccessed, fetchIssues, issues.length]);

  const handleMarkAsResolved = async () => {
    if (!issue || role !== 'admin') return;
    
    toast.info(`🔄 Marking "${issue.title}" as resolved...`);
    
    try {
      await updateIssue(issue.id, { status: 'Done' });
      toast.success(`✅ "${issue.title}" marked as resolved!`);
      
      setTimeout(() => {
        navigate('/board');
      }, 200);
    } catch (error) {
      console.error('Failed to mark issue as resolved:', error);
      toast.error('❌ Failed to mark issue as resolved');
      navigate('/board');
    }
  };

  if (!issue) {
    return (
      <div className="issue-detail-page">
        <div className="issue-header">
          <Link to="/board" className="back-link">← Back to Board</Link>
        </div>
        <div className="issue-not-found">
          Issue not found
        </div>
      </div>
    );
  }

  const priorityScore = calculatePriorityScore(issue);
  const canEdit = role === 'admin';

  return (
    <div className="issue-detail-page">
      <div className="issue-header">
        <Link to="/board" className="back-link">← Back to Board</Link>
        <div className="issue-actions">
          {canEdit && issue.status !== 'Done' && (
            <button 
              onClick={handleMarkAsResolved}
              className="resolve-button"
            >
              Mark as Resolved
            </button>
          )}
        </div>
      </div>

      <div className="issue-content">
       

        <div className="issue-metadata">
           <div className="issue-title-section">
          <h1 className="issue-title">{issue.title}</h1>
          <div className={`issue-status-badge status-${issue.status.toLowerCase().replace(' ', '-')}`}>
            {issue.status}
          </div>
        </div>
          <div className="metadata-grid">
            <div className="metadata-item">
              <label>Assignee</label>
              <span>@{issue.assignee}</span>
            </div>
            
            <div className="metadata-item">
              <label>Priority</label>
              <span className={`priority-badge priority-${issue.priority}`}>
                {issue.priority}
              </span>
            </div>
            
            <div className="metadata-item">
              <label>Severity</label>
              <span className={`severity-badge severity-${issue.severity}`}>
                {issue.severity}
              </span>
            </div>
            
            <div className="metadata-item">
              <label>Priority Score</label>
              <span className="priority-score">{priorityScore}</span>
            </div>
            
            <div className="metadata-item">
              <label>Created</label>
              <span>{new Date(issue.createdAt).toLocaleString()}</span>
            </div>
            
            <div className="metadata-item">
              <label>Days Since Created</label>
              <span>
                {Math.floor((Date.now() - new Date(issue.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
              </span>
            </div>
          </div>
        </div>

        <div className="issue-tags-section">
          <label>Tags</label>
          <div className="issue-tags">
            {issue.tags.map((tag) => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        </div>

        <div className="priority-calculation">
          <h3>Priority Score Calculation</h3>
          <div className="calculation-breakdown">
            <div className="calculation-item">
              <span>Severity × 10:</span>
              <span>{issue.severity} × 10 = {issue.severity * 10}</span>
            </div>
            <div className="calculation-item">
              <span>Days Since Created × -1:</span>
              <span>
                {Math.floor((Date.now() - new Date(issue.createdAt).getTime()) / (1000 * 60 * 60 * 24))} × -1 = 
                {Math.floor((Date.now() - new Date(issue.createdAt).getTime()) / (1000 * 60 * 60 * 24)) * -1}
              </span>
            </div>
            <div className="calculation-item">
              <span>User Defined Rank:</span>
              <span>{issue.userDefinedRank || 0}</span>
            </div>
            <div className="calculation-total">
              <span><strong>Total Score:</strong></span>
              <span><strong>{priorityScore}</strong></span>
            </div>
          </div>
        </div>

        {!canEdit && (
          <div className="read-only-notice">
            <p>You have read-only access. Only admin users can modify issues.</p>
          </div>
        )}
      </div>
    </div>
  );
};
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useIssueStore } from '../../store/issueStore';
import './RecentlyAccessedSidebar.css';

interface RecentlyAccessedSidebarProps {
  onClose: () => void;
}

export const RecentlyAccessedSidebar: React.FC<RecentlyAccessedSidebarProps> = ({ onClose }) => {
  const { recentlyAccessed, issues, addToRecentlyAccessed } = useIssueStore();

  const recentIssues = recentlyAccessed
    .map(id => issues.find(issue => issue.id === id))
    .filter(Boolean);

  const handleIssueClick = (issueId: string) => {
    addToRecentlyAccessed(issueId);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Close sidebar when clicking on the overlay (outside the sidebar)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle Escape key to close sidebar
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  return (
    <div className="sidebar-overlay" onClick={handleOverlayClick}>
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Recently Accessed</h3>
          <button onClick={onClose} className="close-button">×</button>
        </div>
        
        <div className="sidebar-content">
          {recentIssues.length === 0 ? (
            <p className="no-recent">No recently accessed issues</p>
          ) : (
            <ul className="recent-list">
              {recentIssues.map((issue, index) => (
                <li key={issue!.id} className="recent-item">
                  <Link
                    to={`/issue/${issue!.id}`}
                    onClick={() => handleIssueClick(issue!.id)}
                    className="recent-link"
                  >
                    <div className="recent-title">{issue!.title}</div>
                    <div className="recent-meta">
                      <span className="recent-status">{issue!.status}</span>
                      <span className="recent-assignee">@{issue!.assignee}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
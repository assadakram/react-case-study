import { Issue } from '../types';

// In-memory store to persist changes during the session
let issuesCache: Issue[] | null = null;
let lastSimulatedUpdate = 0;

export const mockFetchIssues = (): Promise<Issue[]> => {
    return new Promise(resolve => {
        setTimeout(async () => {
            if (!issuesCache) {
                // Load initial data from JSON file
                const module = await import('../data/issues.json');
                issuesCache = [...module.default] as Issue[];
            }

            // Simulate live updates occasionally (every 30-60 seconds)
            const now = Date.now();
            if (now - lastSimulatedUpdate > 30000 && Math.random() < 0.3) {
                simulateLiveUpdate();
                lastSimulatedUpdate = now;
            }

            resolve([...issuesCache!]);
        }, 500);
    });
};

// Simulate external updates to issues
const simulateLiveUpdate = () => {
    if (!issuesCache || issuesCache.length === 0) return;

    const randomIssue = issuesCache[Math.floor(Math.random() * issuesCache.length)];
    const randomUpdates = [
        // Simulate status changes
        () => {
            const statuses = ['Backlog', 'In Progress', 'Done'];
            const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
            if (newStatus !== randomIssue.status) {
                randomIssue.status = newStatus as any;
                console.log(`🔄 Simulated live update: Issue "${randomIssue.title}" moved to ${newStatus}`);
            }
        },
        // Simulate priority changes
        () => {
            const priorities = ['Low', 'Medium', 'High'];
            const newPriority = priorities[Math.floor(Math.random() * priorities.length)];
            if (newPriority !== randomIssue.priority) {
                randomIssue.priority = newPriority as any;
                console.log(`🔄 Simulated live update: Issue "${randomIssue.title}" priority changed to ${newPriority}`);
            }
        },
        // Simulate assignee changes
        () => {
            const assignees = ['Alice', 'Bob', 'Charlie', 'Diana'];
            const newAssignee = assignees[Math.floor(Math.random() * assignees.length)];
            if (newAssignee !== randomIssue.assignee) {
                randomIssue.assignee = newAssignee;
                console.log(`🔄 Simulated live update: Issue "${randomIssue.title}" assigned to ${newAssignee}`);
            }
        }
    ];

    // Apply a random update
    const randomUpdate = randomUpdates[Math.floor(Math.random() * randomUpdates.length)];
    randomUpdate();
};

export const mockUpdateIssue = (issueId: string, updates: Partial<Issue>): Promise<Issue> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Reduced failure rate for better demo experience
            if (Math.random() < 0.95) {
                // Update the cache if it exists
                if (issuesCache) {
                    const issueIndex = issuesCache.findIndex(issue => issue.id === issueId);
                    if (issueIndex !== -1) {
                        issuesCache[issueIndex] = { ...issuesCache[issueIndex], ...updates };
                        resolve(issuesCache[issueIndex]);
                        return;
                    }
                }
                resolve({ id: issueId, ...updates } as Issue);
            } else {
                reject(new Error('Failed to update issue'));
            }
        }, 500);
    });
};

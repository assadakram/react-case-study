import React from 'react';
import { useUserStore } from '../../store/userStore';
import { RoleSwitcher } from '../../components/RoleSwitcher';

export const SettingsPage = () => {
    const { name, role } = useUserStore();
    
    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Settings</h1>
            
            <div style={{ 
                background: '#f8f9fa', 
                padding: '1.5rem', 
                borderRadius: '8px', 
                marginBottom: '2rem' 
            }}>
                <h2>User Role Management</h2>
                <p>Switch between different user roles to test the application's access control features.</p>
                
                <div style={{ marginTop: '1rem' }}>
                    <RoleSwitcher />
                </div>
                
                <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                    <p><strong>Current User:</strong> {name}</p>
                    <p><strong>Current Role:</strong> {role}</p>
                </div>
                
                <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                    <h4>Role Permissions:</h4>
                    <ul>
                        <li><strong>Admin:</strong> Can drag & drop issues, mark as resolved, full edit access</li>
                        <li><strong>Contributor:</strong> Read-only access, can view and search issues</li>
                    </ul>
                </div>
            </div>
            
            <div style={{ 
                background: '#fff3cd', 
                padding: '1rem', 
                borderRadius: '8px',
                border: '1px solid #ffeaa7' 
            }}>
                <h3>💡 Testing Instructions</h3>
                <ol>
                    <li>Use the role switcher in the navigation or above to change roles</li>
                    <li>Navigate to the board and observe different behaviors</li>
                    <li>Try dragging issues when in Admin vs Contributor mode</li>
                    <li>Check issue detail pages for different access levels</li>
                </ol>
            </div>
        </div>
    );
};
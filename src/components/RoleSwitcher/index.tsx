import React from 'react';
import { toast } from 'react-toastify';
import { useUserStore } from '../../store/userStore';
import { UserRole } from '../../types';
import './RoleSwitcher.css';

export const RoleSwitcher: React.FC = () => {
  const { name, role, setRole } = useUserStore();

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = event.target.value as UserRole;
    setRole(newRole);
    
    if (newRole === 'admin') {
      toast.success('🔓 Switched to Admin mode - You can now edit and drag issues!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } else {
      toast.info('🔒 Switched to Contributor mode - Read-only access', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="role-switcher">
      <div className="user-info">
        <span className="user-name">{name}</span>
        <select 
          value={role} 
          onChange={handleRoleChange}
          className="role-select"
          title="Switch between Admin and Contributor roles"
        >
          <option value="admin">Admin</option>
          <option value="contributor">Contributor</option>
        </select>
          <span className="admin-badge">{role === 'admin' ? "ADMIN" : "CONTRIBUTOR"}</span>
      </div>
    </div>
  );
};
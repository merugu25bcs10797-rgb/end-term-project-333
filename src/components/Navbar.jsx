import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiBook, FiCheckSquare, FiCalendar, FiCpu, FiLogOut } from 'react-icons/fi';

const Navbar = () => {
  const { logout, currentUser } = useAuth();
  
  const navStyle = {
    display: 'flex', gap: '20px', padding: '20px 32px', 
    background: 'var(--bg-glass)', borderBottom: '1px solid var(--border-glass)',
    alignItems: 'center', justifyContent: 'space-between',
    backdropFilter: 'blur(10px)', zIndex: 10
  };

  const linkStyle = { display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' };
  
  return (
    <nav style={navStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ background: 'var(--accent-gradient)', padding: '8px', borderRadius: '8px', display: 'flex' }}>
          <FiBook size={20} color="white" />
        </div>
        <h2>SmartStudy AI</h2>
      </div>
      <div style={{ display: 'flex', gap: '24px' }}>
        <NavLink to="/dashboard" style={({ isActive }) => ({ ...linkStyle, color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isActive ? 600 : 400 })}><FiHome /> Dashboard</NavLink>
        <NavLink to="/subjects" style={({ isActive }) => ({ ...linkStyle, color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isActive ? 600 : 400 })}><FiBook /> Subjects</NavLink>
        <NavLink to="/tasks" style={({ isActive }) => ({ ...linkStyle, color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isActive ? 600 : 400 })}><FiCheckSquare /> Tasks</NavLink>
        <NavLink to="/revision" style={({ isActive }) => ({ ...linkStyle, color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isActive ? 600 : 400 })}><FiCalendar /> Revision</NavLink>
        <NavLink to="/ai-tools" style={({ isActive }) => ({ ...linkStyle, color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isActive ? 600 : 400 })}><FiCpu /> Assistant</NavLink>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{currentUser?.email}</span>
        <button onClick={logout} className="btn-primary" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}><FiLogOut /> Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;

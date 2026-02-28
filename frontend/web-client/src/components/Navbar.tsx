import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar: React.FC<{ user: any }> = ({ user }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <header style={{ 
            background: 'var(--surface)', 
            borderBottom: '1px solid var(--border)', 
            position: 'sticky', 
            top: 0, 
            zIndex: 100,
            padding: '10px 0'
        }}>
            <div style={{ maxWidth: '1000px', margin: 'auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                    <h1 style={{ color: 'var(--primary)', margin: 0, fontSize: '24px', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
                        DECP
                    </h1>
                    <nav style={{ display: 'flex', gap: '10px' }}>
                        <button 
                            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                            onClick={() => navigate('/dashboard')}
                            style={{ background: 'none', border: 'none' }}
                        >
                            Feed
                        </button>
                        <button 
                            className={`nav-link ${location.pathname === '/jobs' ? 'active' : ''}`}
                            onClick={() => navigate('/jobs')}
                            style={{ background: 'none', border: 'none' }}
                        >
                            Jobs
                        </button>
                    </nav>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ textAlign: 'right', lineHeight: '1.2' }}>
                        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{user?.fullName || 'User'}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user?.role || ''}</div>
                    </div>
                    <button 
                        onClick={handleLogout} 
                        style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--border)', background: 'white' }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;

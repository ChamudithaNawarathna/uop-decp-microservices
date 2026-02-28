import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (err: any) {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card" style={{ width: '400px', padding: '40px', textAlign: 'center' }}>
                <h1 style={{ color: 'var(--primary)', marginBottom: '8px' }}>DECP</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Department Engagement & Career Platform</p>
                
                {error && (
                    <div style={{ background: '#ffeef0', color: '#d73a49', padding: '10px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' }}>
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleLogin} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Username</label>
                        <input 
                            type="text" 
                            placeholder="Enter your username"
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                            style={{ width: '100%' }} 
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            style={{ width: '100%' }} 
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', marginTop: '10px' }}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;

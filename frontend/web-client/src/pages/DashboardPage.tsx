import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import CreatePost from '../components/CreatePost';
import PostList from '../components/PostList';
import Navbar from '../components/Navbar';

const DashboardPage: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [alumni, setAlumni] = useState([]);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
        } else {
            setUser(JSON.parse(storedUser));
            fetchAlumni();
            fetchPosts();
        }
    }, [navigate]);

    const fetchAlumni = async () => {
        try {
            const response = await api.get('/users/alumni');
            setAlumni(response.data);
        } catch (err) {
            console.error('Failed to fetch alumni');
        }
    };

    const fetchPosts = async () => {
        try {
            const response = await api.get('/posts');
            setPosts(response.data);
        } catch (err) {
            console.error('Failed to fetch posts');
        }
    };

    if (!user) return null;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
            <Navbar user={user} />
            
            <main style={{ maxWidth: '1000px', margin: '20px auto', padding: '0 20px', display: 'flex', gap: '20px' }}>
                <div style={{ flex: 2 }}>
                    <CreatePost user={user} onPostCreated={fetchPosts} />
                    <PostList posts={posts} />
                </div>

                <div style={{ flex: 1 }}>
                    <div className="card">
                        <h3 style={{ marginTop: 0, fontSize: '16px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Alumni Directory
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {alumni.map((a: any) => (
                                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '36px', height: '36px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                        {a.fullName.charAt(0)}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', fontSize: '14px' }}>{a.fullName}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{a.email}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {alumni.length === 0 && <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No alumni registered yet.</p>}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;

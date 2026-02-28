import React, { useState } from 'react';
import api from '../services/api';

interface CreatePostProps {
    onPostCreated: () => void;
    user: any;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated, user }) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/posts', {
                userId: user.id,
                fullName: user.fullName,
                content: content,
                mediaUrls: []
            });
            setContent('');
            onPostCreated();
        } catch (err) {
            console.error('Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ width: '40px', height: '40px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {user?.fullName?.charAt(0) || '?'}
                </div>
                <form onSubmit={handleSubmit} style={{ flex: 1 }}>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={`What's on your mind, ${user?.fullName?.split(' ')[0] || 'there'}?`}
                        required
                        style={{ width: '100%', minHeight: '60px', border: 'none', background: '#f0f2f5', marginBottom: '10px', resize: 'none', borderRadius: '20px', padding: '12px 20px' }}
                    />
                    <div style={{ textAlign: 'right', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                        <button className="btn-primary" type="submit" disabled={loading}>
                            {loading ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;

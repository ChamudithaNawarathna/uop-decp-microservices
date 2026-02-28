import React from 'react';

interface PostListProps {
    posts: any[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {posts.map((post) => (
                <div key={post.id} className="card" style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <div style={{ width: '36px', height: '36px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            {post.fullName?.charAt(0) || '?'}
                        </div>
                        <div>
                            <div style={{ fontWeight: '600', fontSize: '14px' }}>{post.fullName || 'Unknown User'}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                {new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                    <div style={{ marginBottom: '12px', fontSize: '15px', lineHeight: '1.5' }}>{post.content}</div>
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', display: 'flex', gap: '20px', fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600' }}>
                        <span style={{ cursor: 'pointer' }}>Like ({post.likedBy.length})</span>
                        <span style={{ cursor: 'pointer' }}>Comment ({post.comments.length})</span>
                    </div>
                </div>
            ))}
            {posts.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '40px' }}>No posts yet. Be the first to post!</p>}
        </div>
    );
};

export default PostList;

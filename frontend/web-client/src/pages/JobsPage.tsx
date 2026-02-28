import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const JobsPage: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [jobs, setJobs] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [newJob, setNewJob] = useState({ title: '', company: '', location: '', type: 'Internship', description: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
        } else {
            setUser(JSON.parse(storedUser));
            fetchJobs();
        }
    }, [navigate]);

    const fetchJobs = async () => {
        try {
            const response = await api.get('/jobs');
            setJobs(response.data);
        } catch (err) {
            console.error('Failed to fetch jobs');
        }
    };

    const handleCreateJob = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/jobs', {
                ...newJob,
                postedBy: user.id,
                posterName: user.fullName
            });
            setShowCreate(false);
            setNewJob({ title: '', company: '', location: '', type: 'Internship', description: '' });
            fetchJobs();
        } catch (err) {
            console.error('Failed to create job');
        }
    };

    if (!user) return null;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
            <Navbar user={user} />
            
            <main style={{ maxWidth: '800px', margin: '20px auto', padding: '0 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '24px', margin: 0 }}>Career Opportunities</h2>
                    {(user.role === 'ALUMNI' || user.role === 'ADMIN') && (
                        <button onClick={() => setShowCreate(!showCreate)} className="btn-primary">
                            {showCreate ? 'Cancel' : 'Post a Job'}
                        </button>
                    )}
                </div>

                {showCreate && (
                    <div className="card" style={{ marginBottom: '30px' }}>
                        <h3 style={{ marginTop: 0 }}>Post New Opportunity</h3>
                        <form onSubmit={handleCreateJob} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <input type="text" placeholder="Job Title" required value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input type="text" placeholder="Company" required value={newJob.company} onChange={e => setNewJob({...newJob, company: e.target.value})} style={{ flex: 1 }} />
                                <input type="text" placeholder="Location" required value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} style={{ flex: 1 }} />
                                <select value={newJob.type} onChange={e => setNewJob({...newJob, type: e.target.value})}>
                                    <option value="Internship">Internship</option>
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                </select>
                            </div>
                            <textarea placeholder="Job Description" required value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} style={{ minHeight: '100px' }} />
                            <button type="submit" className="btn-primary">Post Opportunity</button>
                        </form>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {jobs.map((job: any) => (
                        <div key={job.id} className="card" style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 5px 0', color: 'var(--primary)', fontSize: '20px' }}>{job.title}</h3>
                                    <p style={{ margin: '0 0 15px 0', fontWeight: 'bold', fontSize: '16px' }}>{job.company} • {job.location}</p>
                                </div>
                                <span style={{ padding: '6px 12px', background: '#e7f3ff', color: 'var(--primary)', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold' }}>
                                    {job.type}
                                </span>
                            </div>
                            <p style={{ fontSize: '15px', color: 'var(--text-main)', lineHeight: '1.6', marginBottom: '20px', whiteSpace: 'pre-wrap' }}>
                                {job.description}
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '15px' }}>
                                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Posted by <strong>{job.posterName}</strong></span>
                                <button className="btn-primary" style={{ padding: '8px 24px' }}>Apply</button>
                            </div>
                        </div>
                    ))}
                    {jobs.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>No career opportunities posted yet.</p>}
                </div>
            </main>
        </div>
    );
};

export default JobsPage;

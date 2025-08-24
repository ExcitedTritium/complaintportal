import React, { useState, useEffect } from 'react';
import { Page, Complaint, ComplaintStatus, ComplaintCategory } from '../types';
import { getComplaints, updateComplaintStatus } from '../services/complaintService';

const statusColors: Record<ComplaintStatus, string> = {
    'Pending': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'In Review': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Resolved': 'bg-green-500/20 text-green-400 border-green-500/30',
};
const categoryIcons: Record<Exclude<ComplaintCategory, ''>, string> = {
    'Infrastructure': '🏗️',
    'Academics': '📚',
    'Facilities': '🚰',
    'Other': '💬'
};


interface FacultyDashboardPageProps {
  onNavigate: (page: Page) => void;
}

const FacultyDashboardPage: React.FC<FacultyDashboardPageProps> = ({ onNavigate }) => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<ComplaintStatus | 'All'>('All');

    const loadComplaints = () => {
        setIsLoading(true);
        // Simulate a small delay for a better loading experience
        setTimeout(() => {
            const allComplaints = getComplaints();
            setComplaints(allComplaints);
            setIsLoading(false);
        }, 500);
    };

    useEffect(() => {
        loadComplaints();
    }, []);

    const handleStatusChange = (id: string, status: ComplaintStatus) => {
        const updatedComplaints = updateComplaintStatus(id, status);
        setComplaints(updatedComplaints);
    };

    const handleLogout = () => {
        onNavigate(Page.Home);
    };
    
    const filteredComplaints = complaints.filter(c => filter === 'All' || c.status === filter);

    return (
        <div className="w-full max-w-4xl animate-fadeInUp p-4">
            <header className="flex justify-between items-center mb-8">
                <h1 className="font-display text-3xl font-bold">Faculty Dashboard</h1>
                <button 
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-primary hover:underline"
                >
                    Logout &rarr;
                </button>
            </header>

            <div>
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">All Submitted Complaints</h2>
                    <div className="flex items-center gap-2">
                        <label htmlFor="status-filter" className="text-sm">Filter:</label>
                        <select 
                            id="status-filter"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as ComplaintStatus | 'All')}
                            className="bg-card-light/50 dark:bg-card-dark/50 border border-border-light dark:border-border-dark rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        >
                            <option value="All">All</option>
                            <option value="Pending">Pending</option>
                            <option value="In Review">In Review</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                    </div>
                 </div>
                 
                 {isLoading && <div className="text-center p-8"><div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div><p className="mt-4">Loading complaints...</p></div>}
                 
                 {!isLoading && filteredComplaints.length === 0 && (
                     <p className="text-center text-text-light-dark p-8">
                        {filter === 'All' ? 'No complaints have been submitted yet.' : `No ${filter.toLowerCase()} complaints found.`}
                    </p>
                 )}

                 {!isLoading && filteredComplaints.length > 0 && (
                     <div className="space-y-4">
                        {filteredComplaints.map(c => (
                            <div key={c.id} className="bg-card-light/50 dark:bg-card-dark/50 border border-border-light dark:border-border-dark rounded-xl p-5 flex flex-col sm:flex-row items-start gap-4">
                                <div className="text-3xl mt-1">{c.category ? categoryIcons[c.category] : '❔'}</div>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-lg">{c.category || 'N/A'}</span>
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full border hidden sm:block ${statusColors[c.status]}`}>{c.status}</span>
                                    </div>
                                    <p className="text-text-light-light dark:text-text-light-dark">{c.description}</p>
                                     <span className="text-xs text-text-light-light dark:text-text-light-dark mt-2 block">{c.date} • ID: {c.id} {c.anonymous && '• 🕶️ Anonymous'}</span>
                                </div>
                                <div className="w-full sm:w-auto mt-4 sm:mt-0 flex items-center justify-end gap-2">
                                    <label htmlFor={`status-${c.id}`} className="text-sm font-medium">Status:</label>
                                    <select 
                                        id={`status-${c.id}`}
                                        value={c.status}
                                        onChange={(e) => handleStatusChange(c.id, e.target.value as ComplaintStatus)}
                                        className="bg-white/5 dark:bg-black/20 border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In Review">In Review</option>
                                        <option value="Resolved">Resolved</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                     </div>
                 )}
            </div>
        </div>
    );
};

export default FacultyDashboardPage;
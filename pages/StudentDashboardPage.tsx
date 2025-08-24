import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Page, Complaint, ComplaintCategory, ComplaintStatus } from '../types';
import { GoogleGenAI } from "@google/genai";
import { getComplaints, addComplaint } from '../services/complaintService';


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

// This will be populated by Vite from the VITE_GEMINI_API_KEY environment variable.
// Set this in your hosting provider's settings (Vercel, Netlify, etc.).
const GEMINI_API_KEY = process.env.API_KEY;

interface StudentDashboardPageProps {
  onNavigate: (page: Page) => void;
}

const StudentDashboardPage: React.FC<StudentDashboardPageProps> = ({ onNavigate }) => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<ComplaintCategory>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuggesting, setIsSuggesting] = useState(false);
    
    useEffect(() => {
        setComplaints(getComplaints());
    }, []);

    const ai = useMemo(() => {
        if (GEMINI_API_KEY) {
            try {
                return new GoogleGenAI({ apiKey: GEMINI_API_KEY });
            } catch (e) {
                console.error("Failed to initialize Gemini AI:", e);
                return null;
            }
        }
        return null;
    }, []);

    const handleLogout = () => {
        onNavigate(Page.Home);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !category) {
            alert('Please fill out all fields.');
            return;
        }
        setIsSubmitting(true);
        
        // Use the local service instead of Formspree
        const newComplaint = addComplaint({
            category,
            description,
            anonymous: false, // Submissions from dashboard are not anonymous
        });
        
        // Simulate network delay for better UX
        setTimeout(() => {
            setComplaints(prev => [newComplaint, ...prev]);
            setDescription('');
            setCategory('');
            setIsSubmitting(false);
        }, 500);
    };
    
    const getCategorySuggestion = useCallback(async (text: string) => {
        // Only suggest if AI is enabled and for longer descriptions
        if (!ai || text.trim().split(' ').length < 5) return;
        setIsSuggesting(true);
        try {
            const prompt = `Based on the following complaint, categorize it into one of these exact categories: Infrastructure, Academics, Facilities, Other. Respond with only the category name.\n\nComplaint: "${text}"`;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            const suggestedCategory = response.text.trim() as ComplaintCategory;
            if (['Infrastructure', 'Academics', 'Facilities', 'Other'].includes(suggestedCategory)) {
                setCategory(suggestedCategory);
            }
        } catch (error) {
            console.error("Error fetching category suggestion:", error);
        } finally {
            setIsSuggesting(false);
        }
    }, [ai]);

    useEffect(() => {
        const handler = setTimeout(() => {
            getCategorySuggestion(description);
        }, 1000); // Debounce API call

        return () => {
            clearTimeout(handler);
        };
    }, [description, getCategorySuggestion]);

    return (
        <div className="w-full max-w-4xl animate-fadeInUp p-4">
            <header className="flex justify-between items-center mb-8">
                <h1 className="font-display text-3xl font-bold">Student Dashboard</h1>
                <button 
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-primary hover:underline"
                >
                    Logout &rarr;
                </button>
            </header>

            {/* Submit Complaint Card */}
            <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-2xl shadow-glow-light dark:shadow-glow-dark p-8 mb-10">
                <h2 className="text-xl font-bold mb-6">Register a New Complaint</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Category */}
                        <div>
                          <label htmlFor="category" className="block text-sm font-medium text-text-light-mode dark:text-text-light-dark mb-2">
                            Category
                            {!ai && (
                                <span className="text-xs ml-2 font-normal text-text-light-light dark:text-text-light-dark" title="Set your VITE_GEMINI_API_KEY environment variable in your hosting platform (Vercel, Netlify, etc) to enable this.">(AI Suggestion Disabled)</span>
                            )}
                          </label>
                           <div className="relative">
                            <select 
                                id="category" 
                                name="category" 
                                required
                                value={category}
                                onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                                className="w-full appearance-none px-4 py-3 bg-white/5 dark:bg-black/20 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                            >
                                <option value="">Choose a category</option>
                                <option value="Infrastructure">🏗️ Infrastructure</option>
                                <option value="Academics">📚 Academics</option>
                                <option value="Facilities">🚰 Facilities (Wi-Fi, Water, etc.)</option>
                                <option value="Other">💬 Other</option>
                            </select>
                            {isSuggesting && <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>}
                           </div>
                        </div>
                         {/* Spacer */}
                        <div></div>
                         {/* Description */}
                        <div className="md:col-span-2">
                            <label htmlFor="description" className="block text-sm font-medium text-text-light-mode dark:text-text-light-dark mb-2">Description</label>
                            <textarea 
                                id="description" 
                                name="description" 
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Please describe your issue in detail..." 
                                required
                                className="w-full px-4 py-3 bg-white/5 dark:bg-black/20 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                            ></textarea>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full md:w-auto float-right py-3 px-6 font-semibold text-white bg-gradient-to-r from-primary to-secondary rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-glow-button disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                    </button>
                </form>
            </div>
            
            {/* Complaint History */}
            <div>
                 <h2 className="text-xl font-bold mb-6">All Submitted Complaints</h2>
                 <div className="space-y-4">
                    {complaints.map(c => (
                        <div key={c.id} className="bg-card-light/50 dark:bg-card-dark/50 border border-border-light dark:border-border-dark rounded-xl p-5 flex items-start gap-4 transition-all duration-300 hover:border-primary/50">
                            <div className="text-3xl mt-1">{c.category ? categoryIcons[c.category] : '❔'}</div>
                            <div className="flex-grow">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-lg">{c.category || 'N/A'}</span>
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusColors[c.status]}`}>{c.status}</span>
                                </div>
                                <p className="text-text-light-light dark:text-text-light-dark my-2">{c.description}</p>
                                <span className="text-xs text-text-light-light dark:text-text-light-dark">{c.date} • ID: {c.id} {c.anonymous && '• 🕶️ Anonymous'}</span>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>

        </div>
    );
};

export default StudentDashboardPage;
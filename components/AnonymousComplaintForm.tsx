import React, { useState, useEffect } from 'react';
import { addComplaint } from '../services/complaintService';
import { ComplaintCategory } from '../types';

const AnonymousComplaintForm: React.FC = () => {
    const [category, setCategory] = useState<ComplaintCategory>('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const createConfetti = () => {
        const confettiContainer = document.body;
        const colors = ['#4361ee', '#7209b7', '#f72585', '#ffca2c', '#4cc9f0'];
        for (let i = 0; i < 50; i++) {
          const c = document.createElement('div');
          c.style.position = 'fixed';
          c.style.width = '10px';
          c.style.height = '10px';
          c.style.pointerEvents = 'none';
          c.style.zIndex = '9999';
          c.style.left = Math.random() * 100 + 'vw';
          c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
          confettiContainer.appendChild(c);
          const animation = c.animate([
            { transform: 'translate(0,0) rotate(0)', opacity: 1 },
            { transform: `translate(${Math.random()*100-50}px,100vh) rotate(720deg)`, opacity: 0 }
          ], { duration: 3000 + Math.random() * 2000, easing: 'ease-out' });
          animation.onfinish = () => c.remove();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!category || !description) {
            alert('Please fill out all fields.');
            return;
        }
        setIsSubmitting(true);
        addComplaint({ category, description, anonymous: true });

        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            createConfetti();
        }, 1000); // Simulate network delay
    };

    if (isSuccess) {
        return (
            <div className="text-center p-8 bg-green-500/10 text-green-400 border border-green-500/20 rounded-2xl animate-popIn">
                <h3 className="text-xl font-bold">✅ Thank You!</h3>
                <p className="mt-2">Your anonymous complaint has been submitted successfully.</p>
            </div>
        );
    }
    
    return (
        <div className="w-full text-left bg-card-light/50 dark:bg-card-dark/50 border border-border-light dark:border-border-dark rounded-2xl shadow-glow-light dark:shadow-glow-dark p-8 backdrop-blur-sm">
             <h3 className="font-display text-xl font-bold text-text-light-mode dark:text-text-dark mb-6">Submit Anonymously</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="anon-category" className="block text-sm font-medium text-text-light-mode dark:text-text-light-dark mb-2">
                    Category
                  </label>
                  <select 
                        id="anon-category" 
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
                </div>
                 <div>
                    <label htmlFor="anon-description" className="block text-sm font-medium text-text-light-mode dark:text-text-light-dark mb-2">Description</label>
                    <textarea 
                        id="anon-description" 
                        name="description" 
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Please describe your issue..." 
                        required
                        className="w-full px-4 py-3 bg-white/5 dark:bg-black/20 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 font-semibold text-white bg-gradient-to-r from-primary to-secondary rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-glow-button disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                </button>
            </form>
        </div>
    );
};

export default AnonymousComplaintForm;

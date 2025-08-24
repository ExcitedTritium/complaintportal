import { Complaint, ComplaintStatus, ComplaintCategory } from '../types';

const STORAGE_KEY = 'campusComplaints';

const getInitialData = (): Complaint[] => {
    // Some initial data to make the app look populated
    return [
        { id: 'C001', category: 'Facilities', description: 'Wi-Fi in the library is very slow and disconnects frequently.', date: '2024-07-28', status: 'Resolved', anonymous: false },
        { id: 'C002', category: 'Infrastructure', description: 'The projector in room 3B is not working.', date: '2024-07-29', status: 'In Review', anonymous: true },
        { id: 'C003', category: 'Academics', description: 'The syllabus for course CS101 is not available online yet.', date: '2024-07-30', status: 'Pending', anonymous: false },
    ];
};

export const getComplaints = (): Complaint[] => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            return JSON.parse(data);
        } else {
            const initialData = getInitialData();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
            return initialData;
        }
    } catch (error) {
        console.error("Failed to retrieve complaints from localStorage:", error);
        return getInitialData();
    }
};

export const addComplaint = (newComplaintData: { category: ComplaintCategory; description: string; anonymous: boolean }): Complaint => {
    const complaints = getComplaints();
    const complaint: Complaint = {
        ...newComplaintData,
        id: `C${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
    };
    const updatedComplaints = [complaint, ...complaints];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedComplaints));
    return complaint;
};

export const updateComplaintStatus = (id: string, status: ComplaintStatus): Complaint[] => {
    const complaints = getComplaints();
    const updatedComplaints = complaints.map(c => c.id === id ? { ...c, status } : c);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedComplaints));
    return updatedComplaints;
};

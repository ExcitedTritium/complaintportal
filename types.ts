export enum Page {
  Home = 'Home',
  StudentLogin = 'StudentLogin',
  FacultyLogin = 'FacultyLogin',
  StudentDashboard = 'StudentDashboard',
  FacultyDashboard = 'FacultyDashboard',
}

export type ComplaintStatus = 'Pending' | 'In Review' | 'Resolved';
export type ComplaintCategory = 'Infrastructure' | 'Academics' | 'Facilities' | 'Other' | '';

export interface Complaint {
  id: string;
  category: ComplaintCategory;
  description: string;
  date: string;
  status: ComplaintStatus;
  anonymous: boolean;
}

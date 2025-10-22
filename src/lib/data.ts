
export type Idea = {
  id: string;
  title: string;
  description: string;
  author: string;
  authorId: string;
  upvotes: string[]; // array of user uids
  status: "Pending" | "Approved" | "Rejected" | "Completed";
};

export type Directive = {
  id: string;
  title: string;
  status: "In Progress" | "Completed" | "Under Review" | "Ana ci gaba" | "An kammala" | "Ana dubawa";
  description: string;
  updates: string[];
};

export type VolunteerOpportunity = {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
};

export type UserRole = 
    | "Citizen" 
    | "MDA Official" 
    | "Moderator" 
    | "Special Adviser" 
    | "Governor";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  location?: string;
  mda?: string; // MDA the user belongs to, if applicable
  submittedIdeas: string[]; // array of idea ids
  votedOnIdeas: string[]; // array of idea ids
  followedDirectives: string[]; // array of directive ids
  volunteeredFor: string[]; // array of opportunity ids
};

export type Testimonial = {
    name: string;
    location: string;
    quote: string;
}

export type FAQ = {
    question: string;
    answer: string;
}

export type MDA = {
    id: string;
    name: string;
}

export type ApprovalStatus = "Pending" | "Approved" | "Rejected" | "ReadyForIssuance" | "Issued";

export type ApprovalItem = { 
    id: string; 
    type: string; 
    title: string; 
    description: string;
    submittedBy: string; 
    status: ApprovalStatus;
    reason?: string;
    governorSignature?: string;
    approvalDate?: string;
    assignedMdaId?: string;
};

export const mdas: MDA[] = [
    { id: "mda-health", name: "Ministry of Health" },
    { id: "mda-works", name: "Ministry of Works & Infrastructure" },
    { id: "mda-edu", name: "Ministry of Education" },
    { id: "mda-env", name: "Ministry of Environment" },
    { id: "mda-water", name: "Ministry of Water Resources" },
    { id: "mda-agric", name: "Ministry of Agriculture" },
];

export const seededUsers: (Omit<UserProfile, 'uid' | 'submittedIdeas' | 'votedOnIdeas' | 'followedDirectives' | 'volunteeredFor'> & {email: string})[] = [
    { name: "Citizen User", email: "citizen@test.com", role: "Citizen" },
    { name: "MDA Official", email: "mda@test.com", role: "MDA Official", mda: "mda-health" },
    { name: "Content Moderator", email: "moderator@test.com", role: "Moderator" },
    { name: "Special Adviser", email: "adviser@test.com", role: "Special Adviser" },
    { name: "Governor", email: "governor@test.com", role: "Governor" },
];

export const initialApprovalItems: ApprovalItem[] = [
    { id: "app-1", type: "SPD Communiqué", title: "Report from Q2 Special Public Dialogue on Security", description: "This is a detailed report from the Q2 SPD meeting focused on community policing initiatives and neighborhood watch programs.", submittedBy: "SPD Coordinator", status: "Pending"},
    { id: "app-2", type: "Drafted Directive", title: "Recommendations for Waste Management Improvement", description: "A policy brief outlining three key recommendations for improving waste collection efficiency and introducing recycling incentives.", submittedBy: "Special Adviser", status: "Pending"},
    { id: "app-4", type: "Drafted Directive", title: "Kano Market Modernization", description: "An idea to modernize the Kantin Kwari market with better stalls, improved sanitation, and a digital payment system.", submittedBy: "Special Adviser", status: "Rejected", reason: "This project is too large for the current budget cycle. Please resubmit with a phased approach for consideration next year."},
    { id: "app-5", type: "Drafted Directive", title: "Youth Sports Development Fund", description: "A proposal to create a dedicated fund to support local youth sports teams and facilities.", submittedBy: "Special Adviser", status: "Pending"},
    { id: "app-6", type: "Drafted Directive", title: "Public Wi-Fi Hotspots", description: "A plan to install free public Wi-Fi hotspots in major parks and public squares to increase digital access.", submittedBy: "Special Adviser", status: "ReadyForIssuance", governorSignature: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR42mP8/wcAAwAB/epv2AAAAABJRU5ErkJggg==", approvalDate: new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })},
]


import type { Timestamp } from 'firebase/firestore';

export type Idea = {
  id: string;
  title: string;
  description: string;
  author: string;
  authorId: string;
  upvotes: string[]; // array of user uids
  status: "Pending" | "Approved" | "Rejected" | "Completed";
  moderatorApproved?: boolean;
  createdAt: Timestamp | Date;
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
  createdAt: Timestamp | Date;
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

export const initialApprovalItems: ApprovalItem[] = [
]

// These users are for demonstration purposes and are available for login.
// All have the password "Password123"
export const seededUsers = [
    {
        uid: 'governor-001',
        name: "Executive Governor",
        email: "governor@test.com",
        role: "Governor" as UserRole,
        password: "Password123",
        createdAt: new Date(),
        submittedIdeas: [],
        votedOnIdeas: [],
        followedDirectives: [],
        volunteeredFor: [],
    },
    {
        uid: 'adviser-001',
        name: "Special Adviser",
        email: "adviser@test.com",
        role: "Special Adviser" as UserRole,
        password: "Password123",
        createdAt: new Date(),
        submittedIdeas: [],
        votedOnIdeas: [],
        followedDirectives: [],
        volunteeredFor: [],
    },
    {
        uid: 'moderator-001',
        name: "Content Moderator",
        email: "moderator@test.com",
        role: "Moderator" as UserRole,
        password: "Password123",
        createdAt: new Date(),
        submittedIdeas: [],
        votedOnIdeas: [],
        followedDirectives: [],
        volunteeredFor: [],
    },
    {
        uid: 'mda-official-001',
        name: "MDA Official",
        email: "mda@test.com",
        role: "MDA Official" as UserRole,
        mda: 'mda-works',
        password: "Password123",
        createdAt: new Date(),
        submittedIdeas: [],
        votedOnIdeas: [],
        followedDirectives: [],
        volunteeredFor: [],
    }
];

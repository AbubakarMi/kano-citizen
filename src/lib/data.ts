
export type Idea = {
  id: string;
  title: string;
  description: string;
  author: string;
  authorId: string;
  upvotes: string[]; // array of user uids
  status: "Pending" | "Approved" | "Rejected";
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
    | "SPD Coordinator" 
    | "System Administrator" 
    | "Super Admin";

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
    { name: "SPD Coordinator", email: "spd@test.com", role: "SPD Coordinator" },
    { name: "System Admin", email: "sysadmin@test.com", role: "System Administrator" },
    { name: "Super Admin", email: "superadmin@test.com", role: "Super Admin" },
];
